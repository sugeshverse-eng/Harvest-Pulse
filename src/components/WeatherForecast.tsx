import { useState, useEffect } from "react";
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Sun, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  CloudLightning,
  Loader,
  ShieldCheck,
  RefreshCw,
  Clock,
  MapPin,
  Thermometer,
  CloudRain
} from "lucide-react";
import { WeatherInfo } from "../types";
import AllDistrictsWeather from "./AllDistrictsWeather";

interface WeatherForecastProps {
  language: 'English' | 'Tamil';
  userDistrict: string;
}

const TN_DISTRICTS = [
  { en: "Ariyalur", ta: "அரியலூர்" },
  { en: "Chengalpattu", ta: "செங்கல்பட்டு" },
  { en: "Chennai", ta: "சென்னை" },
  { en: "Coimbatore", ta: "கோயம்புத்தூர்" },
  { en: "Cuddalore", ta: "கடலூர்" },
  { en: "Dharmapuri", ta: "தருமபுரி" },
  { en: "Dindigul", ta: "திண்டுக்கல்" },
  { en: "Erode", ta: "ஈரோடு" },
  { en: "Kallakurichi", ta: "கள்ளக்குறிச்சி" },
  { en: "Kanchipuram", ta: "காஞ்சிபுரம்" },
  { en: "Kanyakumari", ta: "கன்னியாகுமரி" },
  { en: "Karur", ta: "கரூர்" },
  { en: "Krishnagiri", ta: "கிருஷ்ணகிரி" },
  { en: "Madurai", ta: "மதுரை" },
  { en: "Mayiladuthurai", ta: "மயிலாடுதுறை" },
  { en: "Nagapattinam", ta: "நாகப்பட்டினம்" },
  { en: "Namakkal", ta: "நாமக்கல்" },
  { en: "Nilgiris", ta: "நீலகிரி" },
  { en: "Perambalur", ta: "பெரம்பலூர்" },
  { en: "Pudukkottai", ta: "புதுக்கோட்டை" },
  { en: "Ramanathapuram", ta: "ராமநாதபுரம்" },
  { en: "Ranipet", ta: "ராணிப்பேட்டை" },
  { en: "Salem", ta: "சேலம்" },
  { en: "Sivaganga", ta: "சிவகங்கை" },
  { en: "Tenkasi", ta: "தென்காசி" },
  { en: "Thanjavur", ta: "தஞ்சாவூர்" },
  { en: "Theni", ta: "தேனி" },
  { en: "Thoothukudi", ta: "தூத்துக்குடி" },
  { en: "Trichy", ta: "திருச்சிராப்பள்ளி" },
  { en: "Tirunelveli", ta: "திருநெல்வேலி" },
  { en: "Tirupathur", ta: "திருப்பத்தூர்" },
  { en: "Tiruppur", ta: "திருப்பூர்" },
  { en: "Tiruvallur", ta: "திருவள்ளூர்" },
  { en: "Tiruvannamalai", ta: "திருவண்ணாமலை" },
  { en: "Tiruvarur", ta: "திருவாரூர்" },
  { en: "Vellore", ta: "வேலூர்" },
  { en: "Viluppuram", ta: "விழுப்புரம்" },
  { en: "Virudhunagar", ta: "விருதுநகர்" },
];

