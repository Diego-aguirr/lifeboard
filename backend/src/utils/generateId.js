import { randomBytes } from 'node:crypto';

export const generateId = () => {
  return randomBytes(12).toString('hex');
};
