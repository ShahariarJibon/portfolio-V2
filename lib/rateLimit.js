// In-memory sliding window rate limiter

const rateLimitMap = new Map();

/**
 * Check if a request exceeds rate limits.
 * @param {string} key - Unique identifier (e.g. IP + endpoint)
 * @param {number} limit - Maximum allowed requests in window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ success: boolean, remaining: number, resetAt: number }}
 */
export function rateLimit(key, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };

  // Periodically clean up stale entries (every 1000 items)
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }

  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    rateLimitMap.set(key, record);
    return { success: true, remaining: limit - 1, resetAt: record.resetAt };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  rateLimitMap.set(key, record);
  return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
}
