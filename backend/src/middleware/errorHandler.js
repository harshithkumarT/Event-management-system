import { ApiError } from '../utils/apiError.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    details: error.details || undefined,
  });
};