import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Eye, EyeClosed, Loader2, Lock, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';

import { useResetPassword } from '@/hooks/auth/useAuth';
import { resetPasswordSchema } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const emailFromState = location.state?.email || '';

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromState,
      otp: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      await resetPassword(values);
      navigate('/login');
    } catch {
      form.setError('root', { message: 'Failed to reset password. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-chart-1 flex items-center justify-center relative p-5">
      <img src="/Shape.png" alt="shape" className="absolute inset-0 w-full h-full" />
      <div className="bg-card rounded-2xl relative overflow-hidden w-full max-w-md">
        <div className="flex flex-col items-center justify-center px-8 pt-6 lg:px-12 lg:pt-10 relative">
          <Shield className="size-16 text-primary bg-primary/10 rounded-full p-2 mb-3" />
          <h1 className="text-3xl font-black text-primary uppercase mb-2">Reset Password</h1>
          <p className="text-muted-foreground text-center mb-6">
            Enter the OTP sent to your email and your new password.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mb-8">
              <input type="hidden" {...form.register('email')} />
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP:</FormLabel>
                    <div className="relative">
                      <Lock className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="Enter OTP" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password:</FormLabel>
                    <div className="relative">
                      <Lock className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter New Password"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                      {showPassword ? (
                        <Eye
                          className="size-6 rounded-full absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent transition-colors duration-200 p-1 cursor-pointer text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <EyeClosed
                          className="size-6 rounded-full absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent transition-colors duration-200 p-1 cursor-pointer text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password:</FormLabel>
                    <div className="relative">
                      <Lock className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm New Password"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                      {showConfirmPassword ? (
                        <Eye
                          className="size-6 rounded-full absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent transition-colors duration-200 p-1 cursor-pointer text-muted-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      ) : (
                        <EyeClosed
                          className="size-6 rounded-full absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent transition-colors duration-200 p-1 cursor-pointer text-muted-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                Reset Password <ArrowRight className="ml-2" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
