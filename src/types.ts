export type UserRole = 'farmer' | 'officer' | 'admin';

export interface FarmerProfile {
  id?: string;
  name: string;
  phone?: string;
  mobile?: string;
  aadhaar?: string;
  email?: string;
  age?: number;
  gender?: string;
  district: string;
  village: string;
  state?: string;
  preferredLanguage?: 'English' | 'Tamil';
  farmSize: number; // in acres
  soilType: string;
  mainCrops: string[];
  irrigationType: string;
  role: UserRole;
}

export interface WeatherDay {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  conditionTa?: string;
  icon: string;
  rainProb: number;
  precipitationMm?: number;
  uvIndex?: number;
}

export interface WeatherInfo {
  temp: number;
  apparentTemp?: number;
  humidity: number;
  rainProb: number;
  precipitationMm?: number;
  windSpeed: number;
  windDirection?: string;
  uvIndex: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  condition: string;
  conditionTa?: string;
  forecast: WeatherDay[];
  alerts: string[];
  isVerified: boolean;
  dataSource: string;
  lastUpdated: string;
  lastUpdatedFormatted?: string;
  stationName?: string;
  latitude?: number;
  longitude?: number;
}

export interface MarketPrice {
  crop: string;
  district: string;
  market: string;
  minPrice: number; // per quintal (100 kg)
  maxPrice: number;
  modalPrice: number;
  change: number; // daily change percentage
  weeklyTrend: 'up' | 'down' | 'stable';
  monthlyTrend: 'up' | 'down' | 'stable';
  aiPrediction: {
    nextMonthPrice: number;
    confidence: number;
    reasoning: string;
  };
}

export interface CropRecommendation {
  cropName: string;
  expectedYield: string; // e.g., "15-18 quintals/acre"
  profitEstimation: string; // e.g., "Rs. 25,000 - 30,000/acre"
  growingDuration: string; // e.g., "110-120 days"
  suitableFertilizers: string[];
  irrigationSchedule: string;
  marketDemand: 'High' | 'Medium' | 'Low';
  riskLevel: 'High' | 'Medium' | 'Low';
  aiExplanation: string;
}

export interface DiseaseDetectionResult {
  diseaseName: string;
  confidenceScore: number; // percentage
  symptoms: string[];
  causes: string[];
  severity: 'Low' | 'Medium' | 'High';
  organicTreatment: string[];
  chemicalTreatment: string[];
  recommendedPesticides: { name: string; dosage: string }[];
  safetyMeasures: string[];
  recoveryTime: string;
  estimatedCost: string; // e.g. "Rs. 800 - 1,200 / acre"
  nearbyAgriOffice: string;
  crop?: string;
  scannedAt?: string;
  healthScore?: number;
  imageUrl?: string;
}

export interface DistrictWeatherSummary {
  district: string;
  districtTa: string;
  zone: string;
  zoneTa: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  apparentTemp?: number;
  condition: string;
  conditionTa: string;
  icon: string;
  humidity: number;
  rainProb: number;
  precipitationMm: number;
  windSpeed: number;
  windDirection?: string;
  uvIndex: number;
  alert: string;
  station: string;
  isVerified: boolean;
  lastUpdated: string;
}

export interface SoilReport {
  npk: { n: number; p: number; k: number };
  ph: number;
  micronutrients: string[];
  recommendations: string[];
  organicSuggestions: string[];
  aiSoilReport: string;
}

export interface Scheme {
  id: string;
  title: string;
  titleTa?: string;
  type: 'Central' | 'State' | string;
  description: string;
  descriptionTa?: string;
  eligibility: string[];
  eligibilityTa?: string[];
  requiredDocuments: string[];
  requiredDocumentsTa?: string[];
  applicationLink: string;
  deadline: string;
  isBookmarked?: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  district: string;
  role: UserRole;
  content: string;
  timestamp: string;
  likes: number;
  likedBy: string[]; // names of users
  comments: {
    id: string;
    author: string;
    role: UserRole;
    content: string;
    timestamp: string;
  }[];
}

export interface FarmingNews {
  id: string;
  title: string;
  source: string;
  category: 'News' | 'Research' | 'Scheme' | 'Market' | 'Alert';
  summary: string;
  date: string;
  link: string;
}

export interface ExpenseLog {
  id: string;
  type: 'income' | 'expense';
  category: string; // Seed, Fertilizer, Water, Pesticide, Labor, Sales, Subsidy
  amount: number;
  date: string;
  description: string;
}

export interface TaskReminder {
  id: string;
  crop: string;
  task: string;
  dueDate: string;
  completed: boolean;
}
