import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../../services/admin';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { RevenueChart, CategoryChart } from '../../components/dashboard/ChartPanel';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics().then((response) => setAnalytics(response.data.data.analytics));
  }, []);

  if (!analytics) {
    return <div className="text-slate-300">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Overview" title="Admin dashboard" description="Track bookings, revenue, and event performance." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total events" value={analytics.eventStats.total_events} description="Published events" />
        <StatCard label="Total bookings" value={analytics.bookingStats.total_bookings} description="All bookings" />
        <StatCard label="Revenue" value={`$${analytics.revenueStats.total_revenue}`} description="Gross revenue" />
        <StatCard label="Pending bookings" value={analytics.bookingStats.pending_bookings} description="Requires action" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart data={analytics.monthlyRevenue} />
        <CategoryChart data={analytics.categoryStats} />
      </div>
    </div>
  );
}