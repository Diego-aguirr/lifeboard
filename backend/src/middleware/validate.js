import { ValidationError } from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    throw new ValidationError(JSON.stringify(errors));
  }

  req.body = result.data;
  next();
};
