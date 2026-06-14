import { StatsCards } from '@/components/dashboard';
import { PageHeader } from '@/components/shared';

const Dashboard = () => {
  return (
    <section className="py-7">
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." />

      <StatsCards />
    </section>
  );
};

export default Dashboard;
