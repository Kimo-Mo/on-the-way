import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageEmptyProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

/**
 * Empty-state placeholder for lists and detail pages with no data.
 *
 * @param title - Headline message shown to the admin (e.g. "No reports found").
 * @param description - Optional supporting guidance text.
 * @param icon - Optional Lucide icon rendered above the title (defaults to Inbox).
 * @param className - Additional class names merged onto the root container.
 * @returns A centered empty-state card with icon, title, and description.
 */
export const PageEmpty = ({
  title,
  description,
  icon: Icon = Inbox,
  className,
}: PageEmptyProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center',
        className
      )}>
      <Icon className="size-10 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  );
};
