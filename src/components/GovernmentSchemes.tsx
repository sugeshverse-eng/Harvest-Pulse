import { useState } from "react";
import { Search, Filter, Bookmark, Calendar, FileText, ArrowUpRight, HelpCircle } from "lucide-react";
import { Scheme } from "../types";

interface GovernmentSchemesProps {
  language: 'English' | 'Tamil';
}

export default function GovernmentSchemes({ language }: GovernmentSchemesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("schemes_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleBookmark = (id: string) => {
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter(bid => bid !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    localStorage.setItem("schemes_bookmarks", JSON.stringify(updated));
  };

  const t = {
    English: {
      title: "Government Schemes & Subsidies",
      subtitle: "Filter and search active Central & Tamil Nadu State agrarian welfare programs, insurance benefits, and mechanical hire subsidies.",
      searchPlaceholder: "Search schemes, documents, or departments...",
      filterAll: "All Schemes",
      filterCentral: "Central Govt",
      filterState: "Tamil Nadu Govt",
      filterBookmarks: "Bookmarked Only",
      eligibility: "Eligibility Criteria",
      docs: "Required Documents",
      deadline: "Application Deadline",
      applyLink: "Direct Apply Online",
    },
    Tamil: {
      title: "அரசு திட்டங்கள் & மானியங்கள்",
      subtitle: "மத்திய மற்றும் தமிழ்நாடு மாநில அரசு விவசாய நலத்திட்டங்கள், பயிர் காப்பீடுகள் மற்றும் மானியங்களைத் தேடிப் பயன்பெறுக.",
      searchPlaceholder: "திட்டங்கள், ஆவணங்கள் அல்லது துறைகளைத் தேடுக...",
      filterAll: "அனைத்து திட்டங்கள்",
      filterCentral: "மத்திய அரசு",
      filterState: "தமிழக அரசு",
      filterBookmarks: "சேமிக்கப்பட்டவை",
      eligibility: "தகுதி வரம்புகள்",
      docs: "தேவையான ஆவணங்கள்",
      deadline: "விண்ணப்பிக்க கடைசி தேதி",
      applyLink: "இணையத்தில் விண்ணப்பிக்க",
    }
  }[language];

  // Highly realistic central and Tamil Nadu state government schemes
  const schemesData: Scheme[] = [
    {
      id: "scheme1",
      title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      titleTa: "பிரதம மந்திரி கிசான் சம்மான் நிதி (PM-KISAN)",
      type: "Central",
      description: "Income support program of Rs. 6,000 per year in three equal installments to all landholding farmer families across India.",
      descriptionTa: "அனைத்து நிலம் வைத்திருக்கும் விவசாய குடும்பங்களுக்கும் ஆண்டுக்கு ரூ.6,000 மூன்று தவணைகளாக வழங்கப்படும் மத்திய அரசின் வருமான ஆதரவுத் திட்டம்.",
      eligibility: [
        "Small and marginal landholder farmer families.",
        "Landholding should be registered under the farmer's name.",
        "Institutional landholders and income tax payers are excluded."
      ],
      eligibilityTa: [
        "சிறு மற்றும் குறு விவசாய குடும்பங்கள்.",
        "விவசாயி பெயரில் பட்டா/சிட்டா நிலப்பதிவுகள் இருக்க வேண்டும்.",
        "வருமான வரி செலுத்துவோர் மற்றும் அரசு ஊழியர்களுக்கு விலக்கு."
      ],
      requiredDocuments: ["Aadhaar Card", "Land Ownership Deed (Patta/Chitta)", "Bank Account Passbook (Linked with Aadhaar)", "Mobile number"],
      requiredDocumentsTa: ["ஆதார் அட்டை", "நில உரிமை சான்றிதழ் (பட்டா/சிட்டா நகல்)", "ஆதாருடன் இணைக்கப்பட்ட வங்கி கணக்கு புத்தகம்", "கைபேசி எண்"],
      applicationLink: "https://pmkisan.gov.in/",
      deadline: "Ongoing (தொடர்கிறது)"
    },
    {
      id: "scheme2",
      title: "Tamil Nadu Free Agricultural Power Supply Scheme",
      titleTa: "தமிழ்நாடு இலவச விவசாய மின்சாரத் திட்டம்",
      type: "Tamil Nadu State",
      description: "Provides 24/7 free electricity connection for agricultural irrigation pumpsets across Tamil Nadu.",
      descriptionTa: "தமிழகம் முழுவதும் உள்ள விவசாய மின் மோட்டார் பம்ப்செட்டுகளுக்கு 24 மணி நேரமும் இலவச மின்சாரம் வழங்கும் திட்டம்.",
      eligibility: [
        "Registered farmers of Tamil Nadu who own cultivable land.",
        "Must have a valid irrigation well or borewell.",
        "Requires certification from local administrative officers."
      ],
      eligibilityTa: [
        "விவசாய நிலம் வைத்துள்ள பதிவு பெற்ற தமிழக விவசாயிகள்.",
        "முறையான கிணறு அல்லது ஆழ்துளை கிணறு வசதி இருக்க வேண்டும்.",
        "வட்டார கிராம நிர்வாக அலுவலர் (VAO) சான்றிதழ் தேவை."
      ],
      requiredDocuments: ["Patta, Chitta, Adangal copy", "VAO Well/Pump Certificate", "Aadhaar Card", "TANGEDCO application slip"],
      requiredDocumentsTa: ["பட்டா, சிட்டா, அடங்கல் நகல்", "கிணறு மற்றும் பம்ப் சான்றிதழ் (VAO)", "ஆதார் அட்டை", "மின்வாரிய விண்ணப்ப நகல்"],
      applicationLink: "https://www.tangedco.org/",
      deadline: "Batch-wise waiting list allocation"
    },
    {
      id: "scheme3",
      title: "PM Fasal Bima Yojana (Crop Insurance)",
      titleTa: "பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம் (PMFBY)",
      type: "Central",
      description: "Low-premium insurance cover for farmers against crop yield losses caused by droughts, floods, extreme winds, or pest infestations.",
      descriptionTa: "வறட்சி, வெள்ளம், புயல் அல்லது பூச்சித் தாக்குதலால் ஏற்படும் பயிர் இழப்புகளுக்கு குறைந்த பிரீமியத்தில் காப்பீடு வழங்கும் திட்டம்.",
      eligibility: [
        "All farmers cultivating notified crops in notified areas.",
        "Sharecroppers and tenant farmers are also eligible."
      ],
      eligibilityTa: [
        "அறிவிக்கப்பட்ட பகுதிகளில் அறிவிக்கப்பட்ட பயிர்களை பயிரிடும் அனைத்து விவசாயிகள்.",
        "குத்தகை மற்றும் கூட்டு விவசாயிகளும் இத்திட்டத்திற்கு தகுதியானவர்கள்."
      ],
      requiredDocuments: ["Sowing Certificate (VAO Adangal)", "Land documents (Patta/Chitta)", "Bank account copy", "Aadhaar Card"],
      requiredDocumentsTa: ["பயிர் சாகுபடி சான்றிதழ் (அடங்கல்)", "நில ஆவணங்கள் (பட்டா/சிட்டா)", "வங்கி கணக்கு புத்தக நகல்", "ஆதார் அட்டை"],
      applicationLink: "https://pmfby.gov.in/",
      deadline: "August 15, 2026 (Kharif batch)"
    },
    {
      id: "scheme4",
      title: "Tamil Nadu Kuruvai Paddy Special Package Scheme",
      titleTa: "தமிழக குறுவை சாகுபடி சிறப்பு தொகுப்பு திட்டம்",
      type: "Tamil Nadu State",
      description: "Subsidies on Paddy seeds, micronutrient fertilizers, and tractor hiring fees specifically for delta district farmers.",
      descriptionTa: "காவிரி டெல்டா மாவட்ட விவசாயிகளுக்காக நெல் விதைகள், நுண்ணூட்ட உரங்கள் மற்றும் டிராக்டர் வாடகைக்கு வழங்கப்படும் சிறப்பு மானிய திட்டம்.",
      eligibility: [
        "Cultivating farmers in Thanjavur, Trichy, Tiruvarur, Nagapattinam, Cuddalore, and Pudukkottai districts.",
        "Cultivating Paddy during the Kuruvai season."
      ],
      eligibilityTa: [
        "தஞ்சாவூர், திருச்சி, திருவாரூர், நாகை, கடலூர் மற்றும் புதுக்கோட்டை டெல்டா மாவட்ட விவசாயிகள்.",
        "குறுவை பருவத்தில் நெல் சாகுபடி செய்யும் விவசாயி."
      ],
      requiredDocuments: ["Uzhavan App registration profile", "Adangal verification from VAO", "Bank details", "Aadhaar"],
      requiredDocumentsTa: ["உழவன் செயலி பதிவு விவரங்கள்", "கிராம நிர்வாக அலுவலரின் அடங்கல் நகல்", "வங்கி விவரங்கள்", "ஆதார் அட்டை"],
      applicationLink: "https://www.tnagrisnet.tn.gov.in/",
      deadline: "August 30, 2026"
    }
  ];

  // Filtering + Searching logic
  const filteredSchemes = schemesData.filter(scheme => {
    const titleText = language === "English" ? scheme.title : (scheme.titleTa || scheme.title);
    const descText = language === "English" ? scheme.description : (scheme.descriptionTa || scheme.description);
    
    const matchesSearch = titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          descText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "All" ||
                        (filterType === "Central" && scheme.type === "Central") ||
                        (filterType === "State" && scheme.type === "Tamil Nadu State") ||
                        (filterType === "Bookmarks" && bookmarkedIds.includes(scheme.id));

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
          <Bookmark className="text-emerald-600" />
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.subtitle}
        </p>
      </div>

      {/* Filter tabs + Search bar row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 flex-wrap text-xs font-semibold">
          <button 
            onClick={() => setFilterType("All")}
            className={`px-3 py-1.5 rounded-xl border transition ${
              filterType === "All" 
                ? "bg-emerald-600 text-white border-emerald-600" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-800 hover:border-emerald-500/20"
            }`}
          >
            {t.filterAll}
          </button>
          <button 
            onClick={() => setFilterType("Central")}
            className={`px-3 py-1.5 rounded-xl border transition ${
              filterType === "Central" 
                ? "bg-emerald-600 text-white border-emerald-600" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-800 hover:border-emerald-500/20"
            }`}
          >
            {t.filterCentral}
          </button>
          <button 
            onClick={() => setFilterType("State")}
            className={`px-3 py-1.5 rounded-xl border transition ${
              filterType === "State" 
                ? "bg-emerald-600 text-white border-emerald-600" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-800 hover:border-emerald-500/20"
            }`}
          >
            {t.filterState}
          </button>
          <button 
            onClick={() => setFilterType("Bookmarks")}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1 ${
              filterType === "Bookmarks" 
                ? "bg-amber-500 text-white border-amber-500" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-800 hover:border-amber-500/20"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            {t.filterBookmarks} ({bookmarkedIds.length})
          </button>
        </div>

      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <div 
              key={scheme.id} 
              className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg flex flex-col justify-between hover:border-emerald-500/25 transition duration-300"
            >
              <div>
                {/* Header: tags and bookmark */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    scheme.type === "Central" 
                      ? "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300" 
                      : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                  }`}>
                    {scheme.type === "Central" ? "Central Govt" : "Tamil Nadu State Govt"}
                  </span>
                  
                  <button 
                    onClick={() => toggleBookmark(scheme.id)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(scheme.id) ? "fill-amber-400 text-amber-500" : "text-slate-400"}`} />
                  </button>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {language === "English" ? scheme.title : (scheme.titleTa || scheme.title)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-1.5">
                  {language === "English" ? scheme.description : (scheme.descriptionTa || scheme.description)}
                </p>

                {/* Eligibility criteria list */}
                <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {t.eligibility}
                  </span>
                  <ul className="text-xs space-y-1 mt-1.5 list-disc list-inside text-slate-600 dark:text-slate-400 font-medium">
                    {(language === "English" ? scheme.eligibility : (scheme.eligibilityTa || scheme.eligibility)).map((el, i) => (
                      <li key={i} className="leading-normal">{el}</li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    {t.docs}
                  </span>
                  <div className="flex gap-1.5 flex-wrap mt-1.5">
                    {(language === "English" ? scheme.requiredDocuments : (scheme.requiredDocumentsTa || scheme.requiredDocuments)).map((doc, i) => (
                      <span key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-500 font-medium">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Apply online button + Deadline */}
              <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.deadline}: <strong>{scheme.deadline}</strong></span>
                </div>

                <a 
                  href={scheme.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-100/60 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold flex items-center gap-1 self-stretch sm:self-auto text-center justify-center transition border border-emerald-500/10 cursor-pointer"
                >
                  {t.applyLink}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-16 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 font-medium">
            No governmental schemes found matching "{searchQuery}" under this category.
          </div>
        )}
      </div>
    </div>
  );
}
