import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new ApiError(400, 'Validation failed', result.array());
  }

  next();
};