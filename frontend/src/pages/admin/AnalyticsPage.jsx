import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../../services/admin';
import { PageHeader } from '../../components/common/PageHeader';
import { RevenueChart, CategoryChart } from '../../components/dashboard/ChartPanel';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics().then((response) => setAnalytics(response.data.data.analytics));
  }, []);

  if (!analytics) {
    return <div className="text-slate-300">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Analytics" title="Performance insights" description="Breakdowns by month and category." />
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart data={analytics.monthlyRevenue} />
        <CategoryChart data={analytics.categoryStats} />
      </div>
    </div>
  );
}