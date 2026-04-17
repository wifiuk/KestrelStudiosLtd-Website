const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...init.headers,
    },
  });

const buildCorsHeaders = (origin, allowedOrigin) => {
  const allowOrigin = allowedOrigin && origin === allowedOrigin ? origin : allowedOrigin || '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
};

const sanitize = (value) => String(value ?? '').trim();

const getClientIp = (request) =>
  request.headers.get('CF-Connecting-IP') ||
  request.headers.get('X-Forwarded-For') ||
  '';

const validatePayload = (payload) => {
  const errors = [];

  if (!sanitize(payload.fullName)) errors.push('Full name is required.');
  if (!sanitize(payload.email)) errors.push('Email address is required.');
  if (!sanitize(payload.service)) errors.push('Please select a service.');
  if (!sanitize(payload.projectLocation)) errors.push('Project location is required.');
  if (!sanitize(payload.projectDetails)) errors.push('Project details are required.');
  if (!sanitize(payload.turnstileToken)) errors.push('Turnstile verification token is missing.');
  if (sanitize(payload.website)) errors.push('Spam submission rejected.');

  return errors;
};

const verifyTurnstile = async ({ secret, token, remoteIp }) => {
  const formData = new FormData();
  formData.set('secret', secret);
  formData.set('response', token);
  formData.set('idempotency_key', crypto.randomUUID());

  if (remoteIp) {
    formData.set('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Turnstile verification failed with status ${response.status}.`);
  }

  return response.json();
};

const sendQuoteEmail = async ({
  forwardEmailApiToken,
  forwardEmailFromEmail,
  quoteToEmail,
  payload,
}) => {
  const submittedAt = new Date().toISOString();
  const subject = `New quote request: ${sanitize(payload.service)} - ${sanitize(payload.fullName)}`;

  const lines = [
    `Name: ${sanitize(payload.fullName)}`,
    `Email: ${sanitize(payload.email)}`,
    `Phone: ${sanitize(payload.phone) || 'Not provided'}`,
    `Business: ${sanitize(payload.businessName) || 'Not provided'}`,
    `Service: ${sanitize(payload.service)}`,
    `Project location: ${sanitize(payload.projectLocation)}`,
    `Preferred date: ${sanitize(payload.preferredDate) || 'Not provided'}`,
    `Reference notes: ${sanitize(payload.referenceNotes) || 'Not provided'}`,
    `Submitted from: ${sanitize(payload.submittedFrom) || 'Not provided'}`,
    `Submitted at: ${submittedAt}`,
    '',
    'Project details:',
    sanitize(payload.projectDetails),
  ];

  const authToken = btoa(`${forwardEmailApiToken}:`);
  const response = await fetch('https://api.forwardemail.net/v1/emails', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: forwardEmailFromEmail,
      to: quoteToEmail,
      subject,
      text: lines.join('\n'),
      replyTo: sanitize(payload.email),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Forward Email send failed: ${errorText}`);
  }

  return response.json();
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = buildCorsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== 'POST') {
      return json(
        { success: false, message: 'Method not allowed.' },
        { status: 405, headers: corsHeaders },
      );
    }

    if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) {
      return json(
        { success: false, message: 'Origin not allowed.' },
        { status: 403, headers: corsHeaders },
      );
    }

    if (
      !env.TURNSTILE_SECRET_KEY ||
      !env.FORWARD_EMAIL_API_TOKEN ||
      !env.FORWARD_EMAIL_FROM_EMAIL ||
      !env.QUOTE_TO_EMAIL ||
      !env.ALLOWED_ORIGIN
    ) {
      return json(
        { success: false, message: 'Server is not configured.' },
        { status: 500, headers: corsHeaders },
      );
    }

    let payload;

    try {
      payload = await request.json();
    } catch {
      return json(
        { success: false, message: 'Invalid JSON payload.' },
        { status: 400, headers: corsHeaders },
      );
    }

    const validationErrors = validatePayload(payload);

    if (validationErrors.length > 0) {
      return json(
        { success: false, message: validationErrors[0] },
        { status: 400, headers: corsHeaders },
      );
    }

    try {
      const turnstileResult = await verifyTurnstile({
        secret: env.TURNSTILE_SECRET_KEY,
        token: sanitize(payload.turnstileToken),
        remoteIp: getClientIp(request),
      });

      if (!turnstileResult.success) {
        return json(
          {
            success: false,
            message: 'Human verification failed. Please try again.',
            errorCodes: turnstileResult['error-codes'] ?? [],
          },
          { status: 400, headers: corsHeaders },
        );
      }

      await sendQuoteEmail({
        forwardEmailApiToken: env.FORWARD_EMAIL_API_TOKEN,
        forwardEmailFromEmail: env.FORWARD_EMAIL_FROM_EMAIL,
        quoteToEmail: env.QUOTE_TO_EMAIL,
        payload,
      });

      return json(
        { success: true },
        { status: 200, headers: corsHeaders },
      );
    } catch (error) {
      console.error('Quote form submission failed:', error);
      return json(
        {
          success: false,
          message: 'We could not send your request right now. Please try again shortly.',
        },
        { status: 502, headers: corsHeaders },
      );
    }
  },
};
