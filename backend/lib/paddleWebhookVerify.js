import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verifies Paddle Billing `Paddle-Signature` header (HMAC-SHA256).
 * signedPayload = `${ts}:${rawBodyString}` per Paddle docs.
 * @param {Buffer} rawBuffer
 * @param {string|undefined} signatureHeader
 * @param {string} secretKey - notification destination secret (endpoint secret)
 */
export function verifyPaddleWebhookSignature(rawBuffer, signatureHeader, secretKey) {
  if (!secretKey || !signatureHeader || !Buffer.isBuffer(rawBuffer)) return false;

  const tsMatch = /(?:^|;)ts=([^;]+)/.exec(signatureHeader);
  const h1Matches = [...signatureHeader.matchAll(/(?:^|;)h1=([^;]+)/g)].map((m) => m[1]?.trim()).filter(Boolean);

  const ts = tsMatch?.[1]?.trim();
  if (!ts || h1Matches.length === 0) return false;

  const signedPayload = `${ts}:${rawBuffer.toString('utf8')}`;
  const expectedHex = createHmac('sha256', secretKey).update(signedPayload).digest('hex');

  try {
    const expectedBuf = Buffer.from(expectedHex, 'hex');
    return h1Matches.some((h1) => {
      const got = Buffer.from(h1, 'hex');
      return expectedBuf.length === got.length && timingSafeEqual(expectedBuf, got);
    });
  } catch {
    return false;
  }
}
