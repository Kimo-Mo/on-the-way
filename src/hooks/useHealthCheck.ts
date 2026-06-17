import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: async () => {
      const { data } = await api.get('/health');
      return data;
    },
    retry: false,
  });
};
