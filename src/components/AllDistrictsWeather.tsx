import { useState, useEffect, useMemo } from "react";
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Sun, 
  AlertTriangle, 
  CheckCircle2, 
  CloudLightning, 
  Loader, 
  ShieldCheck, 
  RefreshCw, 
  Clock, 
  MapPin, 
  Thermometer, 
  CloudRain,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Building2
} from "lucide-react";
import { DistrictWeatherSummary } from "../types";

interface AllDistrictsWeatherProps {
  language: 'English' | 'Tamil';
  onSelectDistrict: (districtName: string) => void;
}

const ZONES = [
  { id: "All", en: "All 38 Districts", ta: "அனைத்து 38 மாவட்டங்கள்" },
  { id: "Cauvery Delta Zone", en: "Cauvery Delta Zone", ta: "காவிரி டெல்டா மண்டலம்" },
  { id: "Western Zone", en: "Western Zone", ta: "மேற்கு மண்டலம்" },
  { id: "North Eastern Zone", en: "North Eastern Zone", ta: "வடகிழக்கு மண்டலம்" },
  { id: "North Western Zone", en: "North Western Zone", ta: "வடமேற்கு மண்டலம்" },
  { id: "Southern Zone", en: "Southern Zone", ta: "தென் மண்டலம்" },
  { id: "High Altitude & Hilly Zone", en: "Hilly Zone (Nilgiris)", ta: "மலைப் பிரதேசம்" },
];

