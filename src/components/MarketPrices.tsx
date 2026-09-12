import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Star, 
  ChevronRight, 
  Activity, 
  Calendar, 
  AlertCircle, 
  BadgeAlert,
  Loader,
  ArrowRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { MarketPrice } from "../types";

interface MarketPricesProps {
  language: 'English' | 'Tamil';
  userDistrict: string;
}

export default function MarketPrices({ language, userDistrict }: MarketPricesProps) {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState(userDistrict || "");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("fav_crops");
    return saved ? JSON.parse(saved) : ["Paddy (Ponni)", "Turmeric (Finger)"];
  });
  const [selectedCrop, setSelectedCrop] = useState<MarketPrice | null>(null);

  // Load prices
  useEffect(() => {
    async function fetchPrices() {
      try {
        setLoading(true);
        const url = `/api/market-prices?query=${encodeURIComponent(searchQuery)}&district=${encodeURIComponent(districtFilter)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
          if (data.length > 0 && !selectedCrop) {
            setSelectedCrop(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch market prices:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, [searchQuery, districtFilter]);

  // Handle Favorites toggle
  const toggleFavorite = (cropName: string) => {
    const updated = favorites.includes(cropName)
      ? favorites.filter(f => f !== cropName)
      : [...favorites, cropName];
    setFavorites(updated);
    localStorage.setItem("fav_crops", JSON.stringify(updated));
  };

  const t = {
    English: {
      title: "Live Market Prices (eNAM/AGMARKNET)",
      subtitle: "Official daily market rates across major agricultural yards. Track historic trends and preview AI price forecast models.",
      searchPlaceholder: "Search crops or markets...",
      districtLabel: "Filter District",
      favCrops: "Favorite Crops Pinboard",
      allMarkets: "Market Arrivals Ledger",
      chartTitle: "Weekly Trend Analytics",
      aiPrediction: "HarvestPulse AI Price Prediction",
      nextMonth: "Forecasted Price (Next Month)",
      confidence: "Model Confidence Level",
      reasoning: "AI Market Outlook",
      cropCol: "Crop",
      marketCol: "Market / District",
      modalCol: "Modal Price (100Kg)",
      trendCol: "Change / Trend",
      predictionsBtn: "AI Prediction Engine",
    },
    Tamil: {
      title: "நேரலை சந்தை விலைகள்",
      subtitle: "முக்கிய சந்தைகளில் தினசரி பயிர் விலைகள் (eNAM/அக்மார்க்நெட்). வரலாற்றுப் போக்குகள் மற்றும் AI விலை கணிப்புகள்.",
      searchPlaceholder: "பயிர் அல்லது சந்தையைத் தேடுக...",
      districtLabel: "மாவட்ட வடிகட்டி",
      favCrops: "விருப்பமான பயிர்கள்",
      allMarkets: "சந்தை விலைப் பட்டியல்",
      chartTitle: "வாராந்திர சந்தைப் போக்கு",
      aiPrediction: "ஹார்வெஸ்ட்பல்ஸ் AI விலை கணிப்பு",
      nextMonth: "அடுத்த மாத உத்தேச விலை",
      confidence: "துல்லியத் தன்மை",
      reasoning: "AI சந்தை நிலவர உரை",
      cropCol: "பயிர்",
      marketCol: "சந்தை / மாவட்டம்",
      modalCol: "சராசரி விலை (100 கிலோ)",
      trendCol: "சந்தை மாற்றம் / போக்கு",
      predictionsBtn: "AI உத்தேச கணிப்பு",
    }
  }[language];

  // Simulated chart historical data points
  const generateChartData = (basePrice: number, weeklyTrend: string) => {
    const trendMultiplier = weeklyTrend === "up" ? 1.01 : weeklyTrend === "down" ? 0.99 : 1.001;
    return [
      { day: "Mon", price: Math.round(basePrice * 0.96) },
      { day: "Tue", price: Math.round(basePrice * 0.97 * trendMultiplier) },
      { day: "Wed", price: Math.round(basePrice * 0.99) },
      { day: "Thu", price: Math.round(basePrice * 0.98 * trendMultiplier) },
      { day: "Fri", price: Math.round(basePrice * trendMultiplier) },
      { day: "Sat", price: Math.round(basePrice) },
    ];
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
            <TrendingUp className="text-emerald-600" />
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t.subtitle}
          </p>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-xl text-xs font-semibold border border-emerald-500/10 self-start flex items-center gap-1.5 shrink-0">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
          <span>Offline Cached Sync: Enabled</span>
        </div>
      </div>

      {/* Controls panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm dark:text-white"
          />
        </div>

        <div className="md:col-span-5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold dark:text-white"
          >
            <option value="">All Districts (Tamil Nadu)</option>
            {["Coimbatore", "Madurai", "Salem", "Trichy", "Chennai", "Thanjavur", "Erode", "Tirunelveli", "Cuddalore", "Dharmapuri"].map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dual Layout: Arrivals Ledger & Detailed Predictive Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Arrivals Ledger (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Favorite pinboard */}
          {favorites.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/20 dark:bg-amber-950/5 border border-amber-500/15">
              <h3 className="font-display font-bold text-xs text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-3">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                {t.favCrops}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prices.filter(p => favorites.includes(p.crop)).map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedCrop(item)}
                    className={`p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/10 hover:border-amber-500/40 cursor-pointer transition flex justify-between items-center ${
                      selectedCrop?.crop === item.crop && selectedCrop?.market === item.market ? "ring-1 ring-amber-500" : ""
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{item.crop}</span>
                      <span className="text-[10px] text-slate-400">{item.market}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">₹{item.modalPrice}</span>
                      <span className={`text-[10px] font-semibold ${item.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All listings Ledger */}
          <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
            <h3 className="font-display font-bold text-sm text-emerald-900 dark:text-emerald-100">
              {t.allMarkets}
            </h3>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-emerald-600">
                <Loader className="w-10 h-10 animate-spin mb-2" />
                <span className="text-xs font-medium">Fetching AGMARKNET daily arrivals...</span>
              </div>
            ) : prices.length > 0 ? (
              <div className="overflow-hidden border border-slate-100 dark:border-slate-800/75 rounded-xl text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-3"></th>
                      <th className="p-3">{t.cropCol}</th>
                      <th className="p-3">{t.marketCol}</th>
                      <th className="p-3">{t.modalCol}</th>
                      <th className="p-3 text-right">{t.trendCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {prices.map((item, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => setSelectedCrop(item)}
                        className={`hover:bg-emerald-500/5 cursor-pointer transition ${
                          selectedCrop?.crop === item.crop && selectedCrop?.market === item.market ? "bg-emerald-50/50 dark:bg-emerald-950/10" : ""
                        }`}
                      >
                        <td className="p-3" onClick={(e) => { e.stopPropagation(); toggleFavorite(item.crop); }}>
                          <Star className={`w-4 h-4 cursor-pointer transition ${
                            favorites.includes(item.crop) ? "fill-amber-400 text-amber-500" : "text-slate-300 hover:text-amber-400"
                          }`} />
                        </td>
                        <td className="p-3 font-extrabold text-slate-800 dark:text-slate-200">{item.crop}</td>
                        <td className="p-3">
                          <span className="block text-slate-700 dark:text-slate-300 font-semibold">{item.market}</span>
                          <span className="text-[10px] text-slate-500">{item.district}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          ₹{item.modalPrice}
                          <span className="text-[10px] text-slate-500 font-normal block">Range: ₹{item.minPrice} - ₹{item.maxPrice}</span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-bold block ${item.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {item.change >= 0 ? "+" : ""}{item.change}%
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">{item.weeklyTrend} Trend</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 font-medium border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No matching crops found for "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Detailed Price Analytics / Prediction Panel (Col 5) */}
        <div className="lg:col-span-5">
          {selectedCrop ? (
            <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-5 sticky top-4">
              
              {/* Product Info */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">Currently Selected</span>
                <h3 className="text-xl font-display font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCrop.crop}</h3>
                <span className="text-xs text-slate-500">{selectedCrop.market} ({selectedCrop.district} Yard)</span>
              </div>

              {/* Weekly Chart */}
              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">{t.chartTitle}</span>
                <div className="h-[150px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateChartData(selectedCrop.modalPrice, selectedCrop.weeklyTrend)}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.08)" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} width={35} axisLine={false} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ fontSize: 11, background: '#111827', color: '#fff', borderRadius: 8 }} />
                      <Area type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Prediction module */}
              <div className="p-5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-500/10 space-y-3.5">
                <h4 className="font-display font-bold text-xs text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  {t.aiPrediction}
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500/5">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">{t.nextMonth}</span>
                    <span className="text-base font-extrabold text-emerald-600 mt-1 block">₹{selectedCrop.aiPrediction.nextMonthPrice} <span className="text-[10px] text-slate-500">/q</span></span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-500/5">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">{t.confidence}</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                      {selectedCrop.aiPrediction.confidence}%
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 pt-1.5 border-t border-emerald-500/5">
                  <span className="font-bold text-emerald-950 dark:text-emerald-100 block">{t.reasoning}:</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic font-medium">
                    {selectedCrop.aiPrediction.reasoning}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">Select a crop from the arrivals table to see dynamic historical charts and AI price predictions.</div>
          )}
        </div>

      </div>
    </div>
  );
}
