import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { getAdminAnalytics, generateRevenueReportPdf } from '../services/reportService.js';
import { listUsers, updateUserRole, toggleUserStatus } from '../models/userModel.js';

export const dashboardAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getAdminAnalytics();
  return apiResponse(res, 200, 'Analytics fetched', { analytics });
});

export const usersList = asyncHandler(async (req, res) => {
  const users = await listUsers(req.query);
  return apiResponse(res, 200, 'Users fetched', users, { page: Number(req.query.page || 1) });
});

export const changeUserRole = asyncHandler(async (req, res) => {
  const user = await updateUserRole(req.params.id, req.body.role);
  return apiResponse(res, 200, 'User role updated', { user });
});

export const changeUserStatus = asyncHandler(async (req, res) => {
  const user = await toggleUserStatus(req.params.id, req.body.isActive);
  return apiResponse(res, 200, 'User status updated', { user });
});

export const revenueReport = asyncHandler(async (req, res) => {
  const doc = await generateRevenueReportPdf();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.pdf');
  doc.pipe(res);
});