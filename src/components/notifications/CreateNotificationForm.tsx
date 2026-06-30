import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateNotification } from '@/hooks/notifications/useNotifications';
import {
  createNotificationSchema,
  type CreateNotificationFormValues,
  type CreateNotificationPayload,
  type NotificationRole,
  type NotificationType,
  type NotificationPriority,
} from '@/types/notifications';
import { AudienceSelector } from './AudienceSelector';
import { RoleSelectorField } from './RoleSelectorField';

interface CreateNotificationFormProps {
  onClose: () => void;
}

export function CreateNotificationForm({ onClose }: CreateNotificationFormProps) {
  const { mutate: createNotification, isPending } = useCreateNotification();
  const [roles, setRoles] = useState<NotificationRole[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateNotificationFormValues>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: '',
      message: '',
      targetAudience: 'Broadcast',
      type: 'Maintenance',
      priority: 'Low',
      roles: [],
      scheduledAt: null,
      action: 'draft',
    },
  });

  const targetAudience = watch('targetAudience');
  const titleLength = watch('title')?.length ?? 0;
  const messageLength = watch('message')?.length ?? 0;

  const onSubmit = (values: CreateNotificationFormValues) => {
    const payload: CreateNotificationPayload = {
      title: values.title,
      message: values.message,
      targetAudience: values.targetAudience,
      type: values.type,
      priority: values.priority,
      roles: targetAudience === 'SpecificRoles' ? roles : [],
      deliveryChannels: ['Push', 'InApp'],
      scheduledAt: values.scheduledAt ?? null,
      action: values.action,
    };
    createNotification(payload, { onSuccess: onClose });
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="font-semibold text-base">New Notification</h2>

      {/* Title */}
      <div className="space-y-1">
        <Label htmlFor="notif-title">Title</Label>
        <Input id="notif-title" placeholder="Notification title" {...register('title')} />
        <div className="flex justify-between">
          {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
          <span className="text-xs text-muted-foreground ml-auto">{titleLength}/100</span>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1">
        <Label htmlFor="notif-message">Message</Label>
        <Textarea
          id="notif-message"
          placeholder="Notification message body"
          rows={3}
          {...register('message')}
        />
        <div className="flex justify-between">
          {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
          <span className="text-xs text-muted-foreground ml-auto">{messageLength}/500</span>
        </div>
      </div>

      {/* Type & Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Type</Label>
          <Select
            value={watch('type')}
            onValueChange={(val) =>
              setValue('type', val as NotificationType, { shouldValidate: true })
            }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Policy">Policy</SelectItem>
              <SelectItem value="Safety">Safety</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-destructive text-xs">{errors.type.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Priority</Label>
          <Select
            value={watch('priority')}
            onValueChange={(val) =>
              setValue('priority', val as NotificationPriority, { shouldValidate: true })
            }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && <p className="text-destructive text-xs">{errors.priority.message}</p>}
        </div>
      </div>

      {/* Audience */}
      <div className="space-y-1">
        <Label>Target Audience</Label>
        <AudienceSelector
          value={targetAudience}
          onChange={(a) => {
            setValue('targetAudience', a);
            setValue('roles', []);
          }}
        />
      </div>

      {/* Roles (conditional) */}
      {targetAudience === 'SpecificRoles' && (
        <div className="space-y-1">
          <Label>Roles</Label>
          <RoleSelectorField
            selectedRoles={roles}
            onChange={(r) => {
              setRoles(r);
              setValue('roles', r, { shouldValidate: true });
            }}
          />
          {errors.roles && <p className="text-destructive text-xs">{errors.roles.message}</p>}
        </div>
      )}

      {/* Schedule date (conditional) */}
      {showSchedule && (
        <div className="space-y-1">
          <Label htmlFor="notif-schedule">Schedule Date & Time</Label>
          <Input
            id="notif-schedule"
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => setValue('scheduledAt', e.target.value || null)}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => {
            setValue('action', 'draft');
            handleSubmit(onSubmit)();
          }}>
          {isPending ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => {
            if (!showSchedule) {
              setShowSchedule(true);
            } else {
              setValue('action', 'schedule');
              handleSubmit(onSubmit)();
            }
          }}>
          {showSchedule ? (isPending ? 'Scheduling...' : 'Confirm Schedule') : 'Schedule'}
        </Button>
        <Button
          type="button"
          disabled={isPending}
          onClick={() => {
            setValue('action', 'publish');
            handleSubmit(onSubmit)();
          }}>
          {isPending ? 'Publishing...' : 'Publish Now'}
        </Button>
        <Button type="button" variant="secondary" disabled={isPending} onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
