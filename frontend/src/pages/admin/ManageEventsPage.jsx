import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createEvent, deleteEvent, fetchEvents } from '../../services/events';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/dashboard/DataTable';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const loadEvents = async () => {
    const { data } = await fetchEvents({ page: 1, limit: 50 });
    setEvents(data.data.events);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onSubmit = async (values) => {
    await createEvent({
      ...values,
      totalSeats: Number(values.totalSeats),
      price: Number(values.price),
      availableSeats: Number(values.totalSeats),
    });
    toast.success('Event created');
    reset();
    loadEvents();
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    toast.success('Event deleted');
    loadEvents();
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'venue', label: 'Venue' },
    { key: 'available_seats', label: 'Available' },
    { key: 'price', label: 'Price' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Manage" title="Events" description="Create and maintain event inventory." />
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Title" {...register('title', { required: true })} />
          <Input label="Category" {...register('category', { required: true })} />
          <Input label="Venue" {...register('venue', { required: true })} />
          <Input label="Date" type="date" {...register('date', { required: true })} />
          <Input label="Time" {...register('time', { required: true })} />
          <Input label="Price" type="number" step="0.01" {...register('price', { required: true })} />
          <Input label="Total seats" type="number" {...register('totalSeats', { required: true })} />
          <Input label="Banner image URL" {...register('bannerImage')} />
          <Input className="md:col-span-2" label="Description" {...register('description', { required: true })} />
          <div className="md:col-span-2"><Button type="submit">Create event</Button></div>
        </form>
      </Card>
      <DataTable columns={columns} rows={events} />
    </div>
  );
}