import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type {
  ProviderStatusAction,
  UpdateProviderStatusPayload,
  ProviderDecisionReason,
} from '@/types/providers';
import { rejectProviderSchema, suspendProviderSchema } from '@/types/providers';

interface ProviderStatusActionDialogProps {
  action: ProviderStatusAction;
  trigger: React.ReactNode;
  onSubmit: (payload: UpdateProviderStatusPayload) => void;
  disabled?: boolean;
}

interface FormValues {
  reason?: ProviderDecisionReason;
  notes?: string;
}

export function ProviderStatusActionDialog({
  action,
  trigger,
  onSubmit,
  disabled,
}: ProviderStatusActionDialogProps) {
  const [open, setOpen] = useState(false);
  const isApprove = action === 'approve';

  const schema =
    action === 'reject'
      ? rejectProviderSchema
      : action === 'suspend'
        ? suspendProviderSchema
        : null;

  const form = useForm<FormValues>({
    resolver: schema
      ? (zodResolver(schema) as unknown as import('react-hook-form').Resolver<FormValues>)
      : undefined,
    defaultValues: {
      reason: undefined,
      notes: '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (action === 'approve') {
      onSubmit({ action: 'approve' });
    } else if (action === 'reject' && values.reason) {
      onSubmit({ action: 'reject', reason: values.reason, notes: values.notes });
    } else if (action === 'suspend' && values.reason) {
      onSubmit({ action: 'suspend', reason: values.reason, notes: values.notes });
    }
    setOpen(false);
    form.reset();
  };

  const title =
    action === 'approve'
      ? 'Approve Provider'
      : action === 'reject'
        ? 'Reject Provider'
        : 'Suspend Provider';
  const description =
    action === 'approve'
      ? 'Are you sure you want to approve this provider? They will become immediately visible to drivers.'
      : action === 'reject'
        ? 'Provide a reason for rejecting this provider.'
        : 'Provide a reason for suspending this active provider. They will no longer be visible to drivers.';

  const actionClass =
    action === 'approve'
      ? 'bg-green-600 hover:bg-green-700'
      : action === 'reject'
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-slate-600 hover:bg-slate-700';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isApprove ? (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className={`${actionClass}`} onClick={() => handleSubmit({})}>
              Confirm
            </Button>
          </DialogFooter>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Reason <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="incompleteDocuments">Incomplete Documents</SelectItem>
                        <SelectItem value="invalidBusinessInfo">Invalid Business Info</SelectItem>
                        <SelectItem value="policyViolation">Policy Violation</SelectItem>
                        <SelectItem value="serviceQualityConcern">
                          Service Quality Concern
                        </SelectItem>
                        <SelectItem value="safetyConcern">Safety Concern</SelectItem>
                        <SelectItem value="duplicateProvider">Duplicate Provider</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any additional details here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className={`${actionClass}`}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
