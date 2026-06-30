import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Skeleton,
  Switch,
  Badge,
} from '@/components/ui';
import { useGetSystemSettings, useSaveSystemSettings } from '@/hooks/settings/useSettings';
import type { SystemSettings } from '@/types/settings';

const systemSchema = z.object({
  autoApproveReports: z.boolean(),
  autoApproveThreshold: z.number().int().min(0).max(100),
  providerApprovalMode: z.enum(['Manual', 'Automatic']),
  trustScoreThreshold: z.number().int().min(0).max(100),
  maxActiveHelpRequests: z.number().int().min(1).max(10000),
});

interface SystemSettingsFormProps {
  onDirtyChange?: (dirty: boolean) => void;
}

export function SystemSettingsForm({ onDirtyChange }: SystemSettingsFormProps) {
  const { data: settings, isLoading } = useGetSystemSettings();
  const mutation = useSaveSystemSettings();

  const form = useForm<SystemSettings>({
    resolver: zodResolver(systemSchema),
    defaultValues: {
      autoApproveReports: false,
      autoApproveThreshold: 80,
      providerApprovalMode: 'Manual',
      trustScoreThreshold: 60,
      maxActiveHelpRequests: 100,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  useEffect(() => {
    onDirtyChange?.(form.formState.isDirty);
  }, [form.formState.isDirty, onDirtyChange]);

  const onSubmit = (data: SystemSettings) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset(data);
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Settings
            <Badge variant="destructive">Admin Only</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          System Settings
          <Badge variant="destructive">Admin Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="autoApproveReports"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Auto-Approve Reports</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="providerApprovalMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider Approval</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="autoApproveThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auto-Approve Threshold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trustScoreThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trust Score Threshold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxActiveHelpRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Active Help Requests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10000}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save System Settings'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
