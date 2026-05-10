import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const EventCard = ({ event, index = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
    <Card className="h-full overflow-hidden p-0">
      <div className="relative h-48 overflow-hidden">
        <img src={event.banner_image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-xs text-white backdrop-blur">
          {event.category}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <p className="mt-2 h-12 overflow-hidden text-sm text-slate-300">{event.description}</p>
        </div>
        <div className="space-y-2 text-sm text-slate-400">
          <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {event.date} • {event.time}</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.venue}</p>
          <p className="flex items-center gap-2"><Ticket className="h-4 w-4" /> ${event.price} per ticket</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-400">{event.available_seats} seats left</p>
          <Button as={Link} to={`/events/${event.id}`} size="sm">
            View details
          </Button>
        </div>
      </div>
    </Card>
  </motion.div>
);