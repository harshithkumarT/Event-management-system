import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/common/PageHeader';

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-shell">
        <PageHeader
          eyebrow="About"
          title="Designed for teams that need clarity, control, and momentum"
          description="EventFlow is built as a premium event operations layer with guest browsing, approval workflows, dashboards, and realtime notifications."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <Card><h3 className="text-white">Guests</h3><p className="mt-3 text-sm text-slate-300">Browse, search, and book events quickly.</p></Card>
          <Card><h3 className="text-white">Users</h3><p className="mt-3 text-sm text-slate-300">Track bookings, receive notifications, and manage profiles.</p></Card>
          <Card><h3 className="text-white">Admins</h3><p className="mt-3 text-sm text-slate-300">Create events, approve bookings, and analyze revenue.</p></Card>
        </div>
      </div>
    </div>
  );
}