import type {
  HelpRequest,
  HelpRequestDetails,
  HelpRequestsListResponse,
  HelpRequestCategory,
  HelpRequestStatus,
  TimelineEvent,
} from '@/types/help-requests';

// ─── Static seed data ─────────────────────────────────────────────────────────

const categories: HelpRequestCategory[] = ['Medical', 'Towing', 'Fuel', 'Repair'];
const statuses: HelpRequestStatus[] = ['Active', 'Assigned', 'Completed'];

const egyptianNames = [
  'Ahmed Hassan', 'Fatima Mohamed', 'Omar Ali', 'Aisha Mahmoud',
  'Karim Ibrahim', 'Layla Saeed', 'Youssef Gamal', 'Nour Adel',
  'Hassan Farouk', 'Mariam Khaled', 'Tarek Samir', 'Salma Hany',
  'Mohamed Sherif', 'Dina Essam', 'Khaled Mostafa', 'Rania Adly',
  'Amr Fathy', 'Sara Gamal', 'Bassem Wael', 'Heba Zaki',
];

const cairoLocations = [
  'Ring Road, near Exit 7, Cairo',
  'Corniche El Nile, Zamalek, Cairo',
  'Tahrir Square, Downtown, Cairo',
  'Mohandessin Main Street, Cairo',
  'Maadi Ring Road, Cairo',
  'Heliopolis Square, Cairo',
  'Nasr City 9th District, Cairo',
  '6th October Bridge, Cairo',
  'Dokki Street, Giza',
  'New Cairo Axis, Cairo',
  'Sheikh Zayed Entrance, Giza',
  'Pyramids Road, Giza',
  'Obour City Entrance, Cairo',
  'Ain Shams Street, Cairo',
  'Rehab City Gate, Cairo',
  'Madinaty Roundabout, Cairo',
  'Katameya Highway, Cairo',
  'Salam City District, Cairo',
  'Boulaq Abul Ela, Cairo',
  'Shoubra El Kheima Road, Cairo',
];

const coordinates = [
  { lat: 30.0444, lng: 31.2357 }, { lat: 30.0626, lng: 31.2497 },
  { lat: 29.9772, lng: 31.1325 }, { lat: 30.0581, lng: 31.2037 },
  { lat: 29.9559, lng: 31.2733 }, { lat: 30.0818, lng: 31.3192 },
  { lat: 30.0131, lng: 31.4967 }, { lat: 30.0441, lng: 31.2358 },
  { lat: 30.0514, lng: 31.2298 }, { lat: 30.0234, lng: 31.2145 },
  { lat: 30.0089, lng: 31.2098 }, { lat: 29.9792, lng: 31.1342 },
  { lat: 30.1212, lng: 31.3456 }, { lat: 30.0930, lng: 31.2801 },
  { lat: 30.0672, lng: 31.4123 }, { lat: 30.0219, lng: 31.4987 },
  { lat: 29.9943, lng: 31.3210 }, { lat: 30.1001, lng: 31.2670 },
  { lat: 30.0788, lng: 31.2215 }, { lat: 30.1345, lng: 31.2890 },
];

const providerNames = [
  'Cairo Rescue Services', 'El Nile Medical Response', 'Fast Tow Egypt',
  'Delta Fuel Assistance', 'Omega Repair Team', 'Quick Fix Cairo',
  'National Road Help', 'SafeRoute Providers', 'Al Masry Emergency',
  'Capital Aid Services',
];

// ─── Generator functions ──────────────────────────────────────────────────────

function generateRequest(index: number): HelpRequest {
  const category = categories[index % categories.length];
  const status = statuses[index % statuses.length];
  const now = new Date();
  const createdAt = new Date(now.getTime() - (index + 1) * 4 * 60 * 60 * 1000).toISOString();
  const hasProvider = status !== 'Active' && index % 5 !== 0;

  return {
    id: `hr_${String(index + 1).padStart(3, '0')}`,
    category,
    status,
    locationText: cairoLocations[index % cairoLocations.length],
    coordinates: coordinates[index % coordinates.length],
    createdAt,
    user: {
      id: `usr_${String(index + 1).padStart(3, '0')}`,
      fullName: egyptianNames[index % egyptianNames.length],
      avatarUrl: null,
      phone: index % 3 !== 0 ? `+20 10${String(index).padStart(8, '0')}` : null,
      email: index % 4 !== 0 ? `user${index + 1}@example.com` : null,
    },
    provider: hasProvider
      ? {
          id: `pvd_${String((index % 10) + 1).padStart(3, '0')}`,
          name: providerNames[index % providerNames.length],
          type: category,
          rating: 3.5 + ((index * 3) % 15) / 10,
          etaMinutes: 5 + (index % 8) * 5,
        }
      : null,
  };
}

// ─── Fixture exports ──────────────────────────────────────────────────────────

