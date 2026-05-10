import { useEffect, useState } from 'react';
import { fetchEvents } from '../../services/events';
import { EventFilters } from '../../components/events/EventFilters';
import { EventCard } from '../../components/events/EventCard';
import { PageHeader } from '../../components/common/PageHeader';
import { Skeleton } from '../../components/ui/Skeleton';

const initialFilters = { search: '', category: '', sort: 'date_asc', page: 1, limit: 9 };

export default function EventsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1 });
  const [loading, setLoading] = useState(true);

  const loadEvents = async (nextFilters = filters) => {
    setLoading(true);
    try {
      const { data } = await fetchEvents(nextFilters);
      setEvents(data.data.events);
      setMeta(data.meta || { total: data.data.total, page: nextFilters.page });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilter = (key, value) => {
    const nextFilters = { ...filters, [key]: value, page: 1 };
    setFilters(nextFilters);
    loadEvents(nextFilters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    loadEvents(initialFilters);
  };

  return (
    <div className="section-padding">
      <div className="container-shell">
        <PageHeader
          eyebrow="Browse"
          title="Discover events tailored to every audience"
          description="Search by keyword, narrow by category, and sort by schedule or price."
        />

        <EventFilters filters={filters} onChange={updateFilter} onReset={resetFilters} />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-96 rounded-3xl" />)
            : events.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-slate-400">
          <span>
            Showing {events.length} of {meta.total} events
          </span>
        </div>
      </div>
    </div>
  );
}