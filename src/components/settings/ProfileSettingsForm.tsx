import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from 'lucide-react';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Skeleton,
} from '@/components/ui';
import { useAuthStore } from '@/store/auth-store';
import { useGetAdminProfile, useSaveAdminProfile } from '@/hooks/settings/useSettings';
import type { UpdateProfileRequest } from '@/types/settings';

/**
 * Profile form Zod schema.
 * Field names match UpdateProfileRequest exactly (fullName, email, phoneNumber).
 */
const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: z.email('Invalid email address'),
  phoneNumber: z.string().min(7, 'Phone number too short').max(20).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileSettingsFormProps {
  onDirtyChange?: (dirty: boolean) => void;
}

export function ProfileSettingsForm({ onDirtyChange }: ProfileSettingsFormProps) {
  // Auth store provides the authoritative name, email, and role
  const authUser = useAuthStore((state) => state.user);

  // API profile provides mutable fields (phoneNumber) and acts as the save target
  const { data: profile, isLoading } = useGetAdminProfile();
  const mutation = useSaveAdminProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        // Prefer auth store values for name & email; fall back to API profile
        // Backend returns `fullName` (ProfileSettingsResponse.fullName)
        fullName: authUser?.name ?? profile.fullName ?? '',
        email: authUser?.email ?? profile.email ?? '',
        phoneNumber: profile.phoneNumber ?? '',
      });
    }
  }, [profile, authUser, form]);

  useEffect(() => {
    onDirtyChange?.(form.formState.isDirty);
  }, [form.formState.isDirty, onDirtyChange]);

  const onSubmit = (data: ProfileFormValues) => {
    // Build UpdateProfileRequest — field names match the backend exactly
    const payload: UpdateProfileRequest = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber || null,
    };
    mutation.mutate(payload, {
      onSuccess: () => {
        form.reset(data);
      },
    });
  };

  // Derive display role: auth store role → capitalize, else fall back to API profile role
  const displayRole = authUser?.role
    ? authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1)
    : (profile?.role ?? 'Admin');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
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
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" aria-label="Role" disabled value={displayRole} />
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
