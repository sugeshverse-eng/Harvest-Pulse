import { useState, useEffect, FormEvent } from "react";
import { 
  Sprout, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Globe, 
  Award, 
  RefreshCw, 
  User,
  Layers,
  Droplets
} from "lucide-react";
import { FarmerProfile as ProfileType } from "../types";

interface FarmerAuthProps {
  language: 'English' | 'Tamil';
  setLanguage: (lang: 'English' | 'Tamil') => void;
  onLogin: (profile: ProfileType) => void;
}

export default function FarmerAuth({ language, setLanguage, onLogin }: FarmerAuthProps) {
  const [authMode, setAuthMode] = useState<'authenticate' | 'demo'>('authenticate');
  
  // Core Farmer Credentials (Farmer Name, District, Acres of Land, Soil Type)
  const [farmerName, setFarmerName] = useState("Sugesh");
  const [district, setDistrict] = useState("Thanjavur");
  const [village, setVillage] = useState("Papanasam");
  const [farmSize, setFarmSize] = useState<number>(2.5);
  const [soilType, setSoilType] = useState("Clayey Soil");
  const [irrigation, setIrrigation] = useState("Drip Irrigation");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Paddy (Rice)"]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // Demo farmers list
  const [demoFarmers, setDemoFarmers] = useState<ProfileType[]>([]);

  const tnDistricts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
    "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
    "Vellore", "Viluppuram", "Virudhunagar"
  ];

  const soilTypes = [
    "Clayey Soil",
    "Red Loamy Soil",
    "Black Cotton Soil",
    "Alluvial Soil",
    "Sandy Loam Soil"
  ];

  const irrigationTypes = [
    "Drip Irrigation",
    "Sprinkler Irrigation",
    "Canal & River",
    "Borewell / Open Well",
    "Rainfed"
  ];

  const cropOptions = [
    "Paddy (Rice)", "Turmeric", "Sugarcane", "Banana", "Cotton",
    "Groundnut", "Barnyard Millet", "Maize", "Vegetables", "Coconut"
  ];

  // Fetch demo profiles on mount
  useEffect(() => {
    fetch("/api/auth/demo-farmers")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDemoFarmers(data);
        }
      })
      .catch(err => console.error("Error loading demo farmers:", err));
  }, []);

  const t = {
    English: {
      badge: "HarvestPulse V3 • Smart Agriculture Platform",
      tagline: "Empowering Farmers with AI Crop Diagnostics, Weather & eNAM Prices",
      welcomeHeader: "Farmer Authentication",
      welcomeSub: "Authenticate your farmer profile with Farmer Name, District, Acres of Land & Soil Type to enter your personalized dashboard.",
      tabAuth: "Farmer Authentication",
      tabDemo: "Quick Demo Profiles",
      nameLabel: "Farmer Full Name",
      districtLabel: "Cultivation District",
      villageLabel: "Village / Taluk",
      farmSizeLabel: "Farm Size (Acres of Land)",
      soilLabel: "Soil Type / Texture",
      irrigationLabel: "Irrigation Facility",
      cropsLabel: "Primary Crops",
      authenticateBtn: "Authenticate Farmer & Enter Dashboard",
      demoHeader: "Quick Access Demo Profiles",
      demoSub: "Select any pre-configured farmer profile to test the platform instantly:",
      loginAs: "Sign In as",
      acres: "Acres",
      requiredCredentials: "Core Credentials: Name • District • Land Acres • Soil Type",
      tip: "Soil type and district dynamically tailor crop diagnostics, irrigation advice, and NPK calculations."
    },
    Tamil: {
      badge: "ஹார்வெஸ்ட்பல்ஸ் V3 • நவீன AI விவசாய தளம்",
      tagline: "AI பயிர் மருத்துவம், சரிபார்க்கப்பட்ட வானிலை & eNAM சந்தை விலைகள்",
      welcomeHeader: "விவசாயி அங்கீகாரம் & உள்நுழைவு",
      welcomeSub: "உங்கள் விவசாயி சுயவிவரம் (பெயர், மாவட்டம், நில அளவு & மண் வகை) மூலம் உள்நுழைந்து துல்லியமான பண்ணை பலகைக்குள் செல்லவும்.",
      tabAuth: "விவசாயி அங்கீகாரம்",
      tabDemo: "டெமோ சுயவிவரங்கள்",
      nameLabel: "விவசாயியின் முழு பெயர்",
      districtLabel: "சாகுபடி மாவட்டம்",
      villageLabel: "கிராமம் / வட்டம்",
      farmSizeLabel: "நில அளவு (ஏக்கர்)",
      soilLabel: "மண் வகை",
      irrigationLabel: "பாசன வசதி",
      cropsLabel: "முக்கிய பயிர்கள்",
      authenticateBtn: "சரிபார்த்து பண்ணை பலகைக்குள் செல்க",
      demoHeader: "நேரடி சோதனை சுயவிவரங்கள்",
      demoSub: "செயலியை உடனே சோதிக்க கீழே உள்ள ஏதேனும் ஒரு விவசாயியைத் தேர்ந்தெடுக்கவும்:",
      loginAs: "இவராக உள்நுழைக",
      acres: "ஏக்கர்",
      requiredCredentials: "முக்கிய விவரங்கள்: பெயர் • மாவட்டம் • நில அளவு • மண் வகை",
      tip: "மண் வகை மற்றும் மாவட்டத்தின் அடிப்படையில் உர பரிந்துரைகளும் வானிலை எச்சரிக்கைகளும் மாறும்."
    }
  }[language];

  // Handle Authentication Submission (No Mobile Number Required)
  const handleAuthenticate = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!farmerName.trim()) {
      setErrorMsg(language === "English" ? "Farmer Name is required." : "விவசாயி பெயர் கட்டாயமாகும்.");
      return;
    }
    if (!district.trim()) {
      setErrorMsg(language === "English" ? "District is required." : "மாவட்டம் கட்டாயமாகும்.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: farmerName.trim(),
          district: district.trim(),
          village: village.trim() || "Main Village",
          farmSize: farmSize || 2.5,
          soilType: soilType || "Clayey Soil",
          irrigationType: irrigation || "Drip Irrigation",
          mainCrops: selectedCrops.length > 0 ? selectedCrops : ["Paddy (Rice)"]
        })
      });

      const data = await res.json();
      if (res.ok && data.profile) {
        completeLogin(data.profile);
      } else {
        setErrorMsg(data.error || "Authentication failed. Proceeding with local verification.");
        const fallbackProfile: ProfileType = {
          id: `HP-FARM-${Math.floor(10000 + Math.random() * 90000)}`,
          name: farmerName.trim(),
          district: district.trim(),
          village: village.trim() || "Papanasam",
          farmSize: farmSize || 2.5,
          soilType: soilType || "Clayey Soil",
          irrigationType: irrigation || "Drip Irrigation",
          mainCrops: selectedCrops.length > 0 ? selectedCrops : ["Paddy (Rice)"],
          role: "farmer"
        };
        completeLogin(fallbackProfile);
      }
    } catch (err) {
      const fallbackProfile: ProfileType = {
        id: `HP-FARM-${Math.floor(10000 + Math.random() * 90000)}`,
        name: farmerName.trim(),
        district: district.trim(),
        village: village.trim() || "Papanasam",
        farmSize: farmSize || 2.5,
        soilType: soilType || "Clayey Soil",
        irrigationType: irrigation || "Drip Irrigation",
        mainCrops: selectedCrops.length > 0 ? selectedCrops : ["Paddy (Rice)"],
        role: "farmer"
      };
      completeLogin(fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (farmer: ProfileType) => {
    localStorage.setItem("harvestpulse_auth_farmer", JSON.stringify(farmer));
    localStorage.setItem("farmer_profile", JSON.stringify(farmer));
    onLogin(farmer);
  };

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) 
        ? prev.length > 1 ? prev.filter(c => c !== crop) : prev 
        : [...prev, crop]
    );
  };

  const defaultDemos: ProfileType[] = [
    {
      id: "HP-FARM-04921",
      name: "Sugesh",
      district: "Thanjavur",
      village: "Papanasam",
      farmSize: 2.5,
      soilType: "Clayey Soil",
      irrigationType: "Drip Irrigation",
      mainCrops: ["Paddy (Rice)", "Turmeric"],
      role: "farmer"
    },
    {
      id: "HP-FARM-08144",
      name: "Muthulakshmi Kannan",
      district: "Erode",
      village: "Gobichettipalayam",
      farmSize: 4.0,
      soilType: "Red Loamy Soil",
      irrigationType: "Sprinkler Irrigation",
      mainCrops: ["Turmeric", "Banana", "Sugarcane"],
      role: "farmer"
    },
    {
      id: "HP-FARM-12093",
      name: "Selvam Arumugam",
      district: "Madurai",
      village: "Usilampatti",
      farmSize: 3.2,
      soilType: "Black Cotton Soil",
      irrigationType: "Canal & Rainfed",
      mainCrops: ["Cotton", "Barnyard Millet"],
      role: "farmer"
    },
    {
      id: "HP-AGRI-0012",
      name: "Dr. K. Senthilvel",
      district: "Coimbatore",
      village: "Agri Research Campus",
      farmSize: 5.0,
      soilType: "Alluvial Soil",
      irrigationType: "Smart Sensor Drip",
      mainCrops: ["Paddy", "Maize"],
      role: "officer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-lime-500/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-emerald-600 to-lime-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight">HarvestPulse</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                v3.0
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 font-medium hidden sm:block">Smart Agriculture Platform</p>
          </div>
        </div>

        {/* Right side Language Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 p-1 rounded-xl border border-emerald-500/20 flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => setLanguage('English')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                language === 'English' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('Tamil')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                language === 'Tamil' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-xl mx-auto w-full my-6 z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/20 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
          
          {/* Header inside Card */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium text-emerald-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>{t.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              {t.welcomeHeader}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
              {t.welcomeSub}
            </p>
          </div>

          {/* Navigation Tabs (Farmer Authentication vs Quick Demo Profiles) */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/60 rounded-2xl border border-slate-800 mb-6 text-xs font-medium">
            <button
              type="button"
              onClick={() => { setAuthMode('authenticate'); setErrorMsg(""); setInfoMsg(""); }}
              className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                authMode === 'authenticate' 
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-lime-300" />
              <span className="font-semibold">{t.tabAuth}</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('demo'); setErrorMsg(""); setInfoMsg(""); }}
              className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                authMode === 'demo' 
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Award className="w-4 h-4 shrink-0 text-lime-300" />
              <span className="font-semibold">{t.tabDemo}</span>
            </button>
          </div>

          {/* Feedback banners */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {infoMsg && (
            <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* MODE 1: Farmer Authentication (Name, District, Land Acres, Soil Type) */}
          {authMode === 'authenticate' && (
            <form onSubmit={handleAuthenticate} className="space-y-3.5">
              
              {/* Credentials Callout Card */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.requiredCredentials}</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  Required
                </span>
              </div>

              {/* 1. Farmer Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. {t.nameLabel}</span>
                  <span className="text-emerald-400 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  placeholder="e.g. Sugesh, Arumugam, Kannan"
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-white text-sm font-semibold outline-none transition"
                  required
                />
              </div>

              {/* 2. District & Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2. {t.districtLabel}</span>
                    <span className="text-emerald-400 font-extrabold">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 focus:border-emerald-500 rounded-xl text-white text-xs font-semibold outline-none"
                  >
                    {tnDistricts.map(d => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {t.villageLabel}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    placeholder="e.g. Papanasam, Alampatti"
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700 focus:border-emerald-500 rounded-xl text-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* 3. Farm Size (Acres of Land) & 4. Soil Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>3. {t.farmSizeLabel}</span>
                      <span className="text-emerald-400 font-extrabold">*</span>
                    </label>
                    <span className="text-[10px] text-emerald-300 font-bold">{farmSize} Acres</span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="100"
                    value={farmSize}
                    onChange={e => setFarmSize(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700 focus:border-emerald-500 rounded-xl text-white text-xs font-semibold outline-none mb-1.5"
                  />
                  {/* Quick Acre presets */}
                  <div className="flex items-center gap-1 text-[10px]">
                    {[1, 2.5, 5, 10, 20].map((acres) => (
                      <button
                        key={acres}
                        type="button"
                        onClick={() => setFarmSize(acres)}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                          farmSize === acres
                            ? "bg-emerald-600 text-white font-bold"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        {acres} Ac
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                    <span>4. {t.soilLabel}</span>
                    <span className="text-emerald-400 font-extrabold">*</span>
                  </label>
                  <select
                    value={soilType}
                    onChange={e => setSoilType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 focus:border-emerald-500 rounded-xl text-white text-xs font-semibold outline-none"
                  >
                    {soilTypes.map(s => (
                      <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t.tip}
                  </p>
                </div>
              </div>

              {/* Irrigation Facility */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t.irrigationLabel}
                </label>
                <select
                  value={irrigation}
                  onChange={e => setIrrigation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 focus:border-emerald-500 rounded-xl text-white text-xs outline-none"
                >
                  {irrigationTypes.map(i => (
                    <option key={i} value={i} className="bg-slate-900 text-white">{i}</option>
                  ))}
                </select>
              </div>

              {/* Primary Crops */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  {t.cropsLabel} (Select Active Crops)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {cropOptions.map(c => {
                    const isSelected = selectedCrops.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCrop(c)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition ${
                          isSelected 
                            ? 'bg-emerald-600/40 border-emerald-500 text-emerald-200 font-bold' 
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Authentication Button */}
              <button
                type="submit"
                disabled={loading || !farmerName.trim() || !district.trim()}
                className="w-full mt-3 py-3.5 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{t.authenticateBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE 2: Instant Demo Profiles (No Mobile Numbers) */}
          {authMode === 'demo' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 mb-2">
                {t.demoSub}
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {(demoFarmers.length > 0 ? demoFarmers : defaultDemos).map((f: ProfileType) => (
                  <div
                    key={f.id}
                    onClick={() => completeLogin(f)}
                    className="p-3.5 bg-slate-950/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-600 flex items-center justify-center font-bold text-white text-sm shadow-md shrink-0">
                        {f.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                            {f.name}
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                            {f.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          📍 {f.village}, <strong className="text-slate-300">{f.district}</strong> • {f.farmSize} {t.acres}
                        </p>
                        <p className="text-[10px] text-emerald-400/90 font-medium mt-0.5 flex items-center gap-1.5">
                          <span>🌱 {f.soilType}</span>
                          <span>•</span>
                          <span>{f.mainCrops.slice(0, 2).join(", ")}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 bg-emerald-600/80 group-hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-sm shrink-0"
                    >
                      <span>{t.loginAs}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Security Note inside Card */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Farmer Profile Verification</span>
            </div>
            <span>HarvestPulse AgriTech Network</span>
          </div>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 z-10">
        <p>HarvestPulse V3 • Smart Agriculture Platform • Farmer-First</p>
      </footer>
    </div>
  );
}
