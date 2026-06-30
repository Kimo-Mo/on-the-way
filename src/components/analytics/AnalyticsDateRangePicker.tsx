import { useState } from 'react';
import { format, subDays, differenceInDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AnalyticsDateRangePickerProps {
  value: { from: string; to: string };
  onChange: (range: { from: string; to: string }) => void;
}

export function AnalyticsDateRangePicker({ value, onChange }: AnalyticsDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromDate = new Date(value.from);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    setError(null);

    const newFrom = date;
    const newTo = date;

    if (differenceInDays(newTo, newFrom) > 90) {
      setError('Maximum range is 90 days');
      return;
    }

    onChange({
      from: format(newFrom, 'yyyy-MM-dd'),
      to: format(newTo, 'yyyy-MM-dd'),
    });
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-65 justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value.from && value.to
              ? `${format(new Date(value.from), 'MMM dd, yyyy')} – ${format(new Date(value.to), 'MMM dd, yyyy')}`
              : 'Select date range'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={fromDate}
            onSelect={handleSelect}
            disabled={(date) => date > subDays(new Date(), 0) || date < subDays(new Date(), 90)}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
