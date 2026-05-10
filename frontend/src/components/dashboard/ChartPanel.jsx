import { Card } from '../ui/Card';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export const RevenueChart = ({ data }) => (
  <Card>
    <h3 className="mb-6 text-lg font-semibold text-white">Revenue trend</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.12)' }} />
          <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export const CategoryChart = ({ data }) => (
  <Card>
    <h3 className="mb-6 text-lg font-semibold text-white">Event categories</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
          <XAxis dataKey="category" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.12)' }} />
          <Bar dataKey="count" fill="#60a5fa" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);