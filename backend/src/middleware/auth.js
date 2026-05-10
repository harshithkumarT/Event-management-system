import { ApiError } from '../utils/apiError.js';
import { verifyAccessToken } from '../utils/jwt.js';

const getBearerToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }

  return header.split(' ')[1];
};

export const authenticate = (req, res, next) => {
  const token = getBearerToken(req) || req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired access token');
  }
};

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, 'Insufficient permissions');
  }

  next();
};