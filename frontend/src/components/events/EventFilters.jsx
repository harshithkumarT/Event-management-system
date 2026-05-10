import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

const categories = ['All', 'Conference', 'Workshop', 'Music', 'Sports', 'Tech', 'Business'];
const sortOptions = [
  { label: 'Date ascending', value: 'date_asc' },
  { label: 'Date descending', value: 'date_desc' },
  { label: 'Price low to high', value: 'price_asc' },
  { label: 'Price high to low', value: 'price_desc' },
];

export const EventFilters = ({ filters, onChange, onReset }) => (
  <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 lg:grid-cols-4">
    <Input label="Search" value={filters.search} onChange={(event) => onChange('search', event.target.value)} placeholder="Search by title, venue, or keyword" />
    <Select label="Category" value={filters.category} onChange={(event) => onChange('category', event.target.value)}>
      {categories.map((category) => (
        <option key={category} value={category === 'All' ? '' : category} className="bg-slate-900">
          {category}
        </option>
      ))}
    </Select>
    <Select label="Sort" value={filters.sort} onChange={(event) => onChange('sort', event.target.value)}>
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value} className="bg-slate-900">
          {option.label}
        </option>
      ))}
    </Select>
    <div className="flex items-end">
      <Button variant="secondary" className="w-full" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  </div>
);