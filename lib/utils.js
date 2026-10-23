import crypto from "crypto";

const ALPHANUMERIC_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Validates a user-supplied URL.
 * Strictly enforces http and https protocols.
 *
 * @param {string} inputUrl
 * @returns {{ isValid: boolean, error?: string, normalizedUrl?: string }}
 */
export function validateUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== "string") {
    return { isValid: false, error: "Please enter a destination URL." };
  }

  const trimmed = inputUrl.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: "URL cannot be empty." };
  }

  if (trimmed.length > 2048) {
    return {
      isValid: false,
      error: "URL exceeds maximum length of 2,048 characters.",
    };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      error:
        "Invalid URL format. Please include http:// or https:// (e.g., https://example.com).",
    };
  }

  // Strictly enforce http and https protocols
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      isValid: false,
      error: `Disallowed protocol "${parsed.protocol}". Only "http://" and "https://" links are permitted.`,
    };
  }

  // Verify hostname is not empty and has valid format
  const hostname = parsed.hostname;
  if (!hostname || (hostname !== "localhost" && !hostname.includes("."))) {
    return {
      isValid: false,
      error:
        "Invalid hostname. Please provide a valid domain name (e.g., https://example.com).",
    };
  }

  return {
    isValid: true,
    normalizedUrl: parsed.href,
  };
}

/**
 * Generates a random alphanumeric short code of specified length.
 *
 * @param {number} length
 * @returns {string}
 */
export function generateRandomCode(length = 6) {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC_CHARS[bytes[i] % ALPHANUMERIC_CHARS.length];
  }
  return result;
}

/**
 * Generates a unique short code by checking for database collisions.
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {number} maxAttempts
 * @returns {Promise<string>}
 */
export async function generateUniqueShortCode(prisma, maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Start with 6 chars, expand to 7 if collision occurs repeatedly
    const length = attempt < 3 ? 6 : 7;
    const code = generateRandomCode(length);

    const existing = await prisma.shortUrl.findUnique({
      where: { shortCode: code },
      select: { id: true },
    });

    if (!existing) {
      return code;
    }
  }

  // Fallback to timestamp-augmented code if all attempts collided
  return `${generateRandomCode(4)}${Date.now().toString(36).slice(-3)}`;
}

/**
 * Formats date into a user-friendly relative or local time string.
 *
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
