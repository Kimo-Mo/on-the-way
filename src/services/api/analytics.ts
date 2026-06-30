import api from '@/lib/axios';
import { analyticsFixtures } from '@/lib/analytics-fixtures';
import type { AnalyticsSnapshot, AnalyticsQueryParams } from '@/types/analytics';

export async function getAnalytics(params: AnalyticsQueryParams): Promise<AnalyticsSnapshot> {
  try {
    const { data } = await api.get<AnalyticsSnapshot>('/admin/analytics', { params });
    return data;
  } catch (error) {
    console.warn('[analytics] API unavailable, using fixture data:', error);
    await new Promise((r) => setTimeout(r, 600));
    return analyticsFixtures[params.dateRange] ?? analyticsFixtures['7d'];
  }
}
