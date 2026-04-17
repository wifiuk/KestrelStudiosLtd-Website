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
const MAX_FIELD_LENGTH = 4000;
const MAX_PROJECT_DETAILS_LENGTH = 12000;
const MAX_FILES = 3;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE_BYTES = 12 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getClientIp = (request) =>
  request.headers.get('CF-Connecting-IP') ||
  request.headers.get('X-Forwarded-For') ||
  '';

const normalizeField = (value, maxLength = MAX_FIELD_LENGTH) => sanitize(value).slice(0, maxLength);

const normalizeFilename = (name) =>
  sanitize(name)
    .replace(/[^\w.\-() ]+/g, '_')
    .slice(0, 120) || 'attachment';

const base64Encode = (bytes) => {
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

const encodeUtf8ToBase64 = (value) => base64Encode(new TextEncoder().encode(value));

const parseRequest = async (request) => {
  const contentType = request.headers.get('Content-Type') || '';

  if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    const files = formData
      .getAll('referenceFiles')
      .filter((entry) => entry instanceof File && entry.size > 0);

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
      files,
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
    files: [],
  };
};

const validatePayload = (payload, files) => {
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
  if (files.length > MAX_FILES) errors.push(`No more than ${MAX_FILES} files are allowed.`);

  let totalFileSize = 0;
  for (const file of files) {
    totalFileSize += file.size;
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      errors.push('Only PDF, JPG, PNG, and WEBP files are allowed.');
      break;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push('Each uploaded file must be 5MB or smaller.');
      break;
    }
  }

  if (totalFileSize > MAX_TOTAL_FILE_SIZE_BYTES) {
    errors.push('Uploaded files are too large.');
  }

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

const buildEmailContent = (payload, files) => {
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
    `Files attached: ${files.length > 0 ? files.map((file) => normalizeFilename(file.name)).join(', ') : 'None'}`,
    '',
    'Project details:',
    sanitize(payload.projectDetails),
  ];

  return {
    subject,
    text: lines.join('\n'),
  };
};

const buildRawEmail = async ({
  from,
  to,
  replyTo,
  subject,
  text,
  files,
}) => {
  const boundary = `fe-${crypto.randomUUID()}`;
  const attachmentParts = await Promise.all(files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const base64Content = base64Encode(new Uint8Array(arrayBuffer));
    const filename = normalizeFilename(file.name);

    return [
      `--${boundary}`,
      `Content-Type: ${file.type}; name="${filename}"`,
      `Content-Disposition: attachment; filename="${filename}"`,
      'Content-Transfer-Encoding: base64',
      '',
      base64Content,
    ].join('\r\n');
  }));

  return [
    `From: ${from}`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    encodeUtf8ToBase64(text),
    ...attachmentParts,
    `--${boundary}--`,
    '',
  ].join('\r\n');
};

const sendQuoteEmail = async ({
  forwardEmailApiToken,
  forwardEmailFromEmail,
  quoteToEmail,
  payload,
  files,
}) => {
  const { subject, text } = buildEmailContent(payload, files);

  const authToken = btoa(`${forwardEmailApiToken}:`);
  const requestBody = new URLSearchParams();

  if (files.length > 0) {
    requestBody.set('raw', await buildRawEmail({
      from: forwardEmailFromEmail,
      to: quoteToEmail,
      replyTo: sanitize(payload.email),
      subject,
      text,
      files,
    }));
  } else {
    requestBody.set('from', forwardEmailFromEmail);
    requestBody.set('to', quoteToEmail);
    requestBody.set('subject', subject);
    requestBody.set('text', text);
    requestBody.set('replyTo', sanitize(payload.email));
  }

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
    let files;

    try {
      const parsedRequest = await parseRequest(request);
      payload = parsedRequest.payload;
      files = parsedRequest.files;
    } catch {
      return json(
        { success: false, message: 'Invalid request payload.' },
        { status: 400, headers: corsHeaders },
      );
    }

    const validationErrors = validatePayload(payload, files);

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
        files,
      });

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
