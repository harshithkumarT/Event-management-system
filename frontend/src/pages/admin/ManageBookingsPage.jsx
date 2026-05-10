import { useEffect, useState } from 'react';
import { fetchAllBookings, updateBookingDecision } from '../../services/bookings';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/dashboard/DataTable';
import { Button } from '../../components/ui/Button';

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    const { data } = await fetchAllBookings({ page: 1, limit: 50 });
    setBookings(data.data.bookings);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDecision = async (row, bookingStatus) => {
    await updateBookingDecision(row.id, { bookingStatus });
    loadBookings();
  };

  const columns = [
    { key: 'user_name', label: 'User' },
    { key: 'event_title', label: 'Event' },
    { key: 'quantity', label: 'Qty' },
    { key: 'booking_status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleDecision(row, 'confirmed')}>Approve</Button>
          <Button size="sm" variant="danger" onClick={() => handleDecision(row, 'rejected')}>Reject</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Manage" title="Bookings" description="Approve or reject ticket reservations." />
      <DataTable columns={columns} rows={bookings} />
    </div>
  );
}