import { useState, useEffect } from "react";
import { 
  CloudSun, 
  TrendingUp, 
  Activity, 
  Bell, 
  Calendar, 
  AlertTriangle, 
  ArrowUpRight, 
  Sprout, 
  ChevronRight, 
  Droplets, 
  DollarSign, 
  HelpCircle 
} from "lucide-react";
import { FarmerProfile, WeatherInfo, MarketPrice } from "../types";

interface DashboardProps {
  profile: FarmerProfile;
  setActiveTab: (tab: string) => void;
  language: 'English' | 'Tamil';
}

export default function Dashboard({ profile, setActiveTab, language }: DashboardProps) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [weatherRes, pricesRes] = await Promise.all([
          fetch(`/api/weather?district=${encodeURIComponent(profile.district)}`),
          fetch(`/api/market-prices?district=${encodeURIComponent(profile.district)}`)
        ]);
        if (weatherRes.ok) {
          const wData = await weatherRes.json();
          setWeather(wData);
        }
        if (pricesRes.ok) {
          const pData = await pricesRes.json();
          setPrices(pData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [profile.district]);

  const t = {
    English: {
      greeting: `Vannkam, ${profile.name}!`,
      subGreeting: `Here is the current status of your farm in ${profile.village}, ${profile.district}.`,
      weatherTitle: "Today's Weather",
      cropPrices: "Today's Crop Prices",
      alertsTitle: "AI & Regional Alerts",
      healthScore: "Crop Health Score",
      farmStats: "Farm Statistics",
      quickActions: "Quick Actions",
      recentActivity: "Recent Activities",
      notifications: "Notifications",
      calendar: "Crop Calendar",
      activeCrops: "Active Crops",
      farmSize: "Farm Size",
      irrigation: "Irrigation Type",
      recommendBtn: "Crop Recommend",
      diseaseBtn: "Disease Detector",
      soilBtn: "Soil Analysis",
      irrigateBtn: "Smart Irrigation",
      cropHealthGood: "Excellent",
      cropHealthSub: "Your crop growth is optimal. Maintain current irrigation.",
      humidity: "Humidity",
      rainProb: "Rain Prob.",
      wind: "Wind",
    },
    Tamil: {
      greeting: `வணக்கம், ${profile.name}!`,
      subGreeting: `${profile.village}, ${profile.district} வட்டாரத்தில் உள்ள உங்கள் பண்ணையின் தற்போதைய நிலை.`,
      weatherTitle: "இன்றைய வானிலை",
      cropPrices: "இன்றைய பயிர் விலைகள்",
      alertsTitle: "AI & வட்டார எச்சரிக்கைகள்",
      healthScore: "பயிர் ஆரோக்கிய குறியீடு",
      farmStats: "பண்ணை புள்ளிவிவரங்கள்",
      quickActions: "விரைவுச் செயல்பாடுகள்",
      recentActivity: "சமீபத்திய செயல்பாடுகள்",
      notifications: "அறிவிப்புகள்",
      calendar: "பயிர் நாட்காட்டி",
      activeCrops: "பயிர்கள்",
      farmSize: "நிலத்தின் அளவு",
      irrigation: "நீர்ப்பாசன முறை",
      recommendBtn: "பயிர் பரிந்துரை",
      diseaseBtn: "நோய் கண்டறிதல்",
      soilBtn: "மண் பரிசோதனை",
      irrigateBtn: "நீர்ப்பாசன மேலாண்மை",
      cropHealthGood: "மிக நன்று",
      cropHealthSub: "பயிரின் வளர்ச்சி சிறப்பாக உள்ளது. தற்போதைய நீர் பாசனத்தைத் தொடரவும்.",
      humidity: "ஈரப்பதம்",
      rainProb: "மழை வாய்ப்பு",
      wind: "காற்றின் வேகம்",
    }
  }[language];

  // AI disease and regional alerts
  const alerts = [
    {
      id: "1",
      type: "warning",
      text: language === "English" 
        ? `Yellow Stem Borer risk predicted in neighbouring crops. Monitor Paddy base closely.`
        : `அருகிலுள்ள வயல்களில் தண்டு துளைப்பான் பூச்சி தாக்குதல் கண்டறியப்பட்டுள்ளது. நெல் பயிரைக் கண்காணிக்கவும்.`,
      date: "Today"
    },
    {
      id: "2",
      type: "info",
      text: language === "English"
        ? `Turmeric prices in Erode Cooperative market rose by Rs.250/quintal this week.`
        : `ஈரோடு கூட்டுறவு சந்தையில் மஞ்சள் விலை குண்டால் ஒன்றுக்கு ரூ.250 உயர்ந்துள்ளது.`,
      date: "Yesterday"
    }
  ];

  const recentActivities = [
    { id: "act1", action: language === "English" ? "Created Soil Analysis Report" : "மண் பரிசோதனை அறிக்கை உருவாக்கப்பட்டது", time: "2 hrs ago" },
    { id: "act2", action: language === "English" ? "Calculated Smart Irrigation quantity" : "நீர் தேவை கணக்கிடப்பட்டது", time: "1 day ago" },
    { id: "act3", action: language === "English" ? "Enquired Uzhavan AI about Paddy yield" : "உழவன் AI-யிடம் நெல் விளைச்சல் பற்றி கேட்கப்பட்டது", time: "3 days ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">{t.greeting}</h1>
          <p className="text-emerald-50 mt-1 max-w-xl font-sans text-sm md:text-base">
            {t.subGreeting}
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/20 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-lime-300 animate-pulse" />
          <span>Uzhavan Platform Connected</span>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather card */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-emerald-500/10">
            <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <CloudSun className="text-emerald-600 dark:text-emerald-400" />
              {t.weatherTitle}
            </h2>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
              {profile.district}
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center text-emerald-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : weather ? (
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold font-display text-emerald-900 dark:text-emerald-100">{weather.temp}°C</div>
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">{weather.condition}</div>
                </div>
                <CloudSun className="w-14 h-14 text-amber-500 animate-pulse" />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-emerald-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-emerald-500/5">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">{t.humidity}</div>
                  <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">{weather.humidity}%</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">{t.rainProb}</div>
                  <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">{weather.rainProb}%</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">{t.wind}</div>
                  <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">{weather.windSpeed} km/h</div>
                </div>
              </div>

              <div className="text-xs bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-2.5 rounded-lg border border-red-200/50 dark:border-red-900/30 flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{weather.alerts[0]}</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">Weather service unavailable</div>
          )}

          <button 
            onClick={() => setActiveTab("weather")}
            className="w-full mt-2 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 rounded-xl transition flex items-center justify-center gap-1 border border-emerald-500/10"
          >
            {language === "English" ? "View 7-day Forecast" : "7 நாட்காட்டி வானிலை பார்க்க"}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Crop Health Score Card */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-emerald-500/10">
            <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <Activity className="text-emerald-600 dark:text-emerald-400" />
              {t.healthScore}
            </h2>
            <span className="text-xs text-lime-600 dark:text-lime-400 font-semibold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-ping" />
              {t.cropHealthGood}
            </span>
          </div>

          <div className="py-4 flex flex-col items-center justify-center">
            {/* Visual Circular Gauge */}
            <div className="relative flex items-center justify-center w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-200 dark:text-slate-800"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="351.8"
                  strokeDashoffset="52.7" // 85% full (85/100 * 351.8)
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-extrabold font-display text-emerald-900 dark:text-emerald-100">85</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">/ 100</span>
              </div>
            </div>

            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4 px-2">
              {t.cropHealthSub}
            </p>
          </div>

          <button 
            onClick={() => setActiveTab("disease")}
            className="w-full py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 rounded-xl transition flex items-center justify-center gap-1 border border-emerald-500/10"
          >
            {language === "English" ? "Diagnose Crop Health" : "பயிர் ஆரோக்கியத்தை ஆய்வு செய்ய"}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Market Prices Card */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-emerald-500/10">
            <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" />
              {t.cropPrices}
            </h2>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {language === "English" ? "Live" : "நேரலை"}
            </span>
          </div>

          <div className="py-3 flex-1 overflow-y-auto max-h-[160px] divide-y divide-emerald-500/10">
            {loading ? (
              <div className="py-8 flex justify-center items-center text-emerald-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              </div>
            ) : prices.length > 0 ? (
              prices.slice(0, 3).map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{item.crop}</span>
                    <span className="text-[10px] text-slate-500 block">{item.market}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">₹{item.modalPrice} <span className="text-[10px] text-slate-500">/q</span></span>
                    <span className={`text-[10px] font-semibold flex items-center justify-end ${item.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {item.change >= 0 ? "+" : ""}{item.change}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-400 text-sm">No localized crop pricing. Search All Markets.</div>
            )}
          </div>

          <button 
            onClick={() => setActiveTab("prices")}
            className="w-full mt-2 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 rounded-xl transition flex items-center justify-center gap-1 border border-emerald-500/10"
          >
            {language === "English" ? "View Market Rates" : "சந்தை விலைகளை பார்க்க"}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Row 2: Farm statistics & Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Farm Statistics */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
          <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
            <Sprout className="text-emerald-600 dark:text-emerald-400" />
            {t.farmStats}
          </h2>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-emerald-500/5">
              <span className="text-xs text-slate-500 font-medium">{t.activeCrops}</span>
              <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                {profile.mainCrops.join(", ")}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-emerald-500/5">
              <span className="text-xs text-slate-500 font-medium">{t.farmSize}</span>
              <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                {profile.farmSize} {language === "English" ? "Acres" : "ஏக்கர்"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-emerald-500/5">
              <span className="text-xs text-slate-500 font-medium">{t.irrigation}</span>
              <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{profile.irrigationType}</span>
            </div>
          </div>
        </div>

        {/* AI & Regional Alerts */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
          <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
            <Bell className="text-emerald-600 dark:text-emerald-400" />
            {t.alertsTitle}
          </h2>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-xl border ${
                  alert.type === "warning" 
                    ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-200" 
                    : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-900/30 text-blue-800 dark:text-blue-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-wider">{alert.type === "warning" ? "Pest Alert" : "Market Alert"}</span>
                  <span className="text-[10px] opacity-75">{alert.date}</span>
                </div>
                <p className="text-xs mt-1 leading-relaxed font-medium">{alert.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
          <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
            <ArrowUpRight className="text-emerald-600 dark:text-emerald-400" />
            {t.quickActions}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setActiveTab("recommendation")}
              className="p-3 text-left rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-900/50 transition group"
            >
              <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1" />
              <div className="text-xs font-bold text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-700">{t.recommendBtn}</div>
            </button>

            <button 
              onClick={() => setActiveTab("disease")}
              className="p-3 text-left rounded-xl bg-lime-50 dark:bg-lime-950/40 hover:bg-lime-100/70 dark:hover:bg-lime-900/40 border border-lime-200 dark:border-lime-900/50 transition group"
            >
              <AlertTriangle className="w-5 h-5 text-lime-600 dark:text-lime-400 mb-1" />
              <div className="text-xs font-bold text-lime-950 dark:text-lime-100 group-hover:text-lime-700">{t.diseaseBtn}</div>
            </button>

            <button 
              onClick={() => setActiveTab("soil")}
              className="p-3 text-left rounded-xl bg-yellow-50 dark:bg-amber-950/20 hover:bg-yellow-100/70 dark:hover:bg-amber-900/40 border border-yellow-200 dark:border-amber-900/30 transition group"
            >
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-1" />
              <div className="text-xs font-bold text-amber-950 dark:text-amber-100 group-hover:text-amber-700">{t.soilBtn}</div>
            </button>

            <button 
              onClick={() => setActiveTab("irrigation")}
              className="p-3 text-left rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900/50 transition group"
            >
              <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
              <div className="text-xs font-bold text-blue-950 dark:text-blue-100 group-hover:text-blue-700">{t.irrigateBtn}</div>
            </button>
          </div>
        </div>

      </div>

      {/* Row 3: Calendar milestone + Recent activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Crop Calendar Tracker */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
          <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
            <Calendar className="text-emerald-600 dark:text-emerald-400" />
            {t.calendar}
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/5 rounded-xl">
              <div className="bg-emerald-500 text-white w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm">
                15
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {language === "English" ? "Top Dressing Fertilizer application" : "இரண்டாம் கட்ட உரமிடுதல்"}
                </span>
                <span className="text-[10px] text-slate-500">
                  Paddy (Ponni) - Day 45 (Tillering Stage)
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded">
                {language === "English" ? "Due in 3 days" : "3 நாட்களில்"}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <div className="bg-slate-400 text-white w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm">
                22
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {language === "English" ? "Field drainage check & pest monitor" : "நீர் வடிகால் மற்றும் பூச்சி கண்காணிப்பு"}
                </span>
                <span className="text-[10px] text-slate-500">
                  Turmeric - Month 4 (Vegetative Phase)
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {language === "English" ? "Upcoming" : "அடுத்து வரும்"}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Platform Activities */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
          <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2 border-b border-emerald-500/10 pb-3">
            <Activity className="text-emerald-600 dark:text-emerald-400" />
            {t.recentActivity}
          </h2>

          <div className="space-y-3.5">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex justify-between items-center text-xs pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                <span className="text-slate-700 dark:text-slate-300 font-medium">{act.action}</span>
                <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
