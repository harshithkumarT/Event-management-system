import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

const HomePage = lazy(() => import('./pages/public/HomePage'));
const EventsPage = lazy(() => import('./pages/public/EventsPage'));
const EventDetailsPage = lazy(() => import('./pages/public/EventDetailsPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'));
const AdminLoginPage = lazy(() => import('./pages/public/AdminLoginPage'));
const AdminRegisterPage = lazy(() => import('./pages/public/AdminRegisterPage'));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'));
const BookingsPage = lazy(() => import('./pages/user/BookingsPage'));
const NotificationsPage = lazy(() => import('./pages/user/NotificationsPage'));
const SettingsPage = lazy(() => import('./pages/user/SettingsPage'));
const AdminOverviewPage = lazy(() => import('./pages/admin/DashboardPage'));
const ManageEventsPage = lazy(() => import('./pages/admin/ManageEventsPage'));
const ManageUsersPage = lazy(() => import('./pages/admin/ManageUsersPage'));
const ManageBookingsPage = lazy(() => import('./pages/admin/ManageBookingsPage'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const RevenueReportsPage = lazy(() => import('./pages/admin/RevenueReportsPage'));

const Fallback = () => <div className="flex min-h-screen items-center justify-center text-slate-200">Loading application...</div>;

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="admin/register" element={<AdminRegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={[ 'admin' ]} />}>
          <Route path="admin" element={<DashboardLayout admin />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="events" element={<ManageEventsPage />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="bookings" element={<ManageBookingsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="reports" element={<RevenueReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
