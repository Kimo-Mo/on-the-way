import { z } from 'zod';
import type { PaginatedResponse } from './users';

export type ProviderServiceType = 'towing' | 'medical' | 'fuel' | 'mechanic' | 'other';
export type ProviderStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type VerificationStatus = 'missingRequired' | 'readyForReview' | 'verified';
export type VerificationDocumentType =
  | 'businessLicense'
  | 'providerIdentity'
  | 'serviceEligibilityProof'
  | 'other';

export const MANDATORY_DOCUMENT_TYPES: VerificationDocumentType[] = [
  'businessLicense',
  'providerIdentity',
  'serviceEligibilityProof',
];

export interface VerificationDocument {
  id: string;
  type: VerificationDocumentType;
  name: string;
  uploadedAt: string; // ISO 8601 date-time
  isMandatory: boolean;
  isAvailable: boolean;
  previewUrl?: string;
}

export interface ProviderRatingSummary {
  averageRating: number | null;
  reviewCount: number;
}

export interface CustomerReview {
  id: string;
  reviewerName: string | null;
  rating: number; // 1-5
  comment: string;
  reviewedAt: string; // ISO 8601 date-time
}

export interface Provider {
  id: string;
  businessName: string;
  serviceType: ProviderServiceType;
  status: ProviderStatus;
  verificationStatus: VerificationStatus;
  rating: ProviderRatingSummary;
  operatingArea: string;
  primaryContactName?: string;
  phone?: string;
  email?: string;
}

export interface ProviderDetails extends Provider {
  address?: string;
  description?: string;
  documents: VerificationDocument[];
  missingRequiredDocumentTypes: VerificationDocumentType[];
  recentReviews: CustomerReview[];
  latestStatusDecision?: StatusDecision;
}

export type ProviderStatusAction = 'approve' | 'reject' | 'suspend';

export type ProviderDecisionReason =
  | 'incompleteDocuments'
  | 'invalidBusinessInfo'
  | 'policyViolation'
  | 'serviceQualityConcern'
  | 'safetyConcern'
  | 'duplicateProvider';

export interface StatusDecision {
  id: string;
  action: ProviderStatusAction;
  reason?: ProviderDecisionReason;
  notes?: string;
  decidedAt: string; // ISO 8601 date-time
  decidedByAdminId: string;
}

export interface ProvidersQueryParams {
  page: number; // 1-indexed
  pageSize: number; // default: 10
  search?: string; // business name, contact, location text
  type?: ProviderServiceType;
  status?: ProviderStatus;
}

export type ProvidersListResponse = PaginatedResponse<Provider>;

export interface ApproveProviderPayload {
  action: 'approve';
}

export interface RejectProviderPayload {
  action: 'reject';
  reason: ProviderDecisionReason;
  notes?: string;
}

export interface SuspendProviderPayload {
  action: 'suspend';
  reason: ProviderDecisionReason;
  notes?: string;
}

export type UpdateProviderStatusPayload =
  | ApproveProviderPayload
  | RejectProviderPayload
  | SuspendProviderPayload;

export const providerDecisionReasonSchema = z.enum([
  'incompleteDocuments',
  'invalidBusinessInfo',
  'policyViolation',
  'serviceQualityConcern',
  'safetyConcern',
  'duplicateProvider',
]);

export const rejectProviderSchema = z.object({
  reason: providerDecisionReasonSchema,
  notes: z.string().trim().max(500).optional(),
});

export const suspendProviderSchema = z.object({
  reason: providerDecisionReasonSchema,
  notes: z.string().trim().max(500).optional(),
});

export type RejectProviderFormValues = z.infer<typeof rejectProviderSchema>;
export type SuspendProviderFormValues = z.infer<typeof suspendProviderSchema>;

export function getMissingRequiredDocumentLabels(types: VerificationDocumentType[]): string[] {
  const labels: Record<string, string> = {
    businessLicense: 'Business License',
    providerIdentity: 'Provider Identity',
    serviceEligibilityProof: 'Service Eligibility Proof',
  };
  return types.map((t) => labels[t] || t);
}

export function canApproveProvider(provider: ProviderDetails | undefined): boolean {
  if (!provider) return false;
  return provider.status === 'pending' && provider.missingRequiredDocumentTypes.length === 0;
}

export function getProviderStatusActionAvailability(provider: ProviderDetails | undefined) {
  if (!provider) return { canApprove: false, canReject: false, canSuspend: false };
  return {
    canApprove: provider.status === 'pending' && provider.missingRequiredDocumentTypes.length === 0,
    canReject: provider.status === 'pending',
    canSuspend: provider.status === 'approved',
  };
}
