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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
};

const sanitize = (value) => String(value ?? '').trim();
const MAX_FIELD_LENGTH = 4000;
const MAX_PROJECT_DETAILS_LENGTH = 12000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getClientIp = (request) =>
  request.headers.get('CF-Connecting-IP') ||
  request.headers.get('X-Forwarded-For') ||
  '';

const normalizeField = (value, maxLength = MAX_FIELD_LENGTH) => sanitize(value).slice(0, maxLength);

const getQuoteLocationSuggestions = async ({ apiKey, query }) => {
  const trimmedQuery = sanitize(query);
  if (!apiKey || trimmedQuery.length < 3) {
    return [];
  }

  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-goog-api-key': apiKey,
      'x-goog-fieldmask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat.mainText.text,suggestions.placePrediction.structuredFormat.secondaryText.text',
    },
    body: JSON.stringify({
      input: trimmedQuery,
      languageCode: 'en-GB',
    }),
  });

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  const dedupe = new Set();

  return (payload.suggestions ?? [])
    .map((entry) => {
      const prediction = entry.placePrediction;
      const fullText = sanitize(prediction?.text?.text);

      if (!prediction?.placeId || !fullText || dedupe.has(fullText)) {
        return null;
      }

      dedupe.add(fullText);
      return {
        placeId: prediction.placeId,
        primaryText: sanitize(prediction.structuredFormat?.mainText?.text) || fullText,
        secondaryText: sanitize(prediction.structuredFormat?.secondaryText?.text),
        fullText,
      };
    })
    .filter(Boolean)
    .slice(0, 5);
};

const parseRequest = async (request) => {
  const contentType = request.headers.get('Content-Type') || '';

  if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();

    return {
      payload: {
        fullName: normalizeField(formData.get('fullName')),
        email: normalizeField(formData.get('email')),
        phone: normalizeField(formData.get('phone')),
        businessName: normalizeField(formData.get('businessName')),
        service: normalizeField(formData.get('service')),
        projectLocation: normalizeField(formData.get('projectLocation')),
        preferredDate: normalizeField(formData.get('preferredDate')),
        projectDetails: normalizeField(formData.get('projectDetails'), MAX_PROJECT_DETAILS_LENGTH),
        referenceNotes: normalizeField(formData.get('referenceNotes')),
        website: normalizeField(formData.get('website')),
        turnstileToken: normalizeField(formData.get('turnstileToken')),
        submittedFrom: normalizeField(formData.get('submittedFrom')),
      },
    };
  }

  const payload = await request.json();
  return {
    payload: {
      fullName: normalizeField(payload.fullName),
      email: normalizeField(payload.email),
      phone: normalizeField(payload.phone),
      businessName: normalizeField(payload.businessName),
      service: normalizeField(payload.service),
      projectLocation: normalizeField(payload.projectLocation),
      preferredDate: normalizeField(payload.preferredDate),
      projectDetails: normalizeField(payload.projectDetails, MAX_PROJECT_DETAILS_LENGTH),
      referenceNotes: normalizeField(payload.referenceNotes),
      website: normalizeField(payload.website),
      turnstileToken: normalizeField(payload.turnstileToken),
      submittedFrom: normalizeField(payload.submittedFrom),
    },
  };
};

const validatePayload = (payload) => {
  const errors = [];

  if (!sanitize(payload.fullName)) errors.push('Full name is required.');
  if (!sanitize(payload.email)) errors.push('Email address is required.');
  if (sanitize(payload.email) && !EMAIL_PATTERN.test(sanitize(payload.email))) {
    errors.push('Please provide a valid email address.');
  }
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

const buildEmailContent = (payload) => {
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

  return {
    subject,
    text: lines.join('\n'),
  };
};

const sendQuoteEmail = async ({
  forwardEmailApiToken,
  forwardEmailFromEmail,
  quoteToEmail,
  payload,
}) => {
  const { subject, text } = buildEmailContent(payload);

  const authToken = btoa(`${forwardEmailApiToken}:`);
  const requestBody = new URLSearchParams();
  requestBody.set('from', forwardEmailFromEmail);
  requestBody.set('to', quoteToEmail);
  requestBody.set('subject', subject);
  requestBody.set('text', text);
  requestBody.set('replyTo', sanitize(payload.email));

  const response = await fetch('https://api.forwardemail.net/v1/emails', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: requestBody.toString(),
  });

  if (!response.ok) {
    throw new Error(`Email send failed with status ${response.status}.`);
  }

  return response.json();
};

const sendQuoteWebhook = async ({
  officeAppQuoteWebhookUrl,
  officeAppQuoteWebhookSecret,
  payload,
}) => {
  const response = await fetch(officeAppQuoteWebhookUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${officeAppQuoteWebhookSecret}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      businessName: payload.businessName,
      service: payload.service,
      projectLocation: payload.projectLocation,
      preferredDate: payload.preferredDate,
      projectDetails: payload.projectDetails,
      referenceNotes: payload.referenceNotes,
      submittedFrom: payload.submittedFrom,
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook send failed with status ${response.status}.`);
  }

  return response.json();
};

const isWebhookConfigured = (env) =>
  Boolean(env.OFFICEAPP_QUOTE_WEBHOOK_URL && env.OFFICEAPP_QUOTE_WEBHOOK_SECRET);

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
      if (request.method === 'GET') {
        const url = new URL(request.url);
        if (url.searchParams.get('action') === 'location-suggestions') {
          if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
            return json(
              { configured: Boolean(env.GOOGLE_MAPS_API_KEY), suggestions: [] },
              { status: 403, headers: corsHeaders },
            );
          }

          return json(
            {
              configured: Boolean(env.GOOGLE_MAPS_API_KEY),
              suggestions: await getQuoteLocationSuggestions({
                apiKey: env.GOOGLE_MAPS_API_KEY,
                query: url.searchParams.get('q'),
              }),
            },
            { status: 200, headers: corsHeaders },
          );
        }
      }

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
      const parsedRequest = await parseRequest(request);
      payload = parsedRequest.payload;
    } catch {
      return json(
        { success: false, message: 'Invalid request payload.' },
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

      if (isWebhookConfigured(env)) {
        try {
          await sendQuoteWebhook({
            officeAppQuoteWebhookUrl: env.OFFICEAPP_QUOTE_WEBHOOK_URL,
            officeAppQuoteWebhookSecret: env.OFFICEAPP_QUOTE_WEBHOOK_SECRET,
            payload,
          });
        } catch (error) {
          console.error(
            'Quote webhook delivery failed:',
            error instanceof Error ? error.message : 'unknown error',
          );
        }
      } else {
        console.warn('Quote webhook delivery skipped: webhook is not configured.');
      }

      return json(
        { success: true },
        { status: 200, headers: corsHeaders },
      );
    } catch (error) {
      console.error(
        'Quote form submission failed:',
        error instanceof Error ? error.message : 'unknown error',
      );
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
