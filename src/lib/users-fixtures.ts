import type { User, UserDetails, UserActivity, UsersListResponse, UserRole, UserStatus } from '@/types/users';

const roles: UserRole[] = ['admin', 'driver', 'serviceProvider'];
const statuses: UserStatus[] = ['active', 'suspended', 'pending'];

const egyptianNames = [
  'Ahmed Hassan',
  'Fatima Mohamed',
  'Omar Ali',
  'Aisha Mahmoud',
  'Karim Ibrahim',
  'Layla Saeed',
  'Youssef Gamal',
  'Nour Adel',
  'Hassan Farouk',
  'Mariam Khaled',
  'Tarek Samir',
  'Salma Hany',
];

const cairoAddresses = [
  'Nasr City, Cairo',
  'Maadi, Cairo',
  'Heliopolis, Cairo',
  'Zamalek, Cairo',
  'Downtown, Cairo',
  'Dokki, Cairo',
  'Mohandessin, Cairo',
  'New Cairo, Cairo',
  'Shubra, Cairo',
  'Giza, Cairo',
  'Helwan, Cairo',
  'October City, Giza',
];

const vehicles = [
  'Toyota Corolla 2020',
  'Hyundai Elantra 2019',
  'Kia Cerato 2021',
  'Nissan Sunny 2018',
  'Chevrolet Aveo 2022',
];

function generateUser(index: number): User {
  const role = roles[index % roles.length];
  const status = statuses[index % statuses.length];
  const trustScore = 40 + (index * 5) % 61; // 40-100
  const joinedYear = 2023 + (index % 3);
  const joinedMonth = (index % 12) + 1;
  const joinedDay = (index % 28) + 1;

  return {
    id: `usr_${String(index + 1).padStart(3, '0')}`,
    name: egyptianNames[index],
    email: `${egyptianNames[index].toLowerCase().replace(' ', '.')}@example.com`,
    role,
    status,
    trustScore,
    joinedAt: `${joinedYear}-${String(joinedMonth).padStart(2, '0')}-${String(joinedDay).padStart(2, '0')}T10:00:00Z`,
    avatarUrl: `https://cdn.example.com/avatars/usr_${String(index + 1).padStart(3, '0')}.jpg`,
  };
}

function generateActivityHistory(userId: string, role: UserRole): UserActivity[] {
  const activities: UserActivity[] = [];
  const baseDate = new Date('2025-01-01T00:00:00Z');

  const activityTemplates: Record<UserRole, Array<{ type: UserActivity['type']; description: string }>> = {
    admin: [
      { type: 'profileUpdated', description: 'Updated admin profile settings' },
      { type: 'reportVerified', description: 'Verified a pothole report on Ring Road' },
      { type: 'suspended', description: 'Suspended user for policy violation' },
      { type: 'reactivated', description: 'Reactivated user after review' },
    ],
    driver: [
      { type: 'reportSubmitted', description: 'Submitted a pothole report on Ring Road' },
      { type: 'helpRequestCreated', description: 'Created help request for vehicle breakdown' },
      { type: 'helpRequestResolved', description: 'Resolved help request - towing completed' },
      { type: 'profileUpdated', description: 'Updated vehicle information' },
    ],
    serviceProvider: [
      { type: 'reportVerified', description: 'Verified service request completion' },
      { type: 'helpRequestResolved', description: 'Resolved help request - roadside assistance' },
      { type: 'profileUpdated', description: 'Updated service provider profile' },
      { type: 'reactivated', description: 'Service reactivated after maintenance' },
    ],
  };

  const templates = activityTemplates[role];
  const numActivities = 3 + (userId.charCodeAt(0) % 3); // 3-5 activities

  for (let i = 0; i < numActivities; i++) {
    const template = templates[i % templates.length];
    const timestamp = new Date(baseDate.getTime() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString();

    activities.push({
      id: `act_${userId}_${i + 1}`,
      userId,
      type: template.type,
      description: template.description,
      timestamp,
      relatedEntityId: `ent_${i + 1}`,
      relatedEntityRoute: `/reports/ent_${i + 1}`,
    });
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const usersListFixture: UsersListResponse = {
  data: Array.from({ length: 12 }, (_, i) => generateUser(i)),
  total: 12,
  page: 1,
  pageSize: 10,
  totalPages: 2,
};

const allUsers = usersListFixture.data;

export const userDetailsFixtures: Record<string, UserDetails> = {};

allUsers.forEach((user, index) => {
  const phone = `+20 1${String(100 + index).padStart(3, '0')} ${String(index * 111).padStart(3, '0')} ${String(index * 222).padStart(4, '0')}`;
  const address = cairoAddresses[index];
  const vehicleInfo = user.role === 'driver' ? vehicles[index % vehicles.length] : undefined;

  userDetailsFixtures[user.id] = {
    ...user,
    phone,
    address,
    vehicleInfo,
    activityHistory: generateActivityHistory(user.id, user.role),
  };
});