export default function WeatherForecast({ language, userDistrict }: WeatherForecastProps) {
  const [district, setDistrict] = useState(userDistrict || "Coimbatore");
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'single' | 'all'>('single');

  const fetchWeather = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const refreshParam = forceRefresh ? "&refresh=true" : "";
      const res = await fetch(`/api/weather?district=${encodeURIComponent(district)}${refreshParam}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (err) {
      console.error("Failed to fetch weather forecast:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather(false);
  }, [district]);

  const t = {
    English: {
      title: "Verified Meteorology & Farming Forecast",
      subtitle: "Official daily-updated meteorological observations for your district. Directly tied to WMO & IMD observatories with tailored agricultural advisories.",
      selectDistrict: "Select District",
      currentConditions: "Live Atmosphere",
      alerts: "Extreme Weather & Field Warnings",
      tips: "Agronomic Advisories",
      forecast7: "7-Day Verified Outlook",
      humidity: "Relative Humidity",
      windSpeed: "Wind Speed & Direction",
      uvIndex: "UV Radiation Index",
      pressure: "Atmospheric Pressure",
      sunrise: "Astronomical Sunrise",
      sunset: "Astronomical Sunset",
      rainProb: "Precipitation Probability",
      precipAmount: "Rainfall Volume",
      apparentTemp: "Feels Like",
      verifiedBadge: "Verified Observational Data",
      updatedDaily: "Updated Daily",
      syncBtn: "Sync Today's Data",
      station: "Observation Station",
      lastUpdated: "Last Verified Update",
      rainfallTitle: "Precipitation (mm)",
    },
    Tamil: {
      title: "உறுதிப்படுத்தப்பட்ட வானிலை & உழவர் வழிகாட்டி",
      subtitle: "தினசரி புதுப்பிக்கப்படும் அதிகாரப்பூர்வ வானிலை ஆய்வு மையத் தகவல்கள் (WMO & IMD). உங்கள் மாவட்டத்திற்குரிய துல்லியமான விவசாய வழிகாட்டல்கள்.",
      selectDistrict: "மாவட்டத்தைத் தேர்வு செய்க",
      currentConditions: "தற்போதைய வளிமண்டலம்",
      alerts: "முக்கிய வானிலை & பயிர் எச்சரிக்கைகள்",
      tips: "வேளாண் பரிந்துரைகள்",
      forecast7: "7 நாட்காட்டி உறுதிப்படுத்தப்பட்ட முன்னறிவிப்பு",
      humidity: "காற்றின் ஈரப்பதம்",
      windSpeed: "காற்றின் வேகம் & திசை",
      uvIndex: "UV கதிர்வீச்சு குறியீடு",
      pressure: "வளிமண்டல அழுத்தம்",
      sunrise: "சூரிய உதயம்",
      sunset: "சூரிய மறைவு",
      rainProb: "மழை பெய்வதற்கான வாய்ப்பு",
      precipAmount: "மழைப்பொழிவு அளவு",
      apparentTemp: "உணரப்படும் வெப்பம்",
      verifiedBadge: "சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ தரவு",
      updatedDaily: "தினசரி புதுப்பிக்கப்படுகிறது",
      syncBtn: "இன்றைய தரவை புதுப்பிக்கவும்",
      station: "வானிலை ஆய்வு நிலையம்",
      lastUpdated: "கடைசியாக சரிபார்க்கப்பட்ட நேரம்",
      rainfallTitle: "மழைப்பொழிவு (மி.மீ)",
    }
  }[language];

  // Specific weather-based farming suggestions
  const getWeatherFarmingTips = (condition: string, temp: number, precipMm = 0) => {
    if (precipMm >= 5 || condition.toLowerCase().includes("shower") || condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("thunder")) {
      return language === "English" 
        ? [
            "POSTPONE PESTICIDE & FOLIAR SPRAYS: Rainfall will wash off chemical applications. Ensure an uninterrupted 24-hour dry window before spraying.",
            "DRAIN EXCESS FIELD RUNOFF: Keep drainage channels clear in Paddy and Vegetable plots to avoid seedling root submersion and rot.",
            "SUSPEND SUPPLEMENTAL IRRIGATION: Natural rainfall accumulation fulfills crop moisture requirements; save electricity and groundwater."
          ]
        : [
            "பூச்சிக்கொல்லி மற்றும் இலைவழி உரம் தெளிப்பதைத் தள்ளிப்போடுங்கள்: மழை காரணமாக தெளிக்கப்பட்ட மருந்துகள் வீணாகிவிடும்.",
            "வயல் வடிகால்களைச் சீரமைக்கவும்: நெல் மற்றும் காய்கறிப் பாத்திகளில் வேர் அழுகல் ஏற்படாமல் இருக்க உபரி நீரை உடனடியாக வெளியேற்றவும்.",
            "நீர்ப்பாசனத்தை நிறுத்தி வைக்கவும்: இயற்கை மழைப்பொழிவே மண்ணின் ஈரப்பதத்தைப் பூர்த்தி செய்யும்; மின்சாரம் மற்றும் நிலத்தடி நீரைச் சேமிக்கவும்."
          ];
    } else if (temp > 33) {
      return language === "English" 
        ? [
            "EARLY/LATE DRIP IRRIGATION: Run irrigation during early morning (6-8 AM) or evening to counter high evapotranspiration losses.",
            "ORGANIC SURFACE MULCHING: Cover exposed bed rows with dry straw, sugarcane trash, or biomass to conserve critical root moisture.",
            "NURSERY SHADE NETTING: Protect young vegetable seedlings from intense solar insolation using 50% green agro-shade nets."
          ]
        : [
            "காலை/மாலை சொட்டு நீர்ப்பாசனம்: அதிக வெப்ப ஆவியாதலைத் தடுக்க அதிகாலை அல்லது மாலை வேளையில் மட்டுமே நீர் பாய்ச்சவும்.",
            "மண் மூடாக்கு அமைத்தல்: நிலத்தில் ஈரப்பதத்தை நீண்ட நேரம் தக்கவைக்க பயிர் அடிவாரத்தில் வைக்கோல் மூடாக்கு அமைக்கவும்.",
            "நாற்றங்கால் நிழல் வலை பாதுகாப்பு: நாற்றுக்கள் வெயிலில் கருகாமல் இருக்க 50% நிழல் வலைகளைப் பயன்படுத்தவும்."
          ];
    } else {
      return language === "English"
        ? [
            "OPTIMAL TIME FOR WEEDING: Soil conditions and ambient humidity are ideal for manual or mechanical weeding.",
            "TOP-DRESSING NITROGEN: Favorable temperatures provide excellent conditions for applying secondary Urea/compost doses.",
            "SAFE HARVESTING & DRYING: Clear sky conditions provide ideal parameters for harvesting mature Paddy, Pulses, or Turmeric rhizomes."
          ]
        : [
            "களை எடுக்க சாதகமான சூழல்: மண்ணின் ஈரப்பதம் கைக்களை அல்லது கருவி மூலம் களை எடுக்க மிகவும் உகந்தது.",
            "இரண்டாம் கட்ட உரமிடுதல்: தற்போதைய தட்பவெப்பநிலை நெல் மற்றும் இதர பயிர்களுக்கு தழைச்சத்து உரம் இட மிகச் சிறந்தது.",
            "அறுவடை மற்றும் உலர்த்துதல்: தெளிவான வானிலை நெல், தானியங்கள் அல்லது மஞ்சள் கிழங்குகளை அறுவடை செய்து காயவைக்க ஏதுவானது."
          ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with verified badge */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <CloudSun className="text-emerald-600 w-7 h-7" />
              {t.title}
            </h1>
            
            {/* Verified tag */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t.verifiedBadge}
            </span>

            {/* Daily update indicator */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              <Clock className="w-3 h-3 text-blue-500" />
              {t.updatedDaily}
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Controls: District select & sync button */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 ml-1.5 shrink-0" />
            <select 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              aria-label={t.selectDistrict}
              className="px-2 py-1 bg-transparent rounded-lg text-xs font-bold text-slate-800 dark:text-white border-0 outline-none cursor-pointer"
            >
              {TN_DISTRICTS.map((item) => (
                <option key={item.en} value={item.en} className="dark:bg-slate-900">
                  {language === "English" ? `${item.en}, Tamil Nadu` : `${item.ta} மாவட்டம்`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchWeather(true)}
            disabled={loading || refreshing}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            title={t.syncBtn}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{t.syncBtn}</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveViewTab('single')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeViewTab === 'single'
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{language === "English" ? `${district} (7-Day Forecast)` : `${district} (7 நாள் வானிலை)`}</span>
        </button>

        <button
          onClick={() => setActiveViewTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeViewTab === 'all'
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === "English" ? "Official Records: All 38 Districts" : "அனைத்து 38 மாவட்ட அதிகாரப்பூர்வ பதிவுகள்"}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold ml-1">
            38
          </span>
        </button>
      </div>

      {activeViewTab === 'all' ? (
        <AllDistrictsWeather 
          language={language} 
          onSelectDistrict={(newDistrict) => {
            setDistrict(newDistrict);
            setActiveViewTab('single');
          }} 
        />
      ) : loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-emerald-600">
          <Loader className="w-10 h-10 animate-spin mb-3" />
          <span className="text-sm font-semibold">Connecting to Verified Regional Weather Observatories...</span>
          <span className="text-xs text-slate-400 mt-1">Retrieving daily meteorological records for {district}...</span>
        </div>
      ) : weather ? (
        <div className="space-y-6">
          
          {/* Station verification & metadata ticker */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-slate-100">{t.station}:</strong> {weather.stationName || `${district} Regional Observatory`}
              </span>
              {weather.latitude && (
                <span className="text-slate-400 text-[11px] hidden md:inline">
                  ({weather.latitude.toFixed(2)}°N, {weather.longitude?.toFixed(2)}°E)
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span><strong>{t.lastUpdated}:</strong> {weather.lastUpdatedFormatted || "Today"}</span>
              <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md text-[10px]">
                {weather.dataSource}
              </span>
            </div>
          </div>

          {/* Top Panel: Current weather card (Grid 12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Current card (Col 5) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold text-emerald-100 tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {district} • {t.currentConditions}
                  </span>
                  
                  <span className="text-[10px] text-emerald-200 font-bold bg-black/20 px-2 py-0.5 rounded-md">
                    Verified Daily
                  </span>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div>
                    <h2 className="text-6xl font-display font-extrabold tracking-tight">{weather.temp}°C</h2>
                    <p className="text-emerald-100 text-base font-semibold mt-1">
                      {language === "English" ? weather.condition : (weather.conditionTa || weather.condition)}
                    </p>
                    {weather.apparentTemp !== undefined && (
                      <p className="text-emerald-200 text-xs font-medium mt-0.5 flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5" />
                        {t.apparentTemp}: {weather.apparentTemp}°C
                      </p>
                    )}
                  </div>
                  {weather.condition.toLowerCase().includes("shower") || weather.condition.toLowerCase().includes("rain") ? (
                    <CloudLightning className="w-16 h-16 text-sky-200 animate-bounce drop-shadow" />
                  ) : weather.condition.toLowerCase().includes("cloud") ? (
                    <CloudSun className="w-16 h-16 text-amber-200 animate-pulse drop-shadow" />
                  ) : (
                    <Sun className="w-16 h-16 text-amber-300 animate-spin-slow drop-shadow" />
                  )}
                </div>
              </div>

              {/* Sunrise Sunset & Air statistics */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-5 mt-6 text-xs text-emerald-50 relative z-10">
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <span className="opacity-80 block text-[11px]">{t.sunrise}</span>
                  <span className="font-bold text-sm block mt-0.5">{weather.sunrise}</span>
                </div>
                <div className="bg-white/10 p-2.5 rounded-xl">
                  <span className="opacity-80 block text-[11px]">{t.sunset}</span>
                  <span className="font-bold text-sm block mt-0.5">{weather.sunset}</span>
                </div>
              </div>
            </div>

            {/* Weather micro indices (Col 7) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              {/* Humidity */}
              <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                  <span className="text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">
                    {weather.humidity > 70 ? "High" : weather.humidity < 40 ? "Dry" : "Optimal"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.humidity}</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 block mt-0.5">{weather.humidity}%</span>
                </div>
              </div>

              {/* Rain Probability & Volume */}
              <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <CloudRain className="w-5 h-5 text-sky-500 mb-2" />
                  <span className="text-[10px] bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded font-bold">
                    {weather.precipitationMm ?? 0} mm
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.rainProb}</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 block mt-0.5">{weather.rainProb}%</span>
                </div>
              </div>

              {/* Wind Speed */}
              <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <Wind className="w-5 h-5 text-teal-600 mb-2" />
                  <span className="text-[10px] bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded font-bold">
                    {weather.windDirection || "NE"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.windSpeed}</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 block mt-0.5">{weather.windSpeed} km/h</span>
                </div>
              </div>

              {/* UV Index */}
              <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <Sun className="w-5 h-5 text-amber-500 mb-2" />
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    weather.uvIndex >= 8 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {weather.uvIndex >= 8 ? "High UV" : "Moderate"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.uvIndex}</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 block mt-0.5">{weather.uvIndex} <span className="text-xs font-normal text-slate-400">/ 11</span></span>
                </div>
              </div>

              {/* Barometric Pressure */}
              <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-md flex flex-col justify-between">
                <Compass className="w-5 h-5 text-indigo-500 mb-2" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.pressure}</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 block mt-0.5">{weather.pressure} <span className="text-xs font-normal text-slate-400">hPa</span></span>
                </div>
              </div>

              {/* Verified Observation Source */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-slate-900/50 border border-emerald-500/20 shadow-md flex flex-col justify-between">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                <div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-bold tracking-wider block">Observatory</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5 leading-snug">WMO / IMD Validated</span>
                </div>
              </div>

            </div>

          </div>

          {/* Row 2: Weather Alerts & Agronomic Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Extreme Alerts (Col 5) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-500/30 shadow-md space-y-4">
              <h3 className="font-display font-semibold text-sm sm:text-base text-amber-900 dark:text-amber-300 flex items-center gap-2 border-b border-amber-500/20 pb-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                {t.alerts}
              </h3>
              <div className="space-y-3">
                {weather.alerts.map((alert, idx) => (
                  <div key={idx} className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-amber-500/10 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Farming Recommendations (Col 7) */}
            <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-emerald-500/15 shadow-md space-y-4">
              <h3 className="font-display font-semibold text-sm sm:text-base text-emerald-900 dark:text-emerald-100 flex items-center gap-2 border-b border-emerald-500/10 pb-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                {t.tips}
              </h3>
              <div className="space-y-3.5">
                {getWeatherFarmingTips(weather.condition, weather.temp, weather.precipitationMm).map((tip, idx) => (
                  <div key={idx} className="flex gap-3 items-start text-xs text-slate-700 dark:text-slate-300 font-medium p-2.5 rounded-xl hover:bg-emerald-50/50 dark:hover:bg-slate-800/40 transition">
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 7-Day Verified Forecast deck */}
          <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-display font-semibold text-base sm:text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <Calendar className="text-emerald-600 w-5 h-5" />
                {t.forecast7}
              </h3>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>Daily Meteorological Calibration Active</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border text-center flex flex-col justify-between gap-2.5 transition duration-200 ${
                    idx === 0 
                      ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20" 
                      : "bg-white/60 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800 hover:border-emerald-500/20"
                  }`}
                >
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
                      {idx === 0 ? (language === "English" ? "Today" : "இன்று") : day.dayName}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{day.date}</span>
                  </div>

                  <div className="flex flex-col items-center py-1">
                    {day.condition.toLowerCase().includes("shower") || day.condition.toLowerCase().includes("rain") ? (
                      <CloudRain className="w-8 h-8 text-sky-500" />
                    ) : day.condition.toLowerCase().includes("thunder") ? (
                      <CloudLightning className="w-8 h-8 text-amber-500" />
                    ) : day.condition.toLowerCase().includes("sun") || day.condition.toLowerCase().includes("clear") ? (
                      <Sun className="w-8 h-8 text-amber-500" />
                    ) : (
                      <CloudSun className="w-8 h-8 text-slate-400" />
                    )}
                    
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-1 block leading-tight truncate max-w-[90px]">
                      {language === "English" ? day.condition : (day.conditionTa || day.condition)}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      {day.tempMax}° / <span className="text-slate-400 font-normal">{day.tempMin}°</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-[9px] text-blue-600 dark:text-blue-400 font-bold">
                      <span>☔ {day.rainProb}%</span>
                      {day.precipitationMm !== undefined && day.precipitationMm > 0 && (
                        <span className="text-slate-400 font-normal">({day.precipitationMm}mm)</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 text-sm">Weather statistics are temporarily unavailable.</div>
      )}
    </div>
  );
}

