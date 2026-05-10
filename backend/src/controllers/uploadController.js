import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return apiResponse(res, 400, 'No file uploaded');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return apiResponse(res, 201, 'File uploaded', { fileUrl });
});