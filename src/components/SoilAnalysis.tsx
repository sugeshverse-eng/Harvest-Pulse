import { useState, FormEvent } from "react";
import { HelpCircle, Loader, AlertCircle, FileText, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { SoilReport } from "../types";

interface SoilAnalysisProps {
  language: 'English' | 'Tamil';
  userSoil: string;
}

export default function SoilAnalysis({ language, userSoil }: SoilAnalysisProps) {
  const [nValue, setNValue] = useState("120"); // Nitrogen kg/acre
  const [pValue, setPValue] = useState("15");  // Phosphorus kg/acre
  const [kValue, setKValue] = useState("140"); // Potassium kg/acre
  const [phValue, setPhValue] = useState("6.2"); // pH value

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SoilReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = {
    English: {
      title: "Soil Health Card Analyzer",
      subtitle: "Enter NPK (Nitrogen, Phosphorus, Potassium) and pH values from your lab card to generate instant fertilization balance sheets and AI soil reports.",
      cardHeader: "NPK & pH Inputs",
      nLabel: "Nitrogen (N) - kg/acre",
      pLabel: "Phosphorus (P) - kg/acre",
      kLabel: "Potassium (K) - kg/acre",
      phLabel: "Soil pH (Acidity)",
      micronutrients: "Micronutrients Deficiencies",
      buttonText: "Generate Soil Report",
      loadingText: "HarvestPulse AI calculating chemical balance sheets...",
      npkChart: "NPK Distribution Metrics",
      recs: "Fertilizer Recommendations",
      organic: "Organic Restoration Suggestions",
      aiReport: "HarvestPulse AI Agronomic Soil Report",
    },
    Tamil: {
      title: "மண் பரிசோதனை அறிக்கை",
      subtitle: "உங்கள் மண் அட்டை அல்லது ஆய்வகத்தில் பெற்ற NPK மற்றும் pH அளவுகளைப் பதிவிட்டு, உர அளவீடுகள் மற்றும் உகந்த விவசாய அறிக்கையைப் பெறுங்கள்.",
      cardHeader: "NPK & pH அளவுகள்",
      nLabel: "தழைச்சத்து (N) - கிலோ/ஏக்கர்",
      pLabel: "மணிச்சத்து (P) - கிலோ/ஏக்கர்",
      kLabel: "சாம்பல்சத்து (K) - கிலோ/ஏக்கர்",
      phLabel: "மண்ணின் அமிலத்தன்மை (pH)",
      micronutrients: "நுண்ணூட்டச் சத்து பற்றாக்குறை",
      buttonText: "மண் அறிக்கை பெறுக",
      loadingText: "ஹார்வெஸ்ட்பல்ஸ் AI மண் குறியீடுகளைக் கணக்கிடுகிறது...",
      npkChart: "மண்ணின் ஊட்டச்சத்து நிலை",
      recs: "உர பரிந்துரைகள்",
      organic: "இயற்கை வழி மண் மேம்பாட்டு பரிந்துரைகள்",
      aiReport: "ஹார்வெஸ்ட்பல்ஸ் AI மண் தொழில்நுட்ப உரை",
    }
  }[language];

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/gemini/soil-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          n: Number(nValue),
          p: Number(pValue),
          k: Number(kValue),
          ph: Number(phValue)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        throw new Error("Soil Diagnostic module is currently sleeping. Retry.");
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
          <HelpCircle className="text-emerald-600" />
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form panel */}
        <form onSubmit={handleAnalyze} className="lg:col-span-4 p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
          <h2 className="font-display font-semibold text-lg text-emerald-900 dark:text-emerald-100 border-b border-emerald-500/10 pb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            {t.cardHeader}
          </h2>

          <div className="space-y-3.5 text-xs">
            {/* Nitrogen */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.nLabel}</label>
              <input 
                type="number"
                min="0"
                max="500"
                value={nValue}
                onChange={(e) => setNValue(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100 font-semibold"
              />
            </div>

            {/* Phosphorus */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.pLabel}</label>
              <input 
                type="number"
                min="0"
                max="150"
                value={pValue}
                onChange={(e) => setPValue(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100 font-semibold"
              />
            </div>

            {/* Potassium */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.kLabel}</label>
              <input 
                type="number"
                min="0"
                max="500"
                value={kValue}
                onChange={(e) => setKValue(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100 font-semibold"
              />
            </div>

            {/* pH */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-600 dark:text-slate-400 block flex items-center justify-between">
                <span>{t.phLabel}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Acidic &lt; 7.0 | Alkaline &gt; 7.0</span>
              </label>
              <input 
                type="number"
                min="1"
                max="14"
                step="0.1"
                value={phValue}
                onChange={(e) => setPhValue(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100 font-semibold"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-semibold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>{t.loadingText}</span>
              </>
            ) : (
              <>
                <HelpCircle className="w-4 h-4" />
                <span>{t.buttonText}</span>
              </>
            )}
          </button>
        </form>

        {/* Results / Analyzer Report panel */}
        <div className="lg:col-span-8 space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-emerald-500/20 text-center">
              <Loader className="w-12 h-12 text-emerald-600 animate-spin mb-3" />
              <h3 className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">{t.loadingText}</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Compiling NPK proportions, predicting zinc and iron indices, and drafting soil structure corrections...
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

          {!loading && !error && !report && (
            <div className="flex flex-col items-center justify-center py-16 p-6 bg-slate-50/30 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <Info className="w-12 h-12 text-slate-400/30 mb-2.5" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Awaiting Lab Parameters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Enter your nitrogen, phosphate, potassium values, and pH measurements. Our platform will provide customized soil remediation and chemical fertilizer balancing.
              </p>
            </div>
          )}

          {/* Render report details */}
          {report && (
            <div className="p-6 rounded-2xl glass-card border border-emerald-500/15 shadow-xl space-y-5">
              
              {/* Header metrics */}
              <div className="border-b border-emerald-500/10 pb-3">
                <h3 className="text-lg font-display font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {t.npkChart}
                </h3>
              </div>

              {/* NPK levels display indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider block">NITROGEN (N)</span>
                  <span className="text-lg font-extrabold text-indigo-600 block mt-1">{report.npk.n} <span className="text-xs text-slate-500 font-normal">kg/a</span></span>
                  <span className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${report.npk.n < 130 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {report.npk.n < 130 ? 'Low' : 'Adequate'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider block">PHOSPHORUS (P)</span>
                  <span className="text-lg font-extrabold text-indigo-600 block mt-1">{report.npk.p} <span className="text-xs text-slate-500 font-normal">kg/a</span></span>
                  <span className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${report.npk.p < 22 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {report.npk.p < 22 ? 'Low' : 'Adequate'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider block">POTASSIUM (K)</span>
                  <span className="text-lg font-extrabold text-indigo-600 block mt-1">{report.npk.k} <span className="text-xs text-slate-500 font-normal">kg/a</span></span>
                  <span className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${report.npk.k < 125 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {report.npk.k < 125 ? 'Low' : 'Adequate'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider block">SOIL pH</span>
                  <span className="text-lg font-extrabold text-indigo-600 block mt-1">{report.ph}</span>
                  <span className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${report.ph < 6.0 ? 'bg-amber-100 text-amber-800' : report.ph > 7.5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {report.ph < 6.0 ? 'Acidic' : report.ph > 7.5 ? 'Alkaline' : 'Neutral (Ideal)'}
                  </span>
                </div>
              </div>

              {/* AI report summary narrative */}
              <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-500/10 rounded-xl text-xs space-y-1">
                <span className="font-extrabold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  {t.aiReport}
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                  {report.aiSoilReport}
                </p>
              </div>

              {/* Chemical + Organic recommendations split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <span className="font-extrabold text-emerald-950 dark:text-emerald-100 block mb-1.5">{t.recs}</span>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-400 font-medium">
                    {report.recommendations.map((rec, idx) => (
                      <li key={idx} className="leading-relaxed">{rec}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-extrabold text-emerald-950 dark:text-emerald-100 block mb-1.5">{t.organic}</span>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-400 font-medium">
                    {report.organicSuggestions.map((org, idx) => (
                      <li key={idx} className="leading-relaxed">{org}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Micronutrients block */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5">{t.micronutrients}</span>
                <div className="flex gap-2 flex-wrap">
                  {report.micronutrients.map((micro, idx) => (
                    <span key={idx} className="bg-amber-100/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                      {micro}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
