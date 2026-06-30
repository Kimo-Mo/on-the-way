import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AnalyticsDateRange } from '@/types/analytics';

interface AnalyticsRangeSelectProps {
  value: AnalyticsDateRange;
  onChange: (range: AnalyticsDateRange) => void;
}

const DATE_RANGE_OPTIONS: { value: AnalyticsDateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'year', label: 'This Year' },
];

export function AnalyticsRangeSelect({ value, onChange }: AnalyticsRangeSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as AnalyticsDateRange)}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        {DATE_RANGE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