// 20 mock help requests (supports page sizes of 10, 20, 50)
const allRequests: HelpRequest[] = Array.from({ length: 20 }, (_, i) => generateRequest(i));

export const helpRequestsListFixture: HelpRequestsListResponse = {
  data: allRequests.slice(0, 10),
  total: 20,
  page: 1,
  pageSize: 10,
  totalPages: 2,
};

// ─── Available providers fixture (for Reassign Provider modal) ───────────────
export const availableProvidersFixture = providerNames.map((name, i) => ({
  id: `pvd_${String(i + 1).padStart(3, '0')}`,
  name,
  type: categories[i % categories.length],
  rating: 3.5 + (i * 3 % 15) / 10,
  etaMinutes: 5 + (i % 8) * 5,
}));

// ─── Detail fixtures (keyed by request id) ───────────────────────────────────

function generateTimeline(request: HelpRequest): TimelineEvent[] {
  const created = new Date(request.createdAt);
  const events: TimelineEvent[] = [
    {
      id: `te_${request.id}_1`,
      eventLabel: 'Created',
      timestamp: request.createdAt,
      description: 'Help request submitted by user.',
    },
  ];
  if (request.status !== 'Active') {
    events.push({
      id: `te_${request.id}_2`,
      eventLabel: 'Provider Notified',
      timestamp: new Date(created.getTime() + 5 * 60 * 1000).toISOString(),
      description: null,
    });
  }
  if (request.status === 'Active' || request.status === 'Completed' || request.status === 'Assigned') {
    events.push({
      id: `te_${request.id}_3`,
      eventLabel: 'En Route',
      timestamp: new Date(created.getTime() + 10 * 60 * 1000).toISOString(),
      description: `Provider en route. ETA: ${request.provider?.etaMinutes ?? '?'} minutes.`,
    });
  }
  if (request.status === 'Completed') {
    events.push({
      id: `te_${request.id}_4`,
      eventLabel: 'Arrived',
      timestamp: new Date(created.getTime() + 20 * 60 * 1000).toISOString(),
      description: null,
    });
    events.push({
      id: `te_${request.id}_5`,
      eventLabel: 'Completed',
      timestamp: new Date(created.getTime() + 35 * 60 * 1000).toISOString(),
      description: 'Help request resolved successfully.',
    });
  }
  if (request.status === 'Assigned') {
    events.push({
      id: `te_${request.id}_6`,
      eventLabel: 'Assigned',
      timestamp: new Date(created.getTime() + 15 * 60 * 1000).toISOString(),
      description: 'Request was assigned to a provider.',
    });
  }
  return events;
}

export const helpRequestDetailsFixtures: Record<string, HelpRequestDetails> = {};
allRequests.forEach((request) => {
  helpRequestDetailsFixtures[request.id] = {
    request,
    timeline: generateTimeline(request),
  };
});

// In-memory mutable state (persists for browser session, resets on reload)
// eslint-disable-next-line prefer-const
let _requests: HelpRequest[] = [...allRequests];
// eslint-disable-next-line prefer-const
let _availableProviders = [...availableProvidersFixture];

// ─── Mock service functions ───────────────────────────────────────────────────

function delay(ms = 500): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchHelpRequests(
  params: import('@/types/help-requests').HelpRequestsQueryParams
): Promise<HelpRequestsListResponse> {
  await delay(600);
  let filtered = [..._requests];
  if (params.category) filtered = filtered.filter((r) => r.category === params.category);
  if (params.status) filtered = filtered.filter((r) => r.status === params.status);
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.user.fullName.toLowerCase().includes(q) ||
        r.locationText.toLowerCase().includes(q)
    );
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
}

export async function fetchHelpRequestDetails(id: string): Promise<HelpRequestDetails> {
  await delay(400);
  const request = _requests.find((r) => r.id === id);
  if (!request) throw new Error(`Help request ${id} not found`);
  return { request, timeline: generateTimeline(request) };
}

export async function updateHelpRequestStatus(
  id: string,
  newStatus: import('@/types/help-requests').HelpRequestStatus
): Promise<HelpRequest> {
  await delay(500);
  const index = _requests.findIndex((r) => r.id === id);
  if (index === -1) throw new Error(`Help request ${id} not found`);
  _requests[index] = { ..._requests[index], status: newStatus };
  return _requests[index];
}

export async function reassignProvider(
  id: string,
  providerId: string
): Promise<HelpRequest> {
  await delay(500);
  const index = _requests.findIndex((r) => r.id === id);
  if (index === -1) throw new Error(`Help request ${id} not found`);
  const provider = _availableProviders.find((p) => p.id === providerId);
  if (!provider) throw new Error(`Provider ${providerId} not found`);
  _requests[index] = {
    ..._requests[index],
    provider: { ...provider, type: _requests[index].category },
  };
  return _requests[index];
}

export function getAvailableProviders(
  category: HelpRequestCategory
): typeof availableProvidersFixture {
  return _availableProviders.filter((p) => p.type === category);
}
