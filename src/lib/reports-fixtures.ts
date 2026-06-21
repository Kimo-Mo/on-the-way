import type {
  Report,
  ReportDetails,
  ReportStatus,
  ObstacleType,
  ReportsListResponse,
  ReportSubmitter,
  CommunityVotes,
  GpsCoordinates,
} from '@/types/reports';

const statuses: ReportStatus[] = ['pending', 'urgent', 'approved', 'removed'];
const obstacleTypes: ObstacleType[] = [
  'pothole',
  'roadDebris',
  'trafficLight',
  'accident',
  'roadClosure',
  'fog',
];

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

const cairoLocations = [
  'Ring Road, near Exit 7, Cairo',
  'Corniche El Nile, Zamalek, Cairo',
  'Tahrir Square, Downtown, Cairo',
  'Mohandessin Main Street, Cairo',
  'Maadi Ring Road, Cairo',
  'Heliopolis Square, Cairo',
  'Nasr City 9th District, Cairo',
  '6th October Bridge, Cairo',
  'Dokki Street, Cairo',
  'New Cairo Axis, Cairo',
  'Sheikh Zayed Entrance, Giza',
  'Pyramids Road, Giza',
];

const descriptions = [
  'There is a very large pothole causing damage to vehicles. It has been there for two weeks.',
  'Large debris on the road after the storm. Cars are swerving to avoid it.',
  'Traffic light at the intersection has been stuck on red for over an hour.',
  'Minor accident blocking the right lane. No injuries reported.',
  'Road closed due to construction work. Detour signs are missing.',
  'Thick fog reducing visibility to less than 50 meters.',
  'Multiple potholes on the service road. Very dangerous for motorcycles.',
  'Fallen tree branches scattered across both lanes.',
  'Traffic light completely out at the main intersection.',
  'Major accident with three vehicles involved. Police on scene.',
  'Bridge closed for emergency maintenance. Use alternative route.',
  'Dense fog in the valley section. Drive with extreme caution.',
];

const imageUrls = [
  'https://cdn.example.com/reports/rpt_001/img_1.jpg',
  'https://cdn.example.com/reports/rpt_002/img_1.jpg',
  'https://cdn.example.com/reports/rpt_003/img_1.jpg',
  'https://cdn.example.com/reports/rpt_004/img_1.jpg',
  'https://cdn.example.com/reports/rpt_005/img_1.jpg',
  'https://cdn.example.com/reports/rpt_006/img_1.jpg',
];

const gpsCoordinates: GpsCoordinates[] = [
  { lat: 30.0444, lng: 31.2357 },
  { lat: 30.0626, lng: 31.2497 },
  { lat: 29.9772, lng: 31.1325 },
  { lat: 30.0581, lng: 31.2037 },
  { lat: 29.9559, lng: 31.2733 },
  { lat: 30.0818, lng: 31.3192 },
  { lat: 30.0131, lng: 31.4967 },
  { lat: 30.0441, lng: 31.2358 },
  { lat: 30.0514, lng: 31.2298 },
  { lat: 30.0234, lng: 31.2145 },
  { lat: 30.0089, lng: 31.2098 },
  { lat: 29.9792, lng: 31.1342 },
];

function generateSubmitter(index: number): ReportSubmitter {
  const isDeleted = index === 11; // Last one is deleted
  return {
    id: `usr_${String(index + 1).padStart(3, '0')}`,
    name: egyptianNames[index],
    isDeleted,
  };
}

function generateVotes(index: number): CommunityVotes {
  return {
    upvotes: 5 + ((index * 7) % 50),
    downvotes: (index * 3) % 10,
  };
}

function generateReport(index: number): Report {
  const status = statuses[index % statuses.length];
  const obstacleType = obstacleTypes[index % obstacleTypes.length];
  const now = new Date();
  const submittedAt = new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: `rpt_${String(index + 1).padStart(3, '0')}`,
    title: `${obstacleTypeLabels[obstacleType]} on ${cairoLocations[index].split(',')[0]}`,
    obstacleType,
    status,
    location: cairoLocations[index],
    submittedAt,
    votes: generateVotes(index),
    submitter: generateSubmitter(index),
  };
}

const obstacleTypeLabels: Record<ObstacleType, string> = {
  pothole: 'Pothole',
  roadDebris: 'Road Debris',
  trafficLight: 'Traffic Light',
  accident: 'Accident',
  roadClosure: 'Road Closure',
  fog: 'Fog',
};

export const reportsListFixture: ReportsListResponse = {
  data: Array.from({ length: 12 }, (_, i) => generateReport(i)),
  total: 12,
  page: 1,
  pageSize: 10,
  totalPages: 2,
};

const allReports = reportsListFixture.data;

export const reportDetailsFixtures: Record<string, ReportDetails> = {};

allReports.forEach((report, index) => {
  const hasImages = index !== 5; // Report 6 (index 5) has no images
  const hasCoordinates = index !== 6; // Report 7 (index 6) has no coordinates
  const removalReason = report.status === 'removed' ? 'spam' : undefined;

  reportDetailsFixtures[report.id] = {
    ...report,
    description: descriptions[index],
    imageUrls: hasImages ? [imageUrls[index % imageUrls.length]] : [],
    gpsCoordinates: hasCoordinates ? gpsCoordinates[index] : null,
    removalReason,
  };
});
