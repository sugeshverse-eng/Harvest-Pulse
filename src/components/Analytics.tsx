import { useState } from "react";
import { TrendingUp, BarChart3, PieChart as PieIcon, DollarSign, Sprout, ArrowUpRight, Scale } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Cell,
  Pie,
  Legend
} from "recharts";

interface AnalyticsProps {
  language: 'English' | 'Tamil';
  userDistrict: string;
}

export default function Analytics({ language, userDistrict }: AnalyticsProps) {
  const t = {
    English: {
      title: "Harvest Analytics & Yield Projections",
      subtitle: "Evaluate seasonal expenditures, expected harvest yields, and estimated market sales ROI.",
      roiHeader: "Projected Seasonal Revenue",
      expHeader: "Operating Expense Breakdown",
      yieldHeader: "Historic Yield Comparison (Quintals / Acre)",
      cardRev: "Projected Sales Value",
      cardCost: "Cultivation Expenses",
      cardProfit: "Calculated Net ROI",
    },
    Tamil: {
      title: "விளைச்சல் மதிப்பீடு & லாப கணக்கீடு",
      subtitle: "விவசாய சாகுபடிச் செலவுகள், உத்தேச மகசூல் அளவீடுகள் மற்றும் லாப விகிதங்களை பகுப்பாய்வு செய்க.",
      roiHeader: "மதிப்பிடப்பட்ட பருவ வருவாய்",
      expHeader: "சாகுபடிச் செலவு விவரங்கள்",
      yieldHeader: "விளைச்சல் ஒப்பீடு (குவிண்டால் / ஏக்கர்)",
      cardRev: "உத்தேச விற்பனை மதிப்பு",
      cardCost: "சாகுபடிச் செலவுகள்",
      cardProfit: "நிகர லாபம் (ROI)",
    }
  }[language];

  // Dynamic charts data
  const yieldComparisonData = [
    { crop: "Paddy (Ponni)", avgYield: 24, userYield: 27 },
    { crop: "Turmeric", avgYield: 18, userYield: 19 },
    { crop: "Tomato", avgYield: 35, userYield: 41 },
    { crop: "Cotton", avgYield: 10, userYield: 12 },
  ];

  const expenseBreakdownData = [
    { name: "Seeds & Nursery", value: 3500, color: "#10B981" },
    { name: "Fertilizers & Organic Compost", value: 6800, color: "#3B82F6" },
    { name: "Irrigation Power/Diesel", value: 1500, color: "#F59E0B" },
    { name: "Labour & Harvesting", value: 9000, color: "#EF4444" },
    { name: "Pest Management", value: 3000, color: "#8B5CF6" }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
          <BarChart3 className="text-emerald-600" />
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.subtitle}
        </p>
      </div>

      {/* Row 1: KPI Stats card grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-800 dark:text-slate-200">
        {/* Sales projected */}
        <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 font-extrabold text-xl">
            ₹
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t.cardRev}</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">₹1,44,000</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Estimated based on current eNAM rates</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t.cardCost}</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">₹23,800</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Calculated for 1.5 acres of cultivation</span>
          </div>
        </div>

        {/* Profit net margin */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-100 font-bold block uppercase tracking-wider">{t.cardProfit}</span>
            <span className="text-2xl font-extrabold block mt-0.5">₹1,20,200</span>
            <span className="text-[9px] text-emerald-100 block mt-0.5 opacity-90">Expected net margin of 83.47%</span>
          </div>
        </div>
      </div>

      {/* Row 2: Yield comparison bar charts and expenses pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Comparison chart (Col 7) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
          <h3 className="font-display font-semibold text-sm text-emerald-900 dark:text-emerald-100 flex items-center gap-1.5">
            <Sprout className="w-5 h-5 text-emerald-600" />
            {t.yieldHeader}
          </h3>

          <div className="h-[250px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldComparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.08)" />
                <XAxis dataKey="crop" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} width={30} />
                <Tooltip contentStyle={{ fontSize: 11, background: '#111827', color: '#fff', borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="avgYield" name="District Average" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="userYield" name="My Yield Projection" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses pie chart (Col 5) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4 flex flex-col justify-between">
          <h3 className="font-display font-semibold text-sm text-emerald-900 dark:text-emerald-100 flex items-center gap-1.5">
            <Scale className="w-5 h-5 text-emerald-600" />
            {t.expHeader}
          </h3>

          <div className="h-[180px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {expenseBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ fontSize: 11, background: '#111827', color: '#fff', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            {expenseBreakdownData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: ₹{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
