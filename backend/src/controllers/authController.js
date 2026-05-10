import { body } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { getCurrentUser, loginUser, refreshUserToken, registerUser, updateProfile } from '../services/authService.js';
import { validateRequest } from '../middleware/validate.js';

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth/refresh',
  });
};

export const register = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await registerUser(req.body);
    setAuthCookies(res, accessToken, refreshToken);
    return apiResponse(res, 201, 'Registration successful', { user, accessToken });
  }),
];

export const login = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
  asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await loginUser(req.body);
    setAuthCookies(res, accessToken, refreshToken);
    return apiResponse(res, 200, 'Login successful', { user, accessToken });
  }),
];

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  return apiResponse(res, 200, 'Logout successful');
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { user, accessToken } = await refreshUserToken(token);
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return apiResponse(res, 200, 'Token refreshed', { user, accessToken });
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  return apiResponse(res, 200, 'Current user fetched', { user });
});

export const updateMe = [
  body('name').optional().trim().notEmpty(),
  validateRequest,
  asyncHandler(async (req, res) => {
    const user = await updateProfile({
      userId: req.user.id,
      name: req.body.name,
      profileImage: req.body.profileImage,
    });
    return apiResponse(res, 200, 'Profile updated', { user });
  }),
];