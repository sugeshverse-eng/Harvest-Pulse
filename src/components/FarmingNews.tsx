import { useState } from "react";
import { Newspaper, Calendar, ArrowUpRight, HelpCircle, Bookmark, Star } from "lucide-react";

interface FarmingNewsProps {
  language: 'English' | 'Tamil';
}

export default function FarmingNews({ language }: FarmingNewsProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const t = {
    English: {
      title: "AgriTech News & TNAU Advisories",
      subtitle: "Daily updates from Tamil Nadu Agricultural University (TNAU), weather bulletins, state procurement price changes, and organic discoveries.",
      catAll: "All News",
      catTNAU: "TNAU Advisories",
      catPolicy: "Subsidies & Policy",
      catTech: "Smart Tech Insights",
      readMore: "View Publication",
    },
    Tamil: {
      title: "வேளாண் செய்திகள் & பல்கலைக்கழக ஆலோசனைகள்",
      subtitle: "தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழக (TNAU) அறிவுறுத்தல்கள், அரசு கொள்முதல் விலை மாற்றங்கள் மற்றும் விவசாய தொழில்நுட்பப் புதிய கண்டுபிடிப்புகள்.",
      catAll: "அனைத்து செய்திகள்",
      catTNAU: "பல்கலைக்கழக ஆலோசனைகள்",
      catPolicy: "சலுகைகள் & கொள்கைகள்",
      catTech: "புதிய தொழில்நுட்பங்கள்",
      readMore: "மேலும் படிக்க",
    }
  }[language];

  // Realistic agri news feeds
  const newsFeed = [
    {
      id: "news1",
      category: "TNAU Advisories",
      title: "TNAU Releases High-Yield Samba Paddy Seed Varieties for Delta Irrigation",
      titleTa: "டெல்டா சாகுபடிக்கு ஏற்ற புதிய சன்ன ரக நெல் விதைகளை வெளியிட்டது TNAU",
      summary: "Tamil Nadu Agricultural University (TNAU) Coimbatore has announced the distribution of 'CO 55' and 'CO 56' Paddy seeds, showing high resistance to blast disease and brown planthopper (BPH). Ideal for the upcoming Samba cycle in Tanjore, Trichy, and Nagapattinam.",
      summaryTa: "பூச்சி மற்றும் நோய் எதிர்ப்புத் திறன் கொண்ட 'CO 55' மற்றும் 'CO 56' புதிய நெல் ரகங்களை அறிமுகப்படுத்தியுள்ளது கோவை வேளாண் பல்கலைக்கழகம். இது டெல்டா மாவட்ட Samba பருவத்திற்கு மிகவும் உகந்தது.",
      date: "July 12, 2026",
      source: "TNAU Extension Division",
      link: "https://tnau.ac.in/"
    },
    {
      id: "news2",
      category: "Subsidies & Policy",
      title: "Minimum Support Price (MSP) for Paddy Increased for 2026-2027 Season",
      titleTa: "நெல் கொள்முதல் விலை (MSP) புதிய உயர்வு அறிவிப்பு - 2026",
      summary: "The Ministry of Agriculture has officially hiked the MSP of Paddy (Common Grade) to ₹2,300 per quintal, representing a substantial support padding against diesel price fuel increases. Direct purchase stations (DPCs) in Tamil Nadu will open from October 1.",
      summaryTa: "நடப்பு சாகுபடி பருவத்திற்கு நெல் கொள்முதல் விலையை ஒரு குவிண்டாலுக்கு ரூ.2,300 ஆக உயர்த்தியுள்ளது மத்திய அரசு. தமிழகத்தில் நேரடி நெல் கொள்முதல் நிலையங்கள் அக்டோபர் 1 முதல் செயல்படும்.",
      date: "July 10, 2026",
      source: "Ministry of Agriculture & Farmers Welfare",
      link: "https://agricoop.nic.in/"
    },
    {
      id: "news3",
      category: "Smart Tech Insights",
      title: "Drone-assisted Nano Urea Spraying Demonstrations Conducted in Salem Orchards",
      titleTa: "சேலத்தில் ட்ரோன் மூலம் திரவ யூரியா தெளிக்கும் செயல்முறை விளக்கம்",
      summary: "District collectors inaugurated automated drone clusters capable of spraying 10 acres of mango orchards in under 3 hours, reducing water utility by 90% and fertilizer wastage by 40%. Subsidies for individual custom hiring are available on Uzhavan App.",
      summaryTa: "சேலம் மாந்தோப்புகளில் ட்ரோன் மூலம் திரவ யூரியா தெளிக்கும் புதிய செயல்முறை விளக்கம். 10 ஏக்கர் பரப்பளவில் வெறும் 3 மணி நேரத்தில் உரமிட்டு முடிக்கலாம். இதற்கு உழவன் செயலி மூலம் 50% மானியம் பெறலாம்.",
      date: "July 08, 2026",
      source: "Krishi Vigyan Kendra (KVK)",
      link: "https://www.icar.org.in/"
    }
  ];

  const filteredNews = activeCategory === "All" 
    ? newsFeed 
    : newsFeed.filter(n => n.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
          <Newspaper className="text-emerald-600" />
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.subtitle}
        </p>
      </div>

      {/* Categories select row */}
      <div className="flex gap-1.5 flex-wrap text-xs font-semibold">
        <button 
          onClick={() => setActiveCategory("All")}
          className={`px-3.5 py-1.5 rounded-xl border transition ${
            activeCategory === "All" 
              ? "bg-emerald-600 text-white border-emerald-600" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-800 hover:border-emerald-500/20"
          }`}
        >
          {t.catAll}
        </button>
        <button 
          onClick={() => setActiveCategory("TNAU Advisories")}
          className={`px-3.5 py-1.5 rounded-xl border transition ${
            activeCategory === "TNAU Advisories" 
              ? "bg-emerald-600 text-white border-emerald-600" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-800 hover:border-emerald-500/20"
          }`}
        >
          {t.catTNAU}
        </button>
        <button 
          onClick={() => setActiveCategory("Subsidies & Policy")}
          className={`px-3.5 py-1.5 rounded-xl border transition ${
            activeCategory === "Subsidies & Policy" 
              ? "bg-emerald-600 text-white border-emerald-600" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-800 hover:border-emerald-500/20"
          }`}
        >
          {t.catPolicy}
        </button>
        <button 
          onClick={() => setActiveCategory("Smart Tech Insights")}
          className={`px-3.5 py-1.5 rounded-xl border transition ${
            activeCategory === "Smart Tech Insights" 
              ? "bg-emerald-600 text-white border-emerald-600" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-800 hover:border-emerald-500/20"
          }`}
        >
          {t.catTech}
        </button>
      </div>

      {/* News listings columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <div key={news.id} className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-lg flex flex-col justify-between hover:border-emerald-500/20 transition duration-300">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px]">
                <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                  {news.category}
                </span>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {news.date}
                </span>
              </div>

              <h3 className="text-sm font-display font-extrabold text-slate-800 dark:text-slate-100 leading-snug">
                {language === "English" ? news.title : news.titleTa}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {language === "English" ? news.summary : news.summaryTa}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-semibold">
              <span className="text-slate-400">By <strong>{news.source}</strong></span>
              <a 
                href={news.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                {t.readMore}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
