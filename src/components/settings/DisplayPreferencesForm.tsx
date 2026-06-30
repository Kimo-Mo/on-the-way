import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe } from 'lucide-react';
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
  Skeleton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useGetDisplayPreferences, useSaveDisplayPreferences } from '@/hooks/settings/useSettings';
import type { DisplayPreferences } from '@/types/settings';

const displaySchema = z.object({
  language: z.string().min(1, 'Language is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

interface DisplayPreferencesFormProps {
  onDirtyChange?: (dirty: boolean) => void;
}

export function DisplayPreferencesForm({ onDirtyChange }: DisplayPreferencesFormProps) {
  const { data: prefs, isLoading } = useGetDisplayPreferences();
  const mutation = useSaveDisplayPreferences();

  const form = useForm<DisplayPreferences>({
    resolver: zodResolver(displaySchema),
    defaultValues: {
      language: 'en',
      timezone: 'Africa/Cairo',
    },
  });

  useEffect(() => {
    if (prefs) {
      form.reset(prefs);
    }
  }, [prefs, form]);

  useEffect(() => {
    onDirtyChange?.(form.formState.isDirty);
  }, [form.formState.isDirty, onDirtyChange]);

  const onSubmit = (data: DisplayPreferences) => {
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
            <Globe className="h-5 w-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Globe className="h-5 w-5" />
          Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Africa/Cairo">Cairo (UTC+3)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Preferences'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
