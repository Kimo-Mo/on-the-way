import { Navigate } from 'react-router';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { AlertTriangle, Shield } from 'lucide-react';

export const Login = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-chart-1 flex items-center justify-center relative p-5">
      <img src="/Shape.png" alt="shape" className="absolute inset-0 w-full h-full" />
      <div className="bg-card rounded-2xl relative overflow-hidden">
        <div className="flex flex-col items-center justify-center px-8 pt-6 lg:px-12 lg:pt-10 relative">
          <Shield className="size-16 text-primary bg-primary/10 rounded-full p-2 mb-3" />
          <h1 className="text-4xl font-black text-primary uppercase mb-2">on the way</h1>
          <LoginForm />
        </div>
        <p className="pt-4 pb-6 mt-4 px-5 md:px-0 text-muted-foreground text-sm border-t border-border text-center bg-background flex items-center justify-center sm:flex-row flex-col gap-2">
          <AlertTriangle size={20} /> This area is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
};
