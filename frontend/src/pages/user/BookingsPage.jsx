import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { cancelBooking, fetchBookingHistory } from '../../services/bookings';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/dashboard/DataTable';
import { Button } from '../../components/ui/Button';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    const { data } = await fetchBookingHistory();
    setBookings(data.data.bookings);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    await cancelBooking(id);
    toast.success('Booking cancelled');
    loadBookings();
  };

  const columns = [
    { key: 'event_title', label: 'Event' },
    { key: 'quantity', label: 'Qty' },
    { key: 'booking_status', label: 'Status' },
    { key: 'payment_status', label: 'Payment' },
    { key: 'total_price', label: 'Total' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => <Button size="sm" variant="secondary" onClick={() => handleCancel(row.id)}>Cancel</Button>,
    },
  ];

  return (
    <div>
      <PageHeader eyebrow="Bookings" title="Booking history" description="Review your ticket reservations and status updates." />
      <DataTable columns={columns} rows={bookings} />
    </div>
  );
}