export default function AllDistrictsWeather({ language, onSelectDistrict }: AllDistrictsWeatherProps) {
  const [districts, setDistricts] = useState<DistrictWeatherSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("All");
  const [sortBy, setSortBy] = useState<'name' | 'temp-high' | 'temp-low' | 'rain'>('name');
  const [metadata, setMetadata] = useState<{
    totalDistricts: number;
    dataSource: string;
    verifiedNetwork: string;
  } | null>(null);

  const fetchDistricts = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await fetch("/api/weather/all-districts");
      if (res.ok) {
        const data = await res.json();
        if (data.districts) {
          setDistricts(data.districts);
          setMetadata({
            totalDistricts: data.totalDistricts || data.districts.length,
            dataSource: data.dataSource || "IMD Meteorological Observatories & TNAU Agromet Advisory Bulletin",
            verifiedNetwork: data.verifiedNetwork || "Tamil Nadu Agro-Meteorological Network"
          });
        }
      }
    } catch (err) {
      console.error("Failed to load all districts weather:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDistricts(false);
  }, []);

  const filteredDistricts = useMemo(() => {
    return districts
      .filter(item => {
        const matchesZone = selectedZone === "All" || item.zone === selectedZone;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = !q || 
          item.district.toLowerCase().includes(q) ||
          item.districtTa.includes(q) ||
          item.zone.toLowerCase().includes(q) ||
          item.station.toLowerCase().includes(q);
        return matchesZone && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.district.localeCompare(b.district);
        if (sortBy === 'temp-high') return b.temp - a.temp;
        if (sortBy === 'temp-low') return a.temp - b.temp;
        if (sortBy === 'rain') return b.rainProb - a.rainProb;
        return 0;
      });
  }, [districts, selectedZone, searchQuery, sortBy]);

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("shower") || c.includes("rain") || c.includes("drizzle")) {
      return <CloudRain className="w-7 h-7 text-sky-500" />;
    }
    if (c.includes("thunder")) {
      return <CloudLightning className="w-7 h-7 text-amber-500" />;
    }
    if (c.includes("sun") || c.includes("clear")) {
      return <Sun className="w-7 h-7 text-amber-500" />;
    }
    return <CloudSun className="w-7 h-7 text-emerald-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Official Network Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-emerald-100 backdrop-blur-xs flex items-center gap-1.5 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-lime-300" />
                {language === "English" ? "Official Government Records" : "அரசு அதிகாரப்பூர்வ பதிவுகள்"}
              </span>
              <span className="text-[11px] text-emerald-200/90 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-lime-400" />
                {metadata?.verifiedNetwork || "Tamil Nadu Agro-Meteorological Network"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
              {language === "English" 
                ? "Official Weather Records — All 38 Districts" 
                : "அனைத்து 38 மாவட்டங்களின் அதிகாரப்பூர்வ வானிலை அறிக்கை"}
            </h2>
            <p className="text-xs text-emerald-100/80 max-w-2xl">
              {language === "English"
                ? "Real-time records from IMD observatories, TNAU regional research stations, and Agro-Climate Centers across Tamil Nadu."
                : "தமிழ்நாடு வேளாண் பல்கலைக்கழகம் (TNAU) மற்றும் இந்திய வானிலை ஆய்வுத் துறை (IMD) நிலையங்களின் அதிகாரப்பூர்வ வானிலை பதிவுகள்."}
            </p>
          </div>

          <button
            onClick={() => fetchDistricts(true)}
            disabled={loading || refreshing}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/20 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{language === "English" ? "Sync Observatories" : "பதிவுகளை புதுப்பி"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-card border border-emerald-500/10 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "English" ? "Search district, zone, or station..." : "மாவட்டம், மண்டலம் அல்லது நிலையத்தை தேடுக..."}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              {language === "English" ? "Sort By:" : "வரிசைப்படுத்து:"}
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="name">{language === "English" ? "District Name (A-Z)" : "மாவட்ட பெயர்"}</option>
              <option value="temp-high">{language === "English" ? "Highest Temperature" : "அதிக வெப்பநிலை"}</option>
              <option value="temp-low">{language === "English" ? "Lowest Temperature" : "குறைந்த வெப்பநிலை"}</option>
              <option value="rain">{language === "English" ? "Rain Probability (%)" : "மழை வாய்ப்பு (%)"}</option>
            </select>
          </div>
        </div>

        {/* Zone Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {ZONES.map(z => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                selectedZone === z.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {language === "English" ? z.en : z.ta}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 38 Districts */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-emerald-600">
          <Loader className="w-10 h-10 animate-spin mb-3" />
          <span className="text-sm font-semibold">
            {language === "English" ? "Connecting to 38 District Meteorological Observatories..." : "38 மாவட்ட வானிலை நிலையங்களுடன் இணைக்கிறது..."}
          </span>
          <span className="text-xs text-slate-400 mt-1">Retrieving verified baseline records...</span>
        </div>
      ) : filteredDistricts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
          {language === "English" ? "No districts matched your search filter." : "தேடலுக்கு பொருந்தும் மாவட்டங்கள் இல்லை."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDistricts.map(item => (
            <div 
              key={item.district}
              className="p-5 rounded-2xl glass-card border border-emerald-500/10 hover:border-emerald-500/30 transition shadow-sm hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* District Header */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold font-display text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {item.district}
                      </h3>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        ({item.districtTa})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 inline-block mt-1">
                      {item.zone}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shrink-0">
                    {getWeatherIcon(item.condition)}
                  </div>
                </div>

                {/* Primary Metrics */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
                      {item.temp}°C
                    </span>
                    <span className="text-[11px] text-slate-400 ml-1.5 font-medium">
                      {item.tempMin}° / {item.tempMax}°C
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">
                    {language === "English" ? item.condition : (item.conditionTa || item.condition)}
                  </span>
                </div>

                {/* Agro Met details */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    <span>{item.humidity}% {language === "English" ? "Humidity" : "ஈரப்பதம்"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Wind className="w-3.5 h-3.5 text-teal-500" />
                    <span>{item.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                    <span>☔ {item.rainProb}% {language === "English" ? "Rain" : "மழை"}</span>
                    {item.precipitationMm !== undefined && item.precipitationMm > 0 && (
                      <span className="text-slate-400 font-normal">({item.precipitationMm}mm)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Official Station Provenance */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 flex items-start gap-1">
                  <Building2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="truncate" title={item.station}>
                    {item.station}
                  </span>
                </div>

                {/* Alert if present */}
                {item.alert && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 text-[11px] font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{item.alert}</span>
                  </div>
                )}
              </div>

              {/* Action Button to switch to single 7-day view */}
              <button
                onClick={() => onSelectDistrict(item.district)}
                className="w-full mt-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border border-emerald-500/15 cursor-pointer"
              >
                <span>{language === "English" ? "View 7-Day Agronomy Forecast" : "7 நாள் விவசாய வானிலை காண்க"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
