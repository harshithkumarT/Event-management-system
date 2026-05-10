import { useEffect, useState } from 'react';
import { markAllNotificationsRead, markNotificationRead, fetchNotifications } from '../../services/notifications';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const { data } = await fetchNotifications();
    setNotifications(data.data.notifications);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    loadNotifications();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <PageHeader eyebrow="Alerts" title="Notifications" description="Realtime booking and admin updates." />
        <Button variant="secondary" onClick={handleReadAll}>Mark all read</Button>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={notification.is_read ? 'opacity-70' : ''}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-white">{notification.message}</p>
                <p className="text-sm text-slate-400">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              {!notification.is_read ? <Button size="sm" variant="secondary" onClick={() => handleRead(notification.id)}>Read</Button> : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}