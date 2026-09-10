import { useState, useEffect } from "react";
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Sun, 
  Compass, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  CloudLightning,
  Loader
} from "lucide-react";
import { WeatherInfo } from "../types";

interface WeatherForecastProps {
  language: 'English' | 'Tamil';
  userDistrict: string;
}

export default function WeatherForecast({ language, userDistrict }: WeatherForecastProps) {
  const [district, setDistrict] = useState(userDistrict || "Coimbatore");
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        const res = await fetch(`/api/weather?district=${encodeURIComponent(district)}`);
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch (err) {
        console.error("Failed to fetch weather forecast:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [district]);

  const t = {
    English: {
      title: "Live Weather & Farming Forecast",
      subtitle: "7-day meteorology reports for your exact district. Includes automated AI farming tips aligned with crop sensitivity indices.",
      selectDistrict: "Change District",
      currentConditions: "Current Atmosphere",
      alerts: "Extreme Weather Alerts",
      tips: "Farming Recommendations",
      forecast7: "7-Day General Outlook",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      uvIndex: "UV Index",
      pressure: "Barometric Pressure",
      sunrise: "Sunrise",
      sunset: "Sunset",
      rainProb: "Rain Probability",
    },
    Tamil: {
      title: "நேரலை வானிலை & உழவர் கணிப்பு",
      subtitle: "7 நாட்காட்டி வானிலை அறிக்கை. உங்கள் பயிர்களுக்கு ஏற்ற விவசாய உத்தேச வழிகாட்டுதல்கள்.",
      selectDistrict: "மாவட்டத்தைத் தேர்வு செய்க",
      currentConditions: "தற்போதைய வானிலை",
      alerts: "வானிலை எச்சரிக்கைகள்",
      tips: "விவசாயப் பரிந்துரைகள்",
      forecast7: "7 நாட்காட்டி வானிலை முன்னறிவிப்பு",
      humidity: "ஈரப்பதம்",
      windSpeed: "காற்றின் வேகம்",
      uvIndex: "UV கதிர்வீச்சு",
      pressure: "வளிமண்டல அழுத்தம்",
      sunrise: "சூரிய உதயம்",
      sunset: "சூரிய மறைவு",
      rainProb: "மழை வாய்ப்பு",
    }
  }[language];

  // Specific weather-based farming suggestions
  const getWeatherFarmingTips = (condition: string, temp: number) => {
    if (condition.toLowerCase().includes("shower") || condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("thunder")) {
      return language === "English" 
        ? [
            "POSTPONE PESTICIDE SPRAYING: Liquid chemical sprays will wash off. Wait for 24-48 hours dry window.",
            "DRAIN FIELD CHANNELS: Ensure active drainage for Paddy seedlings to prevent root rot/submersion.",
            "HOLD IRRIGATION: Let natural precipitation fulfill water requirements, saving power and groundwater."
          ]
        : [
            "பூச்சிக்கொல்லி தெளிப்பதைத் தள்ளிப்போடுங்கள்: மழை காரணமாக மருந்துகள் அடித்துச் செல்லப்படலாம்.",
            "நீர் வடிகால்களைச் சீரமைக்கவும்: தேங்கியிருக்கும் உபரி நீரை வயல்களில் இருந்து வெளியேற்றவும்.",
            "நீர் பாசனத்தை நிறுத்தவும்: இயற்கை மழைப்பொழிவே பயிரின் நீர் தேவையைப் பூர்த்தி செய்யும்."
          ];
    } else if (temp > 32) {
      return language === "English"
        ? [
            "INCREASE TRICKLE IRRIGATION: Apply drip irrigation in mornings/evenings to combat high evapotranspiration.",
            "SOIL MULCHING: Spread dry straw or crop residues around crop base to conserve soil moisture.",
            "SHADE PROTECTION: Guard young nursery saplings with agri-shade nets to prevent leaf scorching."
          ]
        : [
            "நீர் பாசனத்தை அதிகரிக்கவும்: வெயில் தாக்கம் அதிகமாக இருப்பதால் காலை அல்லது மாலை வேளையில் நீர் பாய்ச்சவும்.",
            "மண் மூடாக்கு அமைத்தல்: நிலத்தில் ஈரப்பதத்தை தக்கவைக்க காய்ந்த இலைகளால் மூடாக்கு அமைக்கவும்.",
            "நிழல் வலை பாதுகாப்பு: நாற்றங்கால்களை நேரடி வெயிலில் இருந்து பாதுகாக்க நிழல் வலைகளை அமைக்கவும்."
          ];
    } else {
      return language === "English"
        ? [
            "OPTIMAL WEEDING TIME: Soil condition is ideal for mechanical/manual weeding in open fields.",
            "APPLY FERTILIZER: Favorable temperatures are perfect for top-dressing nitrogen fertilizers (Urea).",
            "HARVEST ACTIVE CROPS: Clear, dry skies offer perfect conditions for harvesting ripe Paddy or Turmeric."
          ]
        : [
            "களை எடுக்க உகந்த நேரம்: வயல்களில் களை எடுப்பதற்கு தற்போதைய மண் நிலை மிகவும் சாதகமாக உள்ளது.",
            "உரமிடுதல்: தற்போதைய வெப்பநிலை நெல் போன்ற பயிர்களுக்கு இரண்டாம் கட்ட உரமிட (யுரியா) உகந்தது.",
            "அறுவடைக்கு உகந்த காலம்: தெளிவான வானிலை நெல் அல்லது மஞ்சள் அறுவடைக்கு மிகச் சிறந்தது."
          ];
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
            <CloudSun className="text-emerald-600" />
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* District select */}
        <div className="flex items-center gap-2 self-start shrink-0">
          <span className="text-xs font-semibold text-slate-500">{t.selectDistrict}:</span>
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold dark:text-white"
          >
            {["Coimbatore", "Madurai", "Salem", "Trichy", "Chennai", "Thanjavur", "Erode", "Tirunelveli", "Cuddalore", "Dharmapuri"].map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-emerald-600">
          <Loader className="w-12 h-12 animate-spin mb-3" />
          <span className="text-sm font-semibold">Synchronizing with Regional Meteorological Centers...</span>
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Top Panel: Current weather card (Grid 12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Current card (Col 5) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold text-emerald-100 tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                  {district} {t.currentConditions}
                </span>

                <div className="flex items-center justify-between mt-6">
                  <div>
                    <h2 className="text-6xl font-display font-extrabold tracking-tight">{weather.temp}°C</h2>
                    <p className="text-emerald-100 text-sm font-semibold mt-1">{weather.condition}</p>
                  </div>
                  {weather.condition.toLowerCase().includes("shower") || weather.condition.toLowerCase().includes("rain") ? (
                    <CloudLightning className="w-16 h-16 text-sky-200 animate-bounce" />
                  ) : (
                    <CloudSun className="w-16 h-16 text-amber-300 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Sunrise Sunset & Air statistics */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6 mt-6 text-xs text-emerald-50">
                <div>
                  <span className="opacity-75 block">{t.sunrise}</span>
                  <span className="font-bold text-sm block mt-0.5">{weather.sunrise}</span>
                </div>
                <div>
                  <span className="opacity-75 block">{t.sunset}</span>
                  <span className="font-bold text-sm block mt-0.5">{weather.sunset}</span>
                </div>
              </div>
            </div>

            {/* Weather micro indices (Col 7) */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-lg flex flex-col justify-between">
                <Droplets className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.humidity}</span>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 block mt-1">{weather.humidity}%</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-lg flex flex-col justify-between">
                <Wind className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.windSpeed}</span>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 block mt-1">{weather.windSpeed} km/h</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-lg flex flex-col justify-between">
                <Sun className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.uvIndex}</span>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 block mt-1">{weather.uvIndex} / 11</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-lg flex flex-col justify-between">
                <Compass className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.pressure}</span>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 block mt-1">{weather.pressure} hPa</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Weather Alerts & Agronomic Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Extreme Alerts (Col 5) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-amber-50/10 dark:bg-amber-950/10 border border-amber-500/20 shadow-lg space-y-4">
              <h3 className="font-display font-semibold text-base text-amber-800 dark:text-amber-400 flex items-center gap-2 border-b border-amber-500/10 pb-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                {t.alerts}
              </h3>
              <div className="space-y-3">
                {weather.alerts.map((alert, idx) => (
                  <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {alert}
                  </p>
                ))}
              </div>
            </div>

            {/* Farming Recommendations (Col 7) */}
            <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-emerald-500/15 shadow-lg space-y-4">
              <h3 className="font-display font-semibold text-base text-emerald-900 dark:text-emerald-100 flex items-center gap-2 border-b border-emerald-500/10 pb-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                {t.tips}
              </h3>
              <div className="space-y-3.5">
                {getWeatherFarmingTips(weather.condition, weather.temp).map((tip, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 7-Day Forecast deck */}
          <div className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
            <h3 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
              <Calendar className="text-emerald-600" />
              {t.forecast7}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border text-center flex flex-col justify-between gap-2.5 transition duration-200 ${
                    idx === 0 
                      ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/35 shadow-md" 
                      : "bg-white/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-emerald-500/10"
                  }`}
                >
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">{day.dayName}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{day.date}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <CloudSun className={`w-8 h-8 ${day.condition.toLowerCase().includes("sun") ? "text-amber-500" : "text-slate-400"}`} />
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block leading-tight">{day.condition}</span>
                  </div>

                  <div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      {day.tempMax}° / {day.tempMin}°
                    </div>
                    <span className="text-[9px] text-blue-500 dark:text-blue-400 block font-bold mt-0.5">
                      ☔ {day.rainProb}%
                    </span>
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
