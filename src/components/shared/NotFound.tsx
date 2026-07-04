import { useNavigate } from 'react-router';
import { Button } from '../ui';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen overflow-hidden bg-chart-1 flex items-center justify-center relative p-5">
      <img src="/Shape.png" alt="shape" className="absolute inset-0 w-full h-full" />
      <div className="bg-card rounded-2xl relative overflow-hidden p-6 md:p-10 lg:p-12 flex flex-col items-center gap-y-4 justify-center">
        <img src="/404.png" alt="not-found" />
        <p className="text-xl font-black text-center max-w-md">
          The page you are looking for does not exist.
        </p>
        <Button onClick={() => navigate('/')} className="w-full" size="lg">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
