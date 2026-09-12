import { useState, useEffect } from "react";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Sprout, 
  Camera, 
  CloudSun, 
  TrendingUp, 
  HelpCircle, 
  Droplets, 
  Bookmark, 
  MessageSquare, 
  User, 
  Newspaper, 
  BarChart3, 
  Sparkles,
  Globe,
  CheckCircle,
  Smartphone,
  ShieldCheck,
  LogOut,
  Mic,
  Bot
} from "lucide-react";

import { FarmerProfile as ProfileType, UserRole, DiseaseDetectionResult } from "./types";

// Import modules
import Dashboard from "./components/Dashboard";
import CropRecommendation from "./components/CropRecommendation";
import DiseaseDetection from "./components/DiseaseDetection";
import WeatherForecast from "./components/WeatherForecast";
import MarketPrices from "./components/MarketPrices";
import SoilAnalysis from "./components/SoilAnalysis";
import SmartIrrigation from "./components/SmartIrrigation";
import GovernmentSchemes from "./components/GovernmentSchemes";
import AIAssistant from "./components/AIAssistant";
import Community from "./components/Community";
import FarmerProfile from "./components/FarmerProfile";
import FarmingNews from "./components/FarmingNews";
import Analytics from "./components/Analytics";
import FarmerAuth from "./components/FarmerAuth";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState<'English' | 'Tamil'>("English");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication State: Enforce Farmer Authentication at first
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Default farmer profile (initialized from auth session or storage)
  const [profile, setProfile] = useState<ProfileType>(() => {
    const saved = localStorage.getItem("farmer_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // pass
      }
    }
    return {
      id: "HP-FARM-04921",
      name: "Sugesh",
      district: "Thanjavur",
      village: "Papanasam",
      farmSize: 2.5,
      soilType: "Clayey Soil",
      irrigationType: "Drip Irrigation",
      mainCrops: ["Paddy (Rice)", "Turmeric"],
      role: "farmer"
    };
  });

  // Crop health state dynamically linked to disease detector
  const [latestDiseaseReport, setLatestDiseaseReport] = useState<DiseaseDetectionResult | null>(() => {
    try {
      const saved = localStorage.getItem("harvestpulse_latest_disease_report");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep state sync with storage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("farmer_profile", JSON.stringify(profile));
      localStorage.setItem("harvestpulse_auth_farmer", JSON.stringify(profile));
    }
  }, [profile, isAuthenticated]);

  const handleLoginSuccess = (authenticatedProfile: ProfileType) => {
    setProfile(authenticatedProfile);
    setIsAuthenticated(true);
    setActiveTab("dashboard");
  };

  const handleSignOut = () => {
    localStorage.removeItem("harvestpulse_auth_farmer");
    setIsAuthenticated(false);
  };

  // If not authenticated, render Farmer Authentication Screen first
  if (!isAuthenticated) {
    return (
      <FarmerAuth
        language={language}
        setLanguage={setLanguage}
        onLogin={handleLoginSuccess}
      />
    );
  }

  const navItems = [
    { id: "dashboard", labelEn: "Overview Dashboard", labelTa: "கண்காணிப்பு பலகை", icon: LayoutDashboard },
    { id: "recommendation", labelEn: "AI Crop Planner", labelTa: "பயிர் திட்டமிடல்", icon: Sprout },
    { id: "disease", labelEn: "Pathology Doctor", labelTa: "பயிர் நோய் அறிதல்", icon: Camera },
    { id: "weather", labelEn: "Farming Weather", labelTa: "விவசாய வானிலை", icon: CloudSun },
    { id: "prices", labelEn: "eNAM Market Prices", labelTa: "சந்தை விலை நிலவரம்", icon: TrendingUp },
    { id: "soil", labelEn: "Soil Health Card", labelTa: "மண் பரிசோதனை", icon: HelpCircle },
    { id: "irrigation", labelEn: "Water Scheduler", labelTa: "நீர் பாசன மேலாண்மை", icon: Droplets },
    { id: "schemes", labelEn: "Subsidy & Schemes", labelTa: "விவசாய சலுகைகள்", icon: Bookmark },
    { id: "assistant", labelEn: "Uzhavan AI Farmer", labelTa: "உழவன் AI விவசாயி", icon: Bot, badge: "AI Voice" },
    { id: "community", labelEn: "Farmers Forum", labelTa: "விவசாயிகள் மன்றம்", icon: MessageSquare },
    { id: "news", labelEn: "AgriTech News Feed", labelTa: "வேளாண் செய்திகள்", icon: Newspaper },
    { id: "analytics", labelEn: "Sales & Yield ROI", labelTa: "வருவாய் பகுப்பாய்வு", icon: BarChart3 },
    { id: "profile", labelEn: "Digital Farmer ID", labelTa: "விவசாயி டிஜிட்டல் அட்டை", icon: User }
  ];

  const currentNavLabel = navItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col transition duration-300">
      
      {/* Top Banner Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shrink-0 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden text-slate-700 dark:text-slate-300 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-xl text-white shadow-md shadow-emerald-600/10">
              <Sprout className="w-5 h-5 text-lime-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base text-emerald-950 dark:text-white leading-none">HarvestPulse</span>
                <span className="bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/30">V3</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase block mt-0.5">Smart Agriculture Platform</span>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Offline local sync badge */}
          <div className="hidden md:flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full font-bold text-slate-500">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>PWA Active</span>
          </div>

          {/* Active Farmer Pill */}
          <button
            onClick={() => setActiveTab("profile")}
            className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-xs hover:border-emerald-500/40 transition cursor-pointer"
            title="View Farmer Profile"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              {profile.name.slice(0, 1)}
            </div>
            <div className="text-left">
              <span className="font-bold text-emerald-950 dark:text-emerald-200 block text-[11px] leading-tight truncate max-w-[120px]">
                {profile.name}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block leading-none">
                {profile.district}
              </span>
            </div>
          </button>

          {/* Uzhavan AI Farmer Icon & Voice Agronomist at Top */}
          <button
            onClick={() => {
              setActiveTab("assistant");
              setIsMobileMenuOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
              activeTab === "assistant"
                ? "bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-emerald-700/20 ring-2 ring-emerald-400"
                : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20"
            }`}
            title={language === "English" ? "Uzhavan AI Farmer: AI Agronomist & Voice Assistant" : "உழவன் AI விவசாயி: வேளாண் ஆலோசகர் & குரல்"}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-lime-300 animate-ping" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xs tracking-tight">Uzhavan AI</span>
                <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-white/25 text-lime-100">Farmer</span>
              </div>
              <span className="text-[9px] text-emerald-100 opacity-90 hidden sm:inline mt-0.5">உழவன் AI விவசாயி</span>
            </div>
          </button>

          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === "English" ? "Tamil" : "English")}
            className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/10 hover:border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === "English" ? "தமிழ்" : "English"}</span>
          </button>

          {/* Switch Farmer / Re-Authenticate Button */}
          <button
            onClick={handleSignOut}
            className="px-2.5 py-1.5 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 text-xs font-semibold flex items-center gap-1.5"
            title={language === "English" ? "Switch Farmer / Re-Authenticate" : "விவசாயியை மாற்று / மீண்டும் உள்நுழை"}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{language === "English" ? "Switch Farmer" : "விவசாயி மாற்று"}</span>
          </button>
        </div>
      </header>

      {/* Main split viewport layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Drawer - Desktop & Mobile wrapper */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/70 p-4 flex flex-col justify-between transform transition-transform duration-300 shrink-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="space-y-4">
            <div className="px-2 py-1 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Agri SaaS Navigation</span>
            </div>

            {/* Sidebar link ledger */}
            <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer group ${
                      isActive 
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10" 
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition"}`} />
                      <span>{language === "English" ? item.labelEn : item.labelTa}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white text-emerald-700" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Connected User Badge Footer inside sidebar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="font-extrabold block truncate leading-none">{profile.name}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5 font-bold truncate">
                  {profile.id || profile.district}
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition cursor-pointer shrink-0"
              title={language === "English" ? "Sign Out" : "வெளியேறு"}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile drawers */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}

        {/* Center Viewport container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Direct module routing */}
            {activeTab === "dashboard" && (
              <Dashboard 
                profile={profile} 
                setActiveTab={setActiveTab} 
                language={language} 
                latestDiseaseReport={latestDiseaseReport}
              />
            )}
            
            {activeTab === "recommendation" && (
              <CropRecommendation language={language} userDistrict={profile.district} userSoil={profile.soilType} />
            )}

            {activeTab === "disease" && (
              <DiseaseDetection 
                language={language} 
                latestReport={latestDiseaseReport}
                onReportUpdate={setLatestDiseaseReport}
              />
            )}

            {activeTab === "weather" && (
              <WeatherForecast language={language} userDistrict={profile.district} />
            )}

            {activeTab === "prices" && (
              <MarketPrices language={language} userDistrict={profile.district} />
            )}

            {activeTab === "soil" && (
              <SoilAnalysis language={language} userSoil={profile.soilType} />
            )}

            {activeTab === "irrigation" && (
              <SmartIrrigation language={language} />
            )}

            {activeTab === "schemes" && (
              <GovernmentSchemes language={language} />
            )}

            {activeTab === "assistant" && (
              <AIAssistant 
                language={language} 
                userDistrict={profile.district}
                onNavigate={(tabId: string) => {
                  setActiveTab(tabId);
                  setIsMobileMenuOpen(false);
                }}
                activeTab={activeTab}
                farmerName={profile.name}
                farmerSoil={profile.soilType}
                farmerAcres={profile.farmSize}
              />
            )}

            {activeTab === "community" && (
              <Community 
                language={language} 
                userProfileName={profile.name} 
                userProfileDistrict={profile.district}
                userRole={profile.role}
              />
            )}

            {activeTab === "news" && (
              <FarmingNews language={language} />
            )}

            {activeTab === "analytics" && (
              <Analytics language={language} userDistrict={profile.district} />
            )}

            {activeTab === "profile" && (
              <FarmerProfile language={language} profile={profile} setProfile={setProfile} />
            )}

          </div>
        </main>

      </div>
    </div>
  );
}
