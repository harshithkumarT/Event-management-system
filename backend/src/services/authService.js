import bcrypt from 'bcrypt';
import { ApiError } from '../utils/apiError.js';
import { createUser, findUserByEmail, findUserById, updateUserProfile } from '../models/userModel.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

const buildTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  name: user.name,
});

export const registerUser = async ({ name, email, password, role = 'user' }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, 'Email already exists');
  }

  const assignedRole = role === 'admin' ? 'admin' : 'user';
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await createUser({ name, email, password: hashedPassword, role: assignedRole });

  return {
    user,
    accessToken: signAccessToken(buildTokenPayload(user)),
    refreshToken: signRefreshToken(buildTokenPayload(user)),
  };
};

export const loginUser = async ({ email, password }) => {
  const userRecord = await findUserByEmail(email);
  if (!userRecord) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, userRecord.password);
  if (!isValidPassword) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const user = await findUserById(userRecord.id);
  return {
    user,
    accessToken: signAccessToken(buildTokenPayload(user)),
    refreshToken: signRefreshToken(buildTokenPayload(user)),
  };
};

export const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  const { verifyRefreshToken } = await import('../utils/jwt.js');
  const payload = verifyRefreshToken(refreshToken);
  const user = await findUserById(payload.id);

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  return {
    user,
    accessToken: signAccessToken(buildTokenPayload(user)),
  };
};

export const updateProfile = async ({ userId, name, profileImage }) => {
  const user = await updateUserProfile(userId, { name, profileImage });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};