import { Card } from '../ui/Card';

export const StatCard = ({ label, value, description, accent = 'from-accent-500 to-cyan-300' }) => (
  <Card className="relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-10`} />
    <div className="relative">
      <p className="text-sm text-slate-400">{label}</p>
      <h3 className="mt-3 text-3xl font-semibold text-white">{value}</h3>
      {description ? <p className="mt-2 text-sm text-slate-300">{description}</p> : null}
    </div>
  </Card>
);