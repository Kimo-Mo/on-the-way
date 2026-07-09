import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  ProvidersListResponse,
  ProvidersQueryParams,
  ProviderDetails,
  Provider,
  UpdateProviderStatusPayload,
  ProviderStatus,
} from '@/types/providers';

// ─── Mock Data (Providers backend not yet implemented) ───────────────────────

const mockProviders: Provider[] = [
  {
    id: 'prov-001',
    businessName: 'Cairo Towing Services',
    serviceType: 'towing',
    status: 'pending',
    verificationStatus: 'readyForReview',
    rating: { averageRating: 4.2, reviewCount: 34 },
    operatingArea: 'Cairo, Nasr City',
    primaryContactName: 'Ahmed Hassan',
    phone: '+20-100-123-4567',
    email: 'ahmed@caitowing.com',
  },
  {
    id: 'prov-002',
    businessName: 'Nile Medical Response',
    serviceType: 'medical',
    status: 'approved',
    verificationStatus: 'verified',
    rating: { averageRating: 4.8, reviewCount: 112 },
    operatingArea: 'Giza, Dokki',
    primaryContactName: 'Sara El-Sayed',
    phone: '+20-111-234-5678',
    email: 'sara@nilemedical.com',
  },
  {
    id: 'prov-003',
    businessName: 'FastFuel Delivery',
    serviceType: 'fuel',
    status: 'approved',
    verificationStatus: 'verified',
    rating: { averageRating: 3.9, reviewCount: 56 },
    operatingArea: 'Alexandria, Smouha',
    primaryContactName: 'Omar Khaled',
    phone: '+20-122-345-6789',
    email: 'omar@fastfuel.com',
  },
  {
    id: 'prov-004',
    businessName: 'AutoFix Mechanic Shop',
    serviceType: 'mechanic',
    status: 'rejected',
    verificationStatus: 'missingRequired',
    rating: { averageRating: null, reviewCount: 0 },
    operatingArea: 'Heliopolis',
    primaryContactName: 'Youssef Ali',
    phone: '+20-100-987-6543',
    email: 'youssef@autofix.com',
  },
  {
    id: 'prov-005',
    businessName: 'RoadAssist Plus',
    serviceType: 'towing',
    status: 'suspended',
    verificationStatus: 'verified',
    rating: { averageRating: 2.1, reviewCount: 18 },
    operatingArea: '6th October City',
    primaryContactName: 'Mona Farouk',
    phone: '+20-155-432-1098',
    email: 'mona@roadassist.com',
  },
];

const mockProviderDetails: Record<string, ProviderDetails> = {
  'prov-001': {
    ...mockProviders[0],
    address: '15 El-Thawra St, Nasr City, Cairo',
    description: 'Professional towing and roadside assistance serving greater Cairo area since 2018.',
    documents: [
      { id: 'doc-1', type: 'businessLicense', name: 'business_license.pdf', uploadedAt: '2024-01-15T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc-2', type: 'providerIdentity', name: 'national_id.pdf', uploadedAt: '2024-01-15T10:05:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc-3', type: 'serviceEligibilityProof', name: 'eligibility.pdf', uploadedAt: '2024-01-15T10:10:00Z', isMandatory: true, isAvailable: false },
    ],
    missingRequiredDocumentTypes: ['serviceEligibilityProof'],
    recentReviews: [
      { id: 'rev-1', reviewerName: 'Mohamed S.', rating: 5, comment: 'Quick and professional towing service.', reviewedAt: '2024-06-01T14:30:00Z' },
      { id: 'rev-2', reviewerName: 'Fatma A.', rating: 4, comment: 'Good response time, fair pricing.', reviewedAt: '2024-05-20T09:15:00Z' },
    ],
    latestStatusDecision: undefined,
  },
};

const _mockProvidersState = [...mockProviders];

const delay = () => new Promise((r) => setTimeout(r, 300));

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const PROVIDERS_QUERY_KEY = (params: ProvidersQueryParams) =>
  ['providers', params] as const;
export const PROVIDER_DETAILS_QUERY_KEY = (id: string) => ['providers', 'details', id] as const;

// ─── Fetch Functions (Mock) ──────────────────────────────────────────────────

/** Fetches the paginated providers list. Currently returns mock data. */
export const fetchProviders = async (params: ProvidersQueryParams): Promise<ProvidersListResponse> => {
  await delay();
  let filtered = [..._mockProvidersState];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.businessName.toLowerCase().includes(q) ||
        p.primaryContactName?.toLowerCase().includes(q) ||
        p.operatingArea.toLowerCase().includes(q)
    );
  }
  if (params.type) {
    filtered = filtered.filter((p) => p.serviceType === params.type);
  }
  if (params.status) {
    filtered = filtered.filter((p) => p.status === params.status);
  }

  const total = filtered.length;
  const start = (params.page - 1) * params.pageSize;
  const data = filtered.slice(start, start + params.pageSize);

  return {
    data,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
  };
};

/** Fetches provider details by ID. Currently returns mock data. */
export const fetchProviderDetails = async (id: string): Promise<ProviderDetails> => {
  await delay();
  const details = mockProviderDetails[id];
  if (!details) {
    const basic = _mockProvidersState.find((p) => p.id === id);
    if (basic) {
      return {
        ...basic,
        address: undefined,
        description: undefined,
        documents: [],
        missingRequiredDocumentTypes: [],
        recentReviews: [],
        latestStatusDecision: undefined,
      };
    }
    throw new Error('Provider not found');
  }
  return details;
};

// ─── Query Hooks ─────────────────────────────────────────────────────────────

/** Hook for paginated providers list with filtering. */
export const useProviders = (params: ProvidersQueryParams) => {
  return useQuery({
    queryKey: PROVIDERS_QUERY_KEY(params),
    queryFn: () => fetchProviders(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};

/** Hook for a single provider's detail view. */
export const useProviderDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: id ? PROVIDER_DETAILS_QUERY_KEY(id) : [],
    queryFn: () => fetchProviderDetails(id!),
    enabled: !!id,
    retry: 1,
    staleTime: 60_000,
  });
};

// ─── Mutation Hooks (Mock) ───────────────────────────────────────────────────

/** Mock mutation to approve, reject, or suspend a provider. */
export const useUpdateProviderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProviderStatusPayload }) => {
      await delay();
      const idx = _mockProvidersState.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Provider not found');

      const newStatus: ProviderStatus =
        payload.action === 'approve' ? 'approved' : payload.action === 'reject' ? 'rejected' : 'suspended';
      _mockProvidersState[idx] = { ..._mockProvidersState[idx], status: newStatus };

      return _mockProvidersState[idx];
    },
    onSuccess: (_, { payload }) => {
      let actionLabel = '';
      if (payload.action === 'approve') actionLabel = 'approved';
      if (payload.action === 'reject') actionLabel = 'rejected';
      if (payload.action === 'suspend') actionLabel = 'suspended';

      toast.success(`Provider ${actionLabel} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update provider status.');
    },
  });
};
