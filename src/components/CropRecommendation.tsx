import { useState, FormEvent } from "react";
import { Sprout, Loader, AlertCircle, ArrowRight, CheckCircle2, TrendingUp, Calendar, ShoppingBag, ShieldCheck } from "lucide-react";
import { CropRecommendation as CropRecType } from "../types";

interface CropRecommendationProps {
  language: 'English' | 'Tamil';
  userDistrict: string;
  userSoil: string;
}

export default function CropRecommendation({ language, userDistrict, userSoil }: CropRecommendationProps) {
  const [district, setDistrict] = useState(userDistrict || "Coimbatore");
  const [soilType, setSoilType] = useState(userSoil || "Clayey Soil");
  const [season, setSeason] = useState("Kharif (June-October)");
  const [farmSize, setFarmSize] = useState("2");
  const [waterAvailability, setWaterAvailability] = useState("Canal & Borewell");
  const [budget, setBudget] = useState("Medium (Moderate Investment)");
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropRecType[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = {
    English: {
      title: "AI Crop Recommendation",
      subtitle: "Intelligent analytics-driven recommendations based on soil, district weather indexes, and water budget.",
      formHeader: "Input Field Conditions",
      districtLabel: "District (Tamil Nadu)",
      soilLabel: "Soil Type",
      seasonLabel: "Sowing Season",
      farmSizeLabel: "Farm Size (Acres)",
      waterLabel: "Water Source & Availability",
      budgetLabel: "Investment Capacity",
      buttonText: "Generate Recommendations",
      loadingText: "HarvestPulse AI analyzing regional parameters...",
      recommendedCrops: "Recommended Crops",
      growingDuration: "Growing Duration",
      expectedYield: "Expected Yield",
      profit: "Estimated Profit",
      marketDemand: "Market Demand",
      risk: "Risk Level",
      fertilizers: "Fertilizers Recommended",
      irrigation: "Irrigation Schedule",
      aiReason: "HarvestPulse AI Agronomic Reasoning",
    },
    Tamil: {
      title: "பயிர் பரிந்துரை இயந்திரம்",
      subtitle: "உங்கள் மண் வகை, மாவட்ட வானிலை மற்றும் நீர் ஆதாரங்களின் அடிப்படையில் உகந்த பயிர் பரிந்துரைகள்.",
      formHeader: "வயல் தரவுகள்",
      districtLabel: "மாவட்டம்",
      soilLabel: "மண் வகை",
      seasonLabel: "பயிர் பருவம்",
      farmSizeLabel: "நிலத்தின் அளவு (ஏக்கர்)",
      waterLabel: "நீர் ஆதாரம் & வசதி",
      budgetLabel: "முதலீட்டுத் திறன்",
      buttonText: "பரிந்துரைகளைப் பெறுக",
      loadingText: "ஹார்வெஸ்ட்பல்ஸ் AI உங்கள் தரவுகளை ஆராய்கிறது...",
      recommendedCrops: "பரிந்துரைக்கப்பட்ட பயிர்கள்",
      growingDuration: "பயிர் காலம்",
      expectedYield: "எதிர்பார்க்கும் விளைச்சல்",
      profit: "மதிப்பிடப்பட்ட இலாபம்",
      marketDemand: "சந்தைத் தேவை",
      risk: "ஆபத்து நிலை",
      fertilizers: "பரிந்துரைக்கப்படும் உரங்கள்",
      irrigation: "நீர் பாசன அட்டவணை",
      aiReason: "ஹார்வெஸ்ட்பல்ஸ் AI விவசாய விளக்கம்",
    }
  }[language];

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/gemini/recommend-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district,
          soilType,
          season,
          farmSize,
          irrigationType: waterAvailability,
          waterAvailability,
          budget
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.crops && Array.isArray(data.crops)) {
          setResults(data.crops);
        } else {
          throw new Error("Invalid output format from AI model");
        }
      } else {
        throw new Error("Server failed to generate recommendations");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
          <Sprout className="text-emerald-600" />
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form panel */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
          <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 border-b border-emerald-500/10 pb-2">
            {t.formHeader}
          </h2>

          <div className="space-y-3 text-xs">
            {/* District */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.districtLabel}</label>
              <select 
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100"
              >
                {["Coimbatore", "Madurai", "Salem", "Trichy", "Chennai", "Thanjavur", "Erode", "Tirunelveli", "Cuddalore", "Dharmapuri"].map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Soil Type */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.soilLabel}</label>
              <select 
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100"
              >
                {["Clayey Soil (Red loam)", "Black Soil (Karisal)", "Alluvial Soil (Vandal)", "Red Soil (Semman)", "Sandy Loam", "Saline/Alkaline Soil"].map((soil) => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
            </div>

            {/* Sowing Season */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.seasonLabel}</label>
              <select 
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100"
              >
                <option value="Kharif (June-October)">Kharif (Sornavari/Kar - Monsoon sowing)</option>
                <option value="Rabi (October-March)">Rabi (Samba/Thaladi - Winter sowing)</option>
                <option value="Zaid (March-June)">Zaid (Navarai - Summer dry sowing)</option>
              </select>
            </div>

            {/* Farm Size */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.farmSizeLabel}</label>
              <input 
                type="number"
                min="0.5"
                step="0.5"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100"
              />
            </div>

            {/* Water Source */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.waterLabel}</label>
              <select 
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100"
              >
                <option value="Drip Irrigation (Very restricted water)">Drip Irrigation (Water-Saving)</option>
                <option value="Canal Irrigation (Abundant water)">Canal Irrigation (River-fed)</option>
                <option value="Borewell/Well (Moderate water)">Borewell / Open Well (Moderate)</option>
                <option value="Rainfed Only (Highly dependent on monsoon)">Rainfed Only (Dry farming)</option>
              </select>
            </div>

            {/* Budget */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.budgetLabel}</label>
              <select 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100"
              >
                <option value="Low (Minimum setup capital)">Low Investment (Marginal farming)</option>
                <option value="Medium (Moderate Investment)">Medium Investment (Standard setup)</option>
                <option value="High (Commercial setup/Modern drip)">High Investment (SaaS & Commercial farming)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>{t.loadingText}</span>
              </>
            ) : (
              <>
                <Sprout className="w-4 h-4" />
                <span>{t.buttonText}</span>
              </>
            )}
          </button>
        </form>

        {/* Results panel */}
        <div className="lg:col-span-7 space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-emerald-500/20">
              <div className="relative">
                <Loader className="w-12 h-12 text-emerald-600 animate-spin" />
                <Sprout className="w-5 h-5 text-emerald-500 absolute top-3.5 left-3.5 animate-bounce" />
              </div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mt-4 text-center">
                {t.loadingText}
              </p>
              <p className="text-xs text-slate-500 text-center mt-1">
                Combining regional average monsoon data with nitrogen-phosphorus indices for precision suggestions...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-800 dark:text-red-300 flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error:</span> {error}
              </div>
            </div>
          )}

          {!loading && !error && !results && (
            <div className="flex flex-col items-center justify-center py-16 p-6 bg-slate-50/30 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <Sprout className="w-12 h-12 text-emerald-600/30 mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Ready to Analyze</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Enter your localized soil structure, water availability, and season in the form to generate professional AI Recommendations.
              </p>
            </div>
          )}

          {/* Render Recommendations list */}
          {results && (
            <div className="space-y-5">
              <h3 className="font-display font-bold text-lg text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600 w-5 h-5" />
                {t.recommendedCrops} ({results.length})
              </h3>

              {results.map((rec, index) => (
                <div key={index} className="p-6 rounded-2xl glass-card border border-emerald-500/15 shadow-xl space-y-4 hover:border-emerald-500/30 transition duration-300">
                  <div className="flex justify-between items-start border-b border-emerald-500/10 pb-3 gap-2">
                    <div>
                      <h4 className="text-xl font-display font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-display">
                          {index + 1}
                        </span>
                        {rec.cropName}
                      </h4>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        {rec.growingDuration}
                      </span>
                    </div>
                  </div>

                  {/* Summary Indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-emerald-500/5">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">{t.expectedYield}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        {rec.expectedYield}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-emerald-500/5">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">{t.profit}</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {rec.profitEstimation}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-emerald-500/5">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">{t.marketDemand}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                        {rec.marketDemand}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-emerald-500/5">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">{t.risk}</span>
                      <span className={`text-xs font-bold mt-0.5 flex items-center gap-1 ${
                        rec.riskLevel === "Low" ? "text-emerald-600" : rec.riskLevel === "Medium" ? "text-amber-500" : "text-red-500"
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {rec.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Fertilizers & Irrigation schedule details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
                    <div>
                      <span className="font-extrabold text-emerald-950 dark:text-emerald-100 block mb-1.5">{t.fertilizers}</span>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400 font-medium">
                        {rec.suitableFertilizers.map((fert, idx) => (
                          <li key={idx}>{fert}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-extrabold text-emerald-950 dark:text-emerald-100 block mb-1.5">{t.irrigation}</span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {rec.irrigationSchedule}
                      </p>
                    </div>
                  </div>

                  {/* AI Explanation reasoning */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-xs bg-emerald-50/30 dark:bg-emerald-950/10 p-3 rounded-xl border border-emerald-500/5">
                    <span className="font-extrabold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t.aiReason}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                      {rec.aiExplanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
