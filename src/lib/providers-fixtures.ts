import type { ProviderDetails } from '@/types/providers';

export const PROVIDERS_FIXTURES: ProviderDetails[] = [
  {
    id: 'prov_1',
    businessName: 'QuickTow Services',
    serviceType: 'towing',
    status: 'approved',
    verificationStatus: 'verified',
    rating: { averageRating: 4.8, reviewCount: 124 },
    operatingArea: 'San Francisco',
    address: '123 Main Street, San Francisco, CA 94102',
    primaryContactName: 'John Smith',
    phone: '+1 (555) 777-8888',
    email: 'contact@quicktow.com',
    description: 'Professional towing services available 24/7. We specialize in emergency roadside assistance, vehicle recovery, and long-distance towing.',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_1', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-01-15T10:00:00Z', isMandatory: true, isAvailable: true, previewUrl: 'https://example.com/doc1' },
      { id: 'doc_2', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-01-15T10:00:00Z', isMandatory: true, isAvailable: true, previewUrl: 'https://example.com/doc2' },
      { id: 'doc_3', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-01-15T10:00:00Z', isMandatory: true, isAvailable: true, previewUrl: 'https://example.com/doc3' },
    ],
    recentReviews: [
      { id: 'rev_1', reviewerName: 'John Doe', rating: 5, comment: 'Fast and professional service!', reviewedAt: '2026-04-20T14:30:00Z' },
      { id: 'rev_2', reviewerName: 'Jane Smith', rating: 5, comment: 'Arrived quickly and handled my car with care.', reviewedAt: '2026-04-18T09:15:00Z' },
      { id: 'rev_3', reviewerName: 'Bob Johnson', rating: 4, comment: 'Good service, reasonable prices.', reviewedAt: '2026-04-15T16:45:00Z' },
    ]
  },
  {
    id: 'prov_2',
    businessName: 'MediCare Emergency',
    serviceType: 'medical',
    status: 'approved',
    verificationStatus: 'verified',
    rating: { averageRating: 4.9, reviewCount: 98 },
    operatingArea: 'San Jose',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_4', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-02-10T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_5', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-02-10T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_6', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-02-10T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    recentReviews: [
      { id: 'rev_4', reviewerName: null, rating: 5, comment: 'Very helpful staff.', reviewedAt: '2026-05-10T11:00:00Z' }
    ]
  },
  {
    id: 'prov_3',
    businessName: 'FastFuel Delivery',
    serviceType: 'fuel',
    status: 'approved',
    verificationStatus: 'verified',
    rating: { averageRating: 4.6, reviewCount: 76 },
    operatingArea: 'Oakland',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_7', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-03-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_8', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-03-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_9', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-03-01T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    recentReviews: []
  },
  {
    id: 'prov_4',
    businessName: 'AutoFix Mobile Repair',
    serviceType: 'mechanic',
    status: 'approved',
    verificationStatus: 'verified',
    rating: { averageRating: 4.7, reviewCount: 145 },
    operatingArea: 'San Francisco',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_10', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-01-20T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_11', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-01-20T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_12', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-01-20T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    recentReviews: []
  },
  {
    id: 'prov_5',
    businessName: 'RoadHelp Towing',
    serviceType: 'towing',
    status: 'pending',
    verificationStatus: 'readyForReview',
    rating: { averageRating: 4.5, reviewCount: 89 },
    operatingArea: 'Berkeley',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_13', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-06-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_14', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-06-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_15', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-06-01T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    recentReviews: []
  },
  {
    id: 'prov_6',
    businessName: 'Emergency Medical Response',
    serviceType: 'medical',
    status: 'pending',
    verificationStatus: 'missingRequired',
    rating: { averageRating: null, reviewCount: 0 },
    operatingArea: 'Palo Alto',
    missingRequiredDocumentTypes: ['businessLicense'],
    documents: [
      { id: 'doc_16', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-06-15T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_17', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-06-15T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    recentReviews: []
  },
  {
    id: 'prov_7',
    businessName: 'City Towing Co',
    serviceType: 'towing',
    status: 'approved',
    verificationStatus: 'verified',
    rating: { averageRating: 4.3, reviewCount: 67 },
    operatingArea: 'San Mateo',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_18', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-01-10T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_19', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-01-10T10:00:00Z', isMandatory: true, isAvailable: false }, // unavailable preview
      { id: 'doc_20', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-01-10T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    recentReviews: []
  },
  {
    id: 'prov_8',
    businessName: 'Mobile Mechanics Plus',
    serviceType: 'mechanic',
    status: 'pending',
    verificationStatus: 'readyForReview',
    rating: { averageRating: null, reviewCount: 0 },
    operatingArea: 'Fremont',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_21', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-06-18T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_22', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-06-18T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_23', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-06-18T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    recentReviews: []
  },
  {
    id: 'prov_9',
    businessName: 'Scam Towing',
    serviceType: 'towing',
    status: 'rejected',
    verificationStatus: 'readyForReview',
    rating: { averageRating: null, reviewCount: 0 },
    operatingArea: 'Oakland',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_24', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-05-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_25', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-05-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_26', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-05-01T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    latestStatusDecision: {
      id: 'dec_1',
      action: 'reject',
      reason: 'invalidBusinessInfo',
      notes: 'Provided fake business license.',
      decidedAt: '2026-05-02T10:00:00Z',
      decidedByAdminId: 'admin_1'
    },
    recentReviews: []
  },
  {
    id: 'prov_10',
    businessName: 'Dangerous Medics',
    serviceType: 'medical',
    status: 'suspended',
    verificationStatus: 'verified',
    rating: { averageRating: 1.2, reviewCount: 5 },
    operatingArea: 'San Francisco',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_27', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-01-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_28', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-01-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_29', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-01-01T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    latestStatusDecision: {
      id: 'dec_2',
      action: 'suspend',
      reason: 'safetyConcern',
      notes: 'Multiple reports of unsafe practices.',
      decidedAt: '2026-06-20T10:00:00Z',
      decidedByAdminId: 'admin_1'
    },
    recentReviews: [
      { id: 'rev_5', reviewerName: 'Concerned Citizen', rating: 1, comment: 'Very unsafe driver!', reviewedAt: '2026-06-19T10:00:00Z' }
    ]
  },
  {
    id: 'prov_11',
    businessName: 'General Helpers',
    serviceType: 'other',
    status: 'pending',
    verificationStatus: 'missingRequired',
    rating: { averageRating: null, reviewCount: 0 },
    operatingArea: 'San Jose',
    missingRequiredDocumentTypes: ['serviceEligibilityProof', 'businessLicense'],
    documents: [
      { id: 'doc_30', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-06-21T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    recentReviews: []
  },
  {
    id: 'prov_12',
    businessName: 'Friendly Fuel',
    serviceType: 'fuel',
    status: 'approved',
    verificationStatus: 'verified',
    rating: { averageRating: 5.0, reviewCount: 1 },
    operatingArea: 'San Francisco',
    missingRequiredDocumentTypes: [],
    documents: [
      { id: 'doc_31', type: 'businessLicense', name: 'Business License', uploadedAt: '2026-02-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_32', type: 'providerIdentity', name: 'Provider Identity', uploadedAt: '2026-02-01T10:00:00Z', isMandatory: true, isAvailable: true },
      { id: 'doc_33', type: 'serviceEligibilityProof', name: 'Service Eligibility Proof', uploadedAt: '2026-02-01T10:00:00Z', isMandatory: true, isAvailable: true },
    ],
    recentReviews: [
      { id: 'rev_6', reviewerName: 'Happy Customer', rating: 5, comment: 'Great service.', reviewedAt: '2026-03-01T10:00:00Z' }
    ]
  }
];
