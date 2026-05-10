import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchEventById } from '../../services/events';
import { createBooking } from '../../services/bookings';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [booking, setBooking] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { quantity: 1, paymentMethod: 'card' } });

  useEffect(() => {
    fetchEventById(id).then((response) => setEvent(response.data.data.event)).catch(() => setEvent(null));
  }, [id]);

  const onSubmit = async (values) => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      return;
    }

    const response = await createBooking({ eventId: Number(id), quantity: Number(values.quantity), paymentMethod: values.paymentMethod });
    setBooking(response.data.data);
    toast.success('Booking submitted');
  };

  if (!event) {
    return <div className="section-padding container-shell text-slate-300">Loading event details...</div>;
  }

  return (
    <div className="section-padding">
      <div className="container-shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <PageHeader eyebrow={event.category} title={event.title} description={event.description} />
          <Card className="overflow-hidden p-0">
            <img src={event.banner_image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'} alt={event.title} className="h-80 w-full object-cover" />
          </Card>
          <Card>
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-slate-400">Venue</p><p className="text-white">{event.venue}</p></div>
              <div><p className="text-slate-400">Date & Time</p><p className="text-white">{event.date} • {event.time}</p></div>
              <div><p className="text-slate-400">Price</p><p className="text-white">${event.price}</p></div>
              <div><p className="text-slate-400">Seats Available</p><p className="text-white">{event.available_seats}</p></div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-semibold text-white">Book tickets</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                type="number"
                label="Quantity"
                min="1"
                max="20"
                {...register('quantity', { required: 'Quantity is required', min: { value: 1, message: 'Minimum 1 ticket' } })}
                error={errors.quantity?.message}
              />
              <Input
                label="Payment method"
                {...register('paymentMethod', { required: true })}
                placeholder="card, razorpay, stripe"
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Reserve seats'}
              </Button>
            </form>
          </Card>

          {booking ? (
            <Card>
              <h3 className="text-lg font-semibold text-white">Booking confirmation</h3>
              <p className="mt-2 text-sm text-slate-300">Your request is stored and awaiting admin confirmation.</p>
              <p className="mt-4 text-sm text-slate-400">Booking ID: {booking.booking.id}</p>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}