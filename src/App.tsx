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
  ShieldCheck
} from "lucide-react";

import { FarmerProfile as ProfileType, UserRole } from "./types";

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

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState<'English' | 'Tamil'>("English");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Default farmer profile (initialized locally, updates saved in profile settings tab)
  const [profile, setProfile] = useState<ProfileType>(() => {
    const saved = localStorage.getItem("farmer_profile");
    if (saved) return JSON.parse(saved);
    return {
      id: "farmer1",
      name: "Ranganathan Swamy",
      mobile: "9843211560",
      district: "Thanjavur",
      village: "Alampatti",
      farmSize: 1.5,
      soilType: "Clayey Soil",
      irrigationType: "Drip Irrigation",
      mainCrops: ["Paddy", "Turmeric"],
      role: "farmer"
    };
  });

  // Keep state sync
  useEffect(() => {
    localStorage.setItem("farmer_profile", JSON.stringify(profile));
  }, [profile]);

  const navItems = [
    { id: "dashboard", labelEn: "Overview Dashboard", labelTa: "கண்காணிப்பு பலகை", icon: LayoutDashboard },
    { id: "recommendation", labelEn: "AI Crop Planner", labelTa: "பயிர் திட்டமிடல்", icon: Sprout },
    { id: "disease", labelEn: "Pathology Doctor", labelTa: "பயிர் நோய் அறிதல்", icon: Camera },
    { id: "weather", labelEn: "Farming Weather", labelTa: "விவசாய வானிலை", icon: CloudSun },
    { id: "prices", labelEn: "eNAM Market Prices", labelTa: "சந்தை விலை நிலவரம்", icon: TrendingUp },
    { id: "soil", labelEn: "Soil Health Card", labelTa: "மண் பரிசோதனை", icon: HelpCircle },
    { id: "irrigation", labelEn: "Water Scheduler", labelTa: "நீர் பாசன மேலாண்மை", icon: Droplets },
    { id: "schemes", labelEn: "Subsidy & Schemes", labelTa: "அரசு சலுகைகள்", icon: Bookmark },
    { id: "assistant", labelEn: "Uzhavan AI Chat", labelTa: "உழவன் AI அரட்டை", icon: MessageSquare, badge: "Voice" },
    { id: "community", labelEn: "Farmers Forum", labelTa: "விவசாயிகள் மன்றம்", icon: MessageSquare },
    { id: "news", labelEn: "TNAU News Desk", labelTa: "வேளாண் செய்திகள்", icon: Newspaper },
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
              <span className="font-display font-extrabold text-base text-emerald-950 dark:text-white leading-none block">HarvestPulse</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase block">AI Smart Agriculture</span>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          
          {/* Offline local sync badge */}
          <div className="hidden md:flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full font-bold text-slate-500">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>PWA Offline Cache Active</span>
          </div>

          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === "English" ? "Tamil" : "English")}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/10 hover:border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === "English" ? "தமிழ்" : "English"}</span>
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
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-extrabold block truncate leading-none">{profile.name}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-bold truncate">{profile.district}, TN</span>
            </div>
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
              <Dashboard profile={profile} setActiveTab={setActiveTab} language={language} />
            )}
            
            {activeTab === "recommendation" && (
              <CropRecommendation language={language} userDistrict={profile.district} userSoil={profile.soilType} />
            )}

            {activeTab === "disease" && (
              <DiseaseDetection language={language} />
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
              <AIAssistant language={language} userDistrict={profile.district} />
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
