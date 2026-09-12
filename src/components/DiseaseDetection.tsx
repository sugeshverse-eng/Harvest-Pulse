import { useState, useRef, ChangeEvent } from "react";
import { Camera, Upload, AlertCircle, RefreshCw, FileText, Download, ShieldAlert, CheckCircle2, MapPin } from "lucide-react";
import { DiseaseDetectionResult } from "../types";

interface DiseaseDetectionProps {
  language: 'English' | 'Tamil';
  latestReport?: DiseaseDetectionResult | null;
  onReportUpdate?: (report: DiseaseDetectionResult) => void;
}

// Crisp sample SVG leaf data URLs for instantaneous demo testing
const SAMPLE_LEAVES = [
  {
    nameEn: "Paddy Blast Disease",
    nameTa: "நெல் குலை நோய்",
    crop: "Paddy",
    type: "blast",
    dataUrl: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="100%" height="100%" fill="#1a2e1d"/>
        <path d="M 50 260 C 120 180, 220 120, 360 40 C 320 120, 200 220, 70 280 Z" fill="#6b9c3e"/>
        <!-- Spindle shaped diamond lesions with gray center and brown margin -->
        <ellipse cx="160" cy="180" rx="28" ry="10" transform="rotate(-35 160 180)" fill="#78350f"/>
        <ellipse cx="160" cy="180" rx="16" ry="5" transform="rotate(-35 160 180)" fill="#d6d3d1"/>
        <ellipse cx="230" cy="130" rx="34" ry="12" transform="rotate(-35 230 130)" fill="#78350f"/>
        <ellipse cx="230" cy="130" rx="20" ry="6" transform="rotate(-35 230 130)" fill="#cbd5e1"/>
        <ellipse cx="290" cy="85" rx="22" ry="8" transform="rotate(-35 290 85)" fill="#92400e"/>
        <ellipse cx="290" cy="85" rx="12" ry="4" transform="rotate(-35 290 85)" fill="#e2e8f0"/>
        <!-- Central midrib vein -->
        <path d="M 55 265 Q 200 160 355 45" stroke="#4d7c0f" stroke-width="3" fill="none"/>
        <text x="20" y="35" fill="#fef08a" font-family="sans-serif" font-size="14" font-weight="bold">SAMPLE LEAF: Oryza Sativa with Magnaporthe Oryzae (Blast)</text>
      </svg>
    `)
  },
  {
    nameEn: "Tomato Early Blight",
    nameTa: "தக்காளி இலை கருகல்",
    crop: "Tomato",
    type: "blight",
    dataUrl: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="100%" height="100%" fill="#18261e"/>
        <!-- Serrated tomato leaflet -->
        <path d="M 200 270 C 130 220, 70 170, 80 120 C 100 130, 130 90, 150 110 C 180 80, 210 110, 230 90 C 260 110, 310 130, 310 160 C 310 210, 260 250, 200 270 Z" fill="#4d7c0f"/>
        <!-- Target board concentric ring necrotic lesions -->
        <circle cx="160" cy="160" r="28" fill="#eab308" opacity="0.6"/>
        <circle cx="160" cy="160" r="22" fill="#713f12"/>
        <circle cx="160" cy="160" r="15" fill="#451a03"/>
        <circle cx="160" cy="160" r="7" fill="#1c1917"/>
        <circle cx="235" cy="195" r="24" fill="#ca8a04" opacity="0.6"/>
        <circle cx="235" cy="195" r="18" fill="#78350f"/>
        <circle cx="235" cy="195" r="10" fill="#292524"/>
        <!-- Yellow halo around leaf tips -->
        <path d="M 78 122 C 90 125, 95 145, 85 155 Z" fill="#eab308"/>
        <text x="20" y="35" fill="#fef08a" font-family="sans-serif" font-size="14" font-weight="bold">SAMPLE LEAF: Solanum Lycopersicum (Alternaria Blight)</text>
      </svg>
    `)
  },
  {
    nameEn: "Healthy Paddy Leaf",
    nameTa: "ஆரோக்கியமான நெல் இலை",
    crop: "Paddy",
    type: "healthy",
    dataUrl: "data:image/svg+xml;utf8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="100%" height="100%" fill="#064e3b"/>
        <!-- Lush vibrant healthy green blade -->
        <path d="M 50 260 C 120 180, 220 120, 360 40 C 320 120, 200 220, 70 280 Z" fill="#16a34a"/>
        <path d="M 55 265 Q 200 160 355 45" stroke="#86efac" stroke-width="2.5" fill="none"/>
        <path d="M 120 205 Q 160 170 190 145" stroke="#bbf7d0" stroke-width="1.2" stroke-dasharray="2,2" fill="none"/>
        <path d="M 190 145 Q 240 105 275 80" stroke="#bbf7d0" stroke-width="1.2" stroke-dasharray="2,2" fill="none"/>
        <text x="20" y="35" fill="#86efac" font-family="sans-serif" font-size="14" font-weight="bold">SAMPLE LEAF: Healthy Vibrant Photosynthetic Blade (Zero Defect)</text>
      </svg>
    `)
  }
];

export default function DiseaseDetection({ language, latestReport, onReportUpdate }: DiseaseDetectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState("Paddy");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DiseaseDetectionResult | null>(latestReport || (() => {
    try {
      const saved = localStorage.getItem("harvestpulse_latest_disease_report");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })());
  const [error, setError] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const t = {
    English: {
      title: "AI Plant Disease Detection",
      subtitle: "Snap or upload a photo of infected leaves or pests to get immediate symptoms, organic/chemical treatment, pesticide dosages, and cost metrics.",
      uploadBox: "Drag and drop leaf image or click to browse",
      useCamera: "Use Camera",
      capture: "Capture Photo",
      diagnose: "Diagnose Plant Disease",
      cropSelect: "Select Crop Category",
      confidence: "Confidence Score",
      severity: "Disease Severity",
      symptoms: "Observed Symptoms",
      causes: "Primary Causes / Pathogens",
      organic: "Organic Controls",
      chemical: "Chemical Treatment",
      pesticides: "Recommended Pesticides & Safe Dosage",
      safety: "Spraying Safety Measures",
      recovery: "Expected Recovery Time",
      cost: "Estimated Treatment Cost",
      agriOffice: "Closest Agriculture Office",
      downloadReport: "Download PDF Report",
      retake: "Upload Different Image",
    },
    Tamil: {
      title: "AI பயிர் நோய் கண்டறிதல்",
      subtitle: "பாதிக்கப்பட்ட பயிர் இலைகளின் புகைப்படம் அல்லது பூச்சிகளை பதிவேற்றி அறிகுறிகள், இயற்கை/வேதியியல் தீர்வுகள் மற்றும் மருந்துகளின் அளவை அறியலாம்.",
      uploadBox: "இலையின் படத்தை இழுத்துப் போடுக அல்லது கிளிக் செய்து தேர்வு செய்க",
      useCamera: "கேமராவைப் பயன்படுத்தவும்",
      capture: "படம் பிடிக்கவும்",
      diagnose: "நோய் கண்டறியவும்",
      cropSelect: "பயிரின் வகை",
      confidence: "துல்லியத் தன்மை",
      severity: "தாக்கத்தின் அளவு",
      symptoms: "கண்டறியப்பட்ட அறிகுறிகள்",
      causes: "முக்கிய காரணங்கள்",
      organic: "இயற்கை வழி தடுப்பு முறைகள்",
      chemical: "வேதியியல் தீர்வுகள்",
      pesticides: "பரிந்துரைக்கப்படும் மருந்துகள் மற்றும் அளவுகள்",
      safety: "மருந்து தெளிக்கும்போது பாதுகாப்பு நடவடிக்கைகள்",
      recovery: "பயிர் மீளும் காலம்",
      cost: "மதிப்பிடப்பட்ட தீர்வுச் செலவு",
      agriOffice: "அருகிலுள்ள வேளாண்மை அலுவலகம்",
      downloadReport: "பரிந்துரை அறிக்கையைப் பதிவிறக்குக",
      retake: "வேறு படம் பதிவேற்றுக",
    }
  }[language];

  // Starts the camera
  const startCamera = async () => {
    setCameraMode(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access failed", err);
      setError("Failed to access camera: " + err.message);
      setCameraMode(false);
    }
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setSelectedImage(dataUrl);
        stopCamera();
      }
    }
  };

  // Stops camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraMode(false);
  };

  // Handles manual image files
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submits the image for diagnosis
  const diagnoseDisease = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/gemini/detect-disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: "image/jpeg",
          crop
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.diseaseName) {
          const enriched: DiseaseDetectionResult = {
            ...data,
            crop,
            imageUrl: selectedImage,
            scannedAt: new Date().toISOString()
          };
          setReport(enriched);
          try {
            localStorage.setItem("harvestpulse_latest_disease_report", JSON.stringify(enriched));
          } catch (e) {
            console.error("Storage error:", e);
          }
          onReportUpdate?.(enriched);
        } else {
          throw new Error("Diagnosis failed. The image might not be clear.");
        }
      } else {
        throw new Error("Crop Pathology API is unavailable. Please retry.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during diagnosis");
    } finally {
      setLoading(false);
    }
  };

  const downloadReportPDF = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${report.diseaseName.replace(/\s+/g, "_")}_Diagnosis_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
          <Camera className="text-emerald-600" />
          {t.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload panel (Col 5) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
          
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-600 dark:text-slate-400 block">{t.cropSelect}</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-slate-100"
            >
              <option value="Paddy">Paddy (நெல்)</option>
              <option value="Tomato">Tomato (தக்காளி)</option>
              <option value="Turmeric">Turmeric (மஞ்சள்)</option>
              <option value="Cotton">Cotton (பருத்தி)</option>
              <option value="Groundnut">Groundnut (வேர்க்கடலை)</option>
              <option value="Banana">Banana (வாழை)</option>
              <option value="Coconut">Coconut (தென்னை)</option>
            </select>
          </div>

          {/* Camera View Mode */}
          {cameraMode ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800 flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" playInline muted />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                <button 
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  {t.capture}
                </button>
                <button 
                  onClick={stopCamera}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedImage ? (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800">
                <img src={selectedImage} alt="Plant Upload" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md text-xs cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {!report && !loading && (
                <button 
                  onClick={diagnoseDisease}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  {t.diagnose}
                </button>
              )}
            </div>
          ) : (
            // Drag Drop upload area
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/50 transition cursor-pointer flex flex-col items-center justify-center min-h-[180px] group"
            >
              <Upload className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 transition mb-3" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t.uploadBox}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG (Max 10MB)</p>
              
              <div className="flex gap-2 mt-4">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer border border-slate-200/50 dark:border-slate-800"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  {t.useCamera}
                </button>
              </div>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          {/* 1-Click Instant Sample Leaf Presets */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {language === "English" ? "Quick Sample Leaf Tests:" : "மாதிரி இலை சோதனைகள்:"}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">1-Click Test</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_LEAVES.map((sample) => (
                <button
                  key={sample.nameEn}
                  type="button"
                  onClick={() => {
                    setSelectedImage(sample.dataUrl);
                    setCrop(sample.crop);
                    setReport(null);
                    setError(null);
                  }}
                  className={`p-2 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                    selectedImage === sample.dataUrl
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-emerald-400 bg-white/50 dark:bg-slate-900/50"
                  }`}
                >
                  <span className="font-extrabold text-[11px] text-slate-800 dark:text-slate-200 leading-tight">
                    {language === "English" ? sample.nameEn : sample.nameTa}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {sample.crop} • {sample.type === "healthy" ? "Healthy" : "Infected"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results / Diagnostic Report panel (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          {report && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">
                  {language === "English"
                    ? "Live Synced: Dashboard Crop Health Score updated automatically based on this scan."
                    : "நேரலை இணைப்பு: இந்த பரிசோதனையின் அடிப்படையில் டாஷ்போர்டு பயிர் ஆரோக்கிய குறியீடு புதுப்பிக்கப்பட்டுள்ளது."}
                </span>
              </div>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-emerald-500/20">
              <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mb-3" />
              <h3 className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">Analyzing crop leaf pathology...</h3>
              <p className="text-xs text-slate-500 mt-1 text-center max-w-sm">
                Evaluating blast spores, mildew indices, and insect bite indicators to build treatment recommendations.
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
              <ShieldAlert className="w-12 h-12 text-slate-400/30 mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Pathology Diagnostics Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Provide an image above of infected crop parts. Our AI platform will verify structural indicators and recommend chemical & organic fixes.
              </p>
            </div>
          )}

          {report && (
            <div className="p-6 rounded-2xl glass-card border border-emerald-500/15 shadow-xl space-y-5">
              {/* Header block */}
              <div className="flex justify-between items-start border-b border-emerald-500/10 pb-3 gap-3">
                <div>
                  <h3 className="text-xl font-display font-extrabold text-red-700 dark:text-red-400">
                    {report.diseaseName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">
                      {t.severity}: {report.severity}
                    </span>
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      {t.confidence}: {report.confidenceScore}%
                    </span>
                  </div>
                </div>

                <button 
                  onClick={downloadReportPDF}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-1 border border-slate-200/50 dark:border-slate-800 text-xs font-semibold"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  {t.downloadReport}
                </button>
              </div>

              {/* Grid 2x2 of Symptoms & Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/50 rounded-xl">
                  <span className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 block mb-1.5">{t.symptoms}</span>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-medium list-disc list-inside">
                    {report.symptoms.map((sym, idx) => (
                      <li key={idx} className="leading-relaxed">{sym}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/50 rounded-xl">
                  <span className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 block mb-1.5">{t.causes}</span>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-medium list-disc list-inside">
                    {report.causes.map((cause, idx) => (
                      <li key={idx} className="leading-relaxed">{cause}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pesticides & Dosages table */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <span className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 block mb-2">{t.pesticides}</span>
                <div className="overflow-hidden border border-emerald-500/10 rounded-xl text-xs">
                  <table className="w-full text-left border-collapse bg-white/40 dark:bg-slate-900/40">
                    <thead className="bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-bold">
                      <tr>
                        <th className="p-2.5">Pesticide / Solution</th>
                        <th className="p-2.5">Safe Dosage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-500/5">
                      {report.recommendedPesticides.map((pest, idx) => (
                        <tr key={idx} className="hover:bg-emerald-500/5">
                          <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">{pest.name}</td>
                          <td className="p-2.5 font-medium text-slate-600 dark:text-slate-400">{pest.dosage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Treatment Protocols (Organic and Chemical Controls) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <span className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 block mb-1.5">{t.organic}</span>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-medium list-disc list-inside">
                    {report.organicTreatment.map((ot, idx) => (
                      <li key={idx} className="leading-relaxed">{ot}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-xs font-extrabold text-emerald-950 dark:text-emerald-100 block mb-1.5">{t.chemical}</span>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-medium list-disc list-inside">
                    {report.chemicalTreatment.map((ct, idx) => (
                      <li key={idx} className="leading-relaxed">{ct}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom statistics: recovery time, cost, safety, nearby office */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-emerald-500/5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.recovery}</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{report.recoveryTime}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-emerald-500/5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.cost}</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{report.estimatedCost}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-emerald-500/5 md:col-span-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t.safety}</span>
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 block mt-0.5">
                    {report.safetyMeasures[0] || "Wear safety masks and gloves while handling chemicals."}
                  </span>
                </div>
              </div>

              {/* Office Locator */}
              <div className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-500/5 text-xs flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-emerald-950 dark:text-emerald-100 block">{t.agriOffice}</span>
                  <span className="text-[10px] text-slate-500 block">{report.nearbyAgriOffice}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
