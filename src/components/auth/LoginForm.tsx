import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Eye, EyeClosed, Loader2, Lock, Mail } from 'lucide-react';
import { AxiosError } from 'axios';

import { useLogin } from '@/hooks/auth/useAuth';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: login, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values);
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const message = err.response?.data?.error || 'Login failed. Please try again.';
      form.setError('root', { message });
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Admin Control Panel</h1>
        <p className="text-muted-foreground">Please enter your email and password to continue</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address:</FormLabel>
                <div className="relative">
                  <Mail className="size-4 absolute left-4 top-1/2 -translate-1/2 text-muted-foreground" />
                  <FormControl>
                    <Input placeholder="Enter Your Email" className="pl-7" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password:</FormLabel>
                <div className="relative">
                  <Lock className="size-4 absolute left-4 top-1/2 -translate-1/2 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter Your Password"
                      className="pl-7"
                      {...field}
                    />
                  </FormControl>
                  {showPassword ? (
                    <Eye
                      className="size-6 rounded-full absolute right-0 top-1/2 -translate-1/2 hover:bg-accent translation-colors duration-200 p-1 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <EyeClosed
                      className="size-6 rounded-full absolute right-0 top-1/2 -translate-1/2 hover:bg-accent translation-colors duration-200 p-1 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <div className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Secure Login <ArrowRight />
          </Button>
        </form>
      </Form>
    </div>
  );
};
