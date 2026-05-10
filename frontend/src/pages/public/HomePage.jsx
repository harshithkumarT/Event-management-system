import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, CalendarRange, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { fetchFeaturedEvents } from '../../services/events';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const features = [
  { icon: CalendarRange, title: 'Smart scheduling', copy: 'Plan and manage events with clear seat control and approvals.' },
  { icon: ShieldCheck, title: 'Secure access', copy: 'JWT auth, protected routes, and role-based control for admins.' },
  { icon: Users, title: 'Engaged attendees', copy: 'Notifications, reminders, and booking history in one place.' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchFeaturedEvents().then((response) => setFeatured(response.data.data.events)).catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <section className="section-padding">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Sparkles className="h-4 w-4 text-accent-300" />
              Premium event operations for modern teams
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Build, book, and analyze events in one polished platform.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                EventFlow brings guest browsing, ticket booking, approvals, real-time notifications, and analytics into a single SaaS-grade experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button as={Link} to="/events" size="lg">
                Explore events <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} to="/register" size="lg" variant="secondary">
                Create account
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="glass-card rounded-[2rem] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-white/5">
                <p className="text-sm text-slate-400">Active events</p>
                <p className="mt-4 text-4xl font-semibold text-white">128</p>
              </Card>
              <Card className="bg-white/5">
                <p className="text-sm text-slate-400">Seats booked</p>
                <p className="mt-4 text-4xl font-semibold text-white">8.4k</p>
              </Card>
              <Card className="bg-white/5 sm:col-span-2">
                <p className="text-sm text-slate-400">Revenue growth</p>
                <p className="mt-4 text-4xl font-semibold text-white">+42%</p>
                <div className="mt-4 h-24 rounded-2xl bg-gradient-to-r from-accent-500/20 via-cyan-400/10 to-transparent" />
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <Icon className="h-6 w-6 text-accent-300" />
                <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.copy}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent-300">Featured events</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Curated upcoming experiences</h2>
            </div>
            <Button as={Link} to="/events" variant="secondary">
              View all
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.slice(0, 3).map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}