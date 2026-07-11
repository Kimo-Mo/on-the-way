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
  type CreateAnnouncementRequest,
  type NotificationRole,
} from '@/types/notifications';
import { AudienceSelector } from './AudienceSelector';
import { RoleSelectorField } from './RoleSelectorField';

interface CreateNotificationFormProps {
  onClose: () => void;
}

function toISOString(dateStr: string): string {
  return new Date(dateStr).toISOString();
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
    trigger,
    formState: { errors },
  } = useForm<CreateNotificationFormValues>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: '',
      content: '',
      targetAudience: 'Broadcast',
      category: 'Maintenance',
      roles: [],
      publishDate: null,
      action: 'draft',
    },
  });

  const targetAudience = watch('targetAudience');
  const titleLength = watch('title')?.length ?? 0;
  const messageLength = watch('content')?.length ?? 0;

  const onSubmit = (values: CreateNotificationFormValues) => {
    let publishDate: string | null;
    let isPublished: boolean;

    if (values.action === 'publish') {
      publishDate = new Date().toISOString();
      isPublished = true;
    } else if (values.action === 'schedule') {
      publishDate = values.publishDate ? toISOString(values.publishDate) : null;
      isPublished = false;
    } else {
      publishDate = null;
      isPublished = false;
    }

    const payload: CreateAnnouncementRequest = {
      title: values.title,
      content: values.content,
      targetAudience: values.targetAudience === 'Broadcast' ? 'All Users' : values.targetAudience,
      category: values.category,
      publishDate,
      isPublished,
    };
    createNotification(payload, { onSuccess: onClose });
  };

  const handleActionSubmit = async (action: 'publish' | 'draft' | 'schedule') => {
    setValue('action', action, { shouldValidate: false });
    const valid = await trigger();
    if (valid) {
      handleSubmit(onSubmit)();
    }
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
          {...register('content')}
        />
        <div className="flex justify-between">
          {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
          <span className="text-xs text-muted-foreground ml-auto">{messageLength}/500</span>
        </div>
      </div>

      {/* Type */}
      <div className="space-y-1">
        <Label>Type</Label>
        <Select
          value={watch('category')}
          onValueChange={(val) =>
            setValue('category', val as CreateNotificationFormValues['category'], { shouldValidate: true })
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
        {errors.category && <p className="text-destructive text-xs">{errors.category.message}</p>}
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
            onChange={(e) => setValue('publishDate', e.target.value || null, { shouldValidate: true })}
          />
          {errors.publishDate && <p className="text-destructive text-xs">{errors.publishDate.message}</p>}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => handleActionSubmit('draft')}>
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
              handleActionSubmit('schedule');
            }
          }}>
          {showSchedule ? (isPending ? 'Scheduling...' : 'Confirm Schedule') : 'Schedule'}
        </Button>
        <Button
          type="button"
          disabled={isPending}
          onClick={() => handleActionSubmit('publish')}>
          {isPending ? 'Publishing...' : 'Publish Now'}
        </Button>
        <Button type="button" variant="secondary" disabled={isPending} onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
