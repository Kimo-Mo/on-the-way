import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Loader2, Mail, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useForgetPassword } from '@/hooks/auth/useAuth';
import { forgetPasswordSchema } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { mutateAsync: forgetPassword, isPending } = useForgetPassword();

  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof forgetPasswordSchema>) => {
    try {
      await forgetPassword(values);
      navigate('/reset-password', { state: { email: values.email } });
    } catch {
      form.setError('root', { message: 'Failed to request password reset. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-chart-1 flex items-center justify-center relative p-5">
      <img src="/Shape.png" alt="shape" className="absolute inset-0 w-full h-full" />
      <div className="bg-card rounded-2xl relative overflow-hidden w-full max-w-md">
        <div className="flex flex-col items-center justify-center px-8 pt-6 lg:px-12 lg:pt-10 relative">
          <Shield className="size-16 text-primary bg-primary/10 rounded-full p-2 mb-3" />
          <h1 className="text-3xl font-black text-primary uppercase mb-2">Forgot Password</h1>
          <p className="text-muted-foreground text-center mb-6">
            Enter your email address to receive a password reset OTP.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mb-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address:</FormLabel>
                    <div className="relative">
                      <Mail className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="Enter Your Email" className="pl-10" {...field} />
                      </FormControl>
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
                Send Reset Email <ArrowRight className="ml-2" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full mt-2" 
                onClick={() => navigate('/login')}
                disabled={isPending}
              >
                Back to Login
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
