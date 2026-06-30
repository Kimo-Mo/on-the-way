import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { removeReportSchema, removalReasonLabels } from '@/types/reports';
import type { RemoveReportFormValues } from '@/types/reports';
import { useRemoveReport } from '@/hooks/reports/useReports';
import { AlertTriangle } from 'lucide-react';

interface RemoveReportDialogProps {
  reportId: string;
  onSuccess: () => void;
  className?: string;
}

export const RemoveReportDialog = ({ reportId, onSuccess, className }: RemoveReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const removeMutation = useRemoveReport();

  const form = useForm<RemoveReportFormValues>({
    resolver: zodResolver(removeReportSchema),
    defaultValues: {
      reason: 'spam',
    },
  });

  const handleSubmit = async (values: RemoveReportFormValues) => {
    try {
      await removeMutation.mutateAsync({ id: reportId, payload: values });
      form.reset();
      setOpen(false);
      onSuccess();
    } catch {
      // Error handled by mutation hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className={className}>Remove Report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-2" />
          <DialogTitle>Remove Report</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The report will be permanently removed from the system.
            Please select a reason for removal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Removal Reason</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(removalReasonLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={removeMutation.isPending || form.formState.isSubmitting}>
                {removeMutation.isPending ? 'Removing...' : 'Remove Report'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};