import crypto from 'crypto';

export function generateSecureRandomHash(length = 16) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}
