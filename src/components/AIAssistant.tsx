import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { 
  Mic, 
  MicOff, 
  Send, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RefreshCw, 
  Upload, 
  AlertCircle,
  Compass,
  CheckCircle2,
  HelpCircle,
  Radio,
  ArrowUpRight,
  Sprout,
  Bot
} from "lucide-react";

interface AIAssistantProps {
  language: 'English' | 'Tamil';
  userDistrict: string;
  onNavigate?: (tabId: string) => void;
  activeTab?: string;
  farmerName?: string;
  farmerSoil?: string;
  farmerAcres?: number;
}

interface NavTarget {
  id: string;
  nameEn: string;
  nameTa: string;
  keywordsEn: string[];
  keywordsTa: string[];
  descEn: string;
  descTa: string;
}

// Master voice navigation registry covering all platform modules
const NAV_TARGETS: NavTarget[] = [
  {
    id: "dashboard",
    nameEn: "Overview Dashboard",
    nameTa: "கண்காணிப்பு பலகை",
    keywordsEn: ["dashboard", "home", "overview", "main screen", "summary", "kpi"],
    keywordsTa: ["முகப்பு", "கண்காணிப்பு பலகை", "டாஷ்போர்டு", "முதன்மை பக்கம்"],
    descEn: "Overall farm KPIs, live weather alert & smart action plan",
    descTa: "பண்ணை நிலை மற்றும் வானிலை சுருக்கம்"
  },
  {
    id: "recommendation",
    nameEn: "AI Crop Planner",
    nameTa: "பயிர் திட்டமிடல்",
    keywordsEn: ["crop", "crops", "planner", "crop planner", "recommendation", "recommend", "planting", "sow"],
    keywordsTa: ["பயிர் திட்டமிடல்", "பயிர் பரிந்துரை", "பயிர்கள்", "விதைப்பு", "பயிர் ஆலோசனை"],
    descEn: "AI multi-factor seasonal crop recommendations",
    descTa: "பருவத்திற்கேற்ற சிறந்த பயிர் தேர்வு"
  },
  {
    id: "disease",
    nameEn: "Pathology Doctor",
    nameTa: "பயிர் நோய் அறிதல்",
    keywordsEn: ["disease", "doctor", "pathology", "leaf scan", "pest", "leaf disease", "infection", "sick"],
    keywordsTa: ["நோய் அறிதல்", "பயிர் மருத்துவர்", "இலை நோய்", "பூச்சி தாக்குதல்", "நோய்"],
    descEn: "Computer vision plant pathology diagnosis and remedies",
    descTa: "பயிர் நோய் கண்டறிதல் மற்றும் உடனடி தீர்வு"
  },
  {
    id: "weather",
    nameEn: "Farming Weather",
    nameTa: "விவசாய வானிலை",
    keywordsEn: ["weather", "rain", "forecast", "monsoon", "temperature", "climate", "rainfall"],
    keywordsTa: ["வானிலை", "மழை", "வெப்பநிலை", "பருவமழை", "விவசாய வானிலை", "மழை நிலவரம்"],
    descEn: "7-day verified agricultural microclimate forecast",
    descTa: "7 நாள் துல்லிய வானிலை முன்னறிவிப்பு"
  },
  {
    id: "prices",
    nameEn: "eNAM Market Prices",
    nameTa: "சந்தை விலை நிலவரம்",
    keywordsEn: ["price", "prices", "market", "mandi", "enam", "rates", "rate", "commodity", "sell"],
    keywordsTa: ["சந்தை விலை", "விலை நிலவரம்", "மண்டி", "விவசாய விலை", "சந்தை"],
    descEn: "Live eNAM mandi commodity prices and trends",
    descTa: "நேரலை சந்தை விலைகள் மற்றும் நிலவரம்"
  },
  {
    id: "soil",
    nameEn: "Soil Health Card",
    nameTa: "மண் பரிசோதனை",
    keywordsEn: ["soil", "soil test", "soil health", "npk", "texture", "organic carbon", "ph"],
    keywordsTa: ["மண் பரிசோதனை", "மண் வளம்", "மண் அட்டை", "மண்", "மண் காரத்தன்மை"],
    descEn: "Soil nutrient analysis and corrective NPK balancer",
    descTa: "மண் ஊட்டச்சத்து ஆய்வு மற்றும் தீர்வு"
  },
  {
    id: "irrigation",
    nameEn: "Water Scheduler",
    nameTa: "நீர் பாசன மேலாண்மை",
    keywordsEn: ["irrigation", "water", "drip", "sprinkler", "watering", "scheduler", "moisture"],
    keywordsTa: ["நீர் பாசனம்", "பாசன மேலாண்மை", "சொட்டு நீர்", "பாசனம்", "தண்ணீர்"],
    descEn: "Weather & soil moisture based smart irrigation timing",
    descTa: "மண் ஈரப்பதத்திற்கேற்ப நீர் பாசன அட்டவணை"
  },
  {
    id: "schemes",
    nameEn: "Subsidy & Schemes",
    nameTa: "விவசாய சலுகைகள்",
    keywordsEn: ["scheme", "schemes", "subsidy", "subsidies", "government", "kusum", "pm kisan", "grant"],
    keywordsTa: ["சலுகைகள்", "மானியங்கள்", "அரசு திட்டங்கள்", "மானியம்", "விவசாய சலுகைகள்"],
    descEn: "Government grants, PM-KUSUM & solar subsidies",
    descTa: "அரசு மானியங்கள் மற்றும் நலத்திட்டங்கள்"
  },
  {
    id: "community",
    nameEn: "Farmers Forum",
    nameTa: "விவசாயிகள் மன்றம்",
    keywordsEn: ["community", "forum", "farmers forum", "group", "discussion", "peers", "chat with farmers"],
    keywordsTa: ["விவசாயிகள் மன்றம்", "சமூகம்", "கலந்துரையாடல்", "மன்றம்", "விவசாயிகள் குழு"],
    descEn: "Local agronomy peer exchange & agricultural officer answers",
    descTa: "விவசாயிகள் மற்றும் அலுவலர்கள் கலந்துரையாடல்"
  },
  {
    id: "news",
    nameEn: "AgriTech News Feed",
    nameTa: "வேளாண் செய்திகள்",
    keywordsEn: ["news", "agri news", "updates", "articles", "feed", "msp announcement"],
    keywordsTa: ["வேளாண் செய்திகள்", "செய்திகள்", "அறிவிப்புகள்", "பத்திரிகை"],
    descEn: "Daily MSP announcements and agricultural policies",
    descTa: "தினசரி விவசாய கொள்கை செய்திகள்"
  },
  {
    id: "analytics",
    nameEn: "Sales & Yield ROI",
    nameTa: "வருவாய் பகுப்பாய்வு",
    keywordsEn: ["analytics", "roi", "yield", "revenue", "profit", "sales", "earnings", "cost"],
    keywordsTa: ["வருவாய் பகுப்பாய்வு", "பகுப்பாய்வு", "லாபம்", "மகசூல்", "செலவு கணக்கு"],
    descEn: "Farm cost vs. profit yield calculator and projections",
    descTa: "செலவு மற்றும் லாப கணக்கீடு"
  },
  {
    id: "profile",
    nameEn: "Digital Farmer ID",
    nameTa: "விவசாயி டிஜிட்டல் அட்டை",
    keywordsEn: ["profile", "farmer id", "card", "my id", "registry", "id card", "my profile", "account"],
    keywordsTa: ["சுயவிவரம்", "விவசாயி அட்டை", "டிஜிட்டல் அட்டை", "என் அட்டை", "என் கணக்கு"],
    descEn: "Verified QR identification & land registry details",
    descTa: "சரிபார்க்கப்பட்ட QR விவசாயி அடையாள அட்டை"
  },
  {
    id: "assistant",
    nameEn: "Uzhavan AI Farmer",
    nameTa: "உழவன் AI விவசாயி",
    keywordsEn: ["uzhavan", "uzhavan ai", "farmer ai", "assistant", "voice assistant", "agronomist", "crop doctor"],
    keywordsTa: ["உழவன்", "உழவன் ஏஐ", "உழவன் ai", "விவசாயி ai", "ஆலோசகர்", "பயிர் மருத்துவர்", "உதவியாளர்"],
    descEn: "Voice-activated agronomist companion & chat advisor",
    descTa: "குரல்வழி வேளாண்மை ஆலோசகர் & பயிர் மருத்துவர்"
  }
];

export default function AIAssistant({ 
  language, 
  userDistrict, 
  onNavigate,
  activeTab,
  farmerName,
  farmerSoil,
  farmerAcres
}: AIAssistantProps) {
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; image?: string; isVoice?: boolean }[]>(() => {
    const saved = localStorage.getItem("harvestpulse_chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    
    // Initial welcome greetings with voice instructions
    return [
      {
        id: "welcome",
        role: "assistant",
        text: language === "English" 
          ? `Vannakkam ${farmerName || "Farmer"}! I am **Uzhavan AI Farmer** (உழவன் AI), your personal voice-activated smart farming advisor & crop doctor.\n\n🎙️ **Voice Commands Supported:**\n• **Navigate the App:** Speak "Go to Weather", "Open Crop Planner", "Check Market Prices", "Open Disease Doctor", "Check Soil Card", etc.\n• **Ask Farming Questions:** Ask "What fertilizer for paddy in ${userDistrict}?", "Pest control for turmeric", or "Water schedule for ${farmerSoil || 'clay'} soil".\n\n📸 **Crop Doctor Photo Diagnosis:** You can also click the camera icon to upload a photo of any damaged leaf or pest for immediate AI remedy!`
          : `வணக்கம் ${farmerName || "விவசாயி"}! நான் **உழவன் AI விவசாயி** (Uzhavan AI Farmer), உங்கள் விவசாயத் தோழன் மற்றும் குரல்வழி பயிர் மருத்துவர்.\n\n🎙️ **குரல் கட்டளைகள் (Voice Commands):**\n• **பக்கங்களுக்கு செல்ல:** "வானிலை காட்டு", "பயிர் பரிந்துரை திற", "சந்தை விலை நிலவரம்", "நோய் அறிதல்", "நீர் பாசனம்" என பேசலாம்.\n• **விவசாயக் கேள்விகள்:** "${userDistrict} மாவட்டத்தில் நெல்லுக்கு என்ன உரம் போட வேண்டும்?", "மஞ்சள் இலை சுருட்டுப் புழுவுக்கு என்ன மருந்து?" என நேரடியாக குரலில் கேட்கலாம்.\n\n📸 **பயிர் நோய் கண்டறிதல்:** பாதிக்கப்பட்ட இலை அல்லது பயிரின் புகைப்படத்தை பதிவேற்றி உடனடி நிவாரணம் பெறலாம்!`
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [lastSpokenTranscript, setLastSpokenTranscript] = useState<string | null>(null);
  const [navFeedback, setNavFeedback] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("harvestpulse_chat", JSON.stringify(messages));
  }, [messages]);

  // Configure browser Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    setIsSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === "Tamil" ? "ta-IN" : "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
      setNavFeedback(null);
      setLastSpokenTranscript(language === "Tamil" ? "கேட்கிறது... பேசுங்கள்" : "Listening... Speak now");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const spoken = finalTranscript || interimTranscript;
      if (spoken) {
        setLastSpokenTranscript(spoken);
      }

      // If final result is ready, process command
      if (finalTranscript.trim()) {
        processVoiceInput(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition error:", event);
      setIsListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setSpeechError(language === "English" 
          ? "Microphone access blocked. Please allow microphone permissions in your browser or click the quick voice action chips below."
          : "மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது. உலாவியில் மைக் அனுமதியை வழங்கவும் அல்லது கீழே உள்ள பொத்தான்களை அழுத்தவும்.");
      } else if (event.error === "no-speech") {
        setSpeechError(language === "English" 
          ? "No voice input detected. Please click the microphone again and speak clearly."
          : "குரல் கேட்கவில்லை. மீண்டும் மைக்கை அழுத்தி தெளிவாக பேசவும்.");
      } else {
        setSpeechError(`Voice error (${event.error}). Try again or click sample voice chips.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [language, onNavigate]);

  // Voice command recognizer: checks if spoken text is an app navigation command
  const detectNavigationCommand = (text: string): NavTarget | null => {
    const clean = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

    // Check every nav target keywords
    for (const target of NAV_TARGETS) {
      // Check English keywords
      for (const kw of target.keywordsEn) {
        if (clean.includes(kw.toLowerCase())) {
          return target;
        }
      }
      // Check Tamil keywords
      for (const kw of target.keywordsTa) {
        if (clean.includes(kw.toLowerCase())) {
          return target;
        }
      }
    }
    return null;
  };

  // Process voice input: either navigate the app or ask HarvestPulse AI
  const processVoiceInput = (spokenText: string) => {
    const navMatch = detectNavigationCommand(spokenText);

    if (navMatch && onNavigate) {
      // Voice navigation action!
      const destName = language === "Tamil" ? navMatch.nameTa : navMatch.nameEn;
      const feedbackMsg = language === "Tamil" 
        ? `🎙️ குரல் கட்டளை ஏற்கப்பட்டது: ${destName} பக்கத்திற்கு மாறுகிறது...`
        : `🎙️ Voice Navigation: Navigating to ${destName}...`;

      setNavFeedback(feedbackMsg);
      speakMessage(language === "Tamil" ? `${destName} பக்கத்திற்கு செல்கிறேன்` : `Navigating to ${destName}`);

      // Add audit message in chat
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          text: `🗣️ "${spokenText}"`,
          isVoice: true
        },
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: language === "Tamil"
            ? `✅ குரல் வழிசெலுத்தல் வெற்றிகரமானது! ${destName} பக்கத்திற்கு மாற்றியுள்ளேன்.`
            : `✅ Voice navigation confirmed! Successfully switched your view to ${destName}.`
        }
      ]);

      // Trigger actual app navigation
      setTimeout(() => {
        onNavigate(navMatch.id);
      }, 700);

    } else {
      // General agricultural question asked by voice
      handleSendMessage(undefined, spokenText, true);
    }
  };

  const toggleListening = () => {
    if (!isSpeechSupported || !recognitionRef.current) {
      setSpeechError(language === "English"
        ? "Speech recognition is not natively supported in this browser. You can click any quick voice chips below to test voice actions."
        : "இந்த உலாவியில் பேச்சு அறிதல் ஆதரிக்கப்படவில்லை. கீழே உள்ள குரல் கட்டளை பொத்தான்களை கிளிக் செய்யலாம்.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      setNavFeedback(null);
      try {
        recognitionRef.current.start();
      } catch (err: any) {
        console.error("Failed to start speech recognition:", err);
        recognitionRef.current.abort();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // pass
          }
        }, 200);
      }
    }
  };

  const handleSendMessage = async (e?: FormEvent, customText?: string, isSpoken: boolean = false) => {
    if (e) e.preventDefault();
    const query = (customText || inputMessage).trim();
    if (!query && !selectedImage) return;

    const userMsgId = Date.now().toString();
    const newMsg = {
      id: userMsgId,
      role: 'user' as const,
      text: isSpoken ? `🗣️ "${query}"` : query,
      image: selectedImage || undefined,
      isVoice: isSpoken
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const chatHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.text
      }));

      // Enrich prompt context with farmer profile metadata
      const enrichedContext = `[Farmer Context: Name: ${farmerName || 'Farmer'}, District: ${userDistrict}, Farm Size: ${farmerAcres || 2.5} acres, Soil: ${farmerSoil || 'Clayey'}]`;

      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${enrichedContext} ${query || "Please examine this uploaded crop photo for disease symptoms, deficiencies, and immediate remedy."}`,
          image: selectedImage || undefined,
          history: chatHistory,
          language
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          text: data.text
        };
        setMessages(prev => [...prev, assistantMsg]);
        
        // Trigger voice synthesis readback if enabled
        if (voiceOutputEnabled) {
          speakMessage(data.text);
        }
      } else {
        throw new Error("Uzhavan AI Farmer service is temporarily busy. Try again shortly.");
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        text: `Error: ${err.message || "An issue occurred. Try again."}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Speaks assistant text out loud using Web Speech Synthesis
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Stop any pending speech
        const cleanText = text
          .replace(/[*#`_-]/g, "")
          .replace(/\[.*?\]/g, "")
          .replace(/http\S+/g, ""); // strip markdown and URLs
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === "Tamil" ? "ta-IN" : "en-IN";
        utterance.rate = 0.95; // slightly deliberate for clarity
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Speech synthesis failed:", err);
      }
    }
  };

  const clearChat = () => {
    const confirmClear = window.confirm(language === "English" ? "Clear chat history?" : "உரையாடலை அழிக்கவா?");
    if (confirmClear) {
      const welcome = [
        {
          id: "welcome",
          role: "assistant" as const,
          text: language === "English" 
            ? `Vannakkam ${farmerName || "Farmer"}! I am **Uzhavan AI Farmer** (உழவன் AI), your voice-activated smart farming advisor & crop doctor. You can speak commands to navigate the app or ask farming questions.`
            : `வணக்கம் ${farmerName || "விவசாயி"}! நான் **உழவன் AI விவசாயி** (Uzhavan AI Farmer). குரல் கட்டளைகள் மூலம் செயலியை இயக்கலாம் அல்லது விவசாயக் கேள்விகளைக் கேட்கலாம்.`
        }
      ];
      setMessages(welcome);
      localStorage.setItem("harvestpulse_chat", JSON.stringify(welcome));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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

  // Uzhavan AI Farmer Category Tabs
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = language === "English"
    ? [
        { id: "all", label: "🌟 All" },
        { id: "crops", label: "🌾 Paddy & Crops" },
        { id: "pests", label: "🐛 Crop Doctor" },
        { id: "soil", label: "🧪 Fertilizer & Soil" },
        { id: "water", label: "💧 Irrigation" },
        { id: "mandi", label: "💰 Mandi & MSP" },
        { id: "organic", label: "🌿 Natural Farming" },
        { id: "schemes", label: "🏛️ Uzhavan Schemes" },
      ]
    : [
        { id: "all", label: "🌟 அனைத்தும்" },
        { id: "crops", label: "🌾 நெல் & பயிர்கள்" },
        { id: "pests", label: "🐛 பயிர் மருத்துவர்" },
        { id: "soil", label: "🧪 உர மேலாண்மை" },
        { id: "water", label: "💧 நீர் பாசனம்" },
        { id: "mandi", label: "💰 சந்தை & கொள்முதல்" },
        { id: "organic", label: "🌿 இயற்கை வேளாண்மை" },
        { id: "schemes", label: "🏛️ உழவன் திட்டங்கள்" },
      ];

  const allQuickActions = language === "English"
    ? [
        // Navigation shortcuts
        { label: "Go to Weather", command: "Go to Farming Weather", isNav: true, category: "all" },
        { label: "Open Crop Planner", command: "Open AI Crop Planner", isNav: true, category: "crops" },
        { label: "Check Market Prices", command: "Show eNAM Market Prices", isNav: true, category: "mandi" },
        { label: "Scan Leaf / Crop Disease", command: "Open Pathology Doctor", isNav: true, category: "pests" },
        { label: "Water Scheduler", command: "Go to Water Scheduler", isNav: true, category: "water" },
        { label: "Soil Card", command: "Open Soil Health Card", isNav: true, category: "soil" },
        { label: "View Government Subsidies", command: "Open Subsidy & Schemes", isNav: true, category: "schemes" },

        // Crops & Paddy
        { label: "Paddy varieties for Delta?", command: `What are the best short-duration paddy varieties for ${userDistrict}?`, isNav: false, category: "crops" },
        { label: "Kuruvai nursery care tips", command: "Explain Kuruvai season paddy nursery management and seedling dip treatment.", isNav: false, category: "crops" },
        { label: "Maize Fall Armyworm cure", command: "What is the recommended integrated pest management for Fall Armyworm in Maize?", isNav: false, category: "crops" },

        // Pests & Disease Doctor
        { label: "Paddy Stem Borer remedy", command: "How to identify and control Yellow Stem Borer and dead hearts in paddy organically?", isNav: false, category: "pests" },
        { label: "Turmeric leaf spot treatment", command: "What is the organic and biocontrol spray for leaf spot and rhizome rot in turmeric?", isNav: false, category: "pests" },
        { label: "5% Neem Seed Extract (NSKE) guide", command: "How to prepare and spray 5% Neem Seed Kernel Extract (NSKE) for sucking pests?", isNav: false, category: "pests" },
        { label: "Pheromone traps per acre", command: "How many pheromone traps and light traps are recommended per acre for pest monitoring?", isNav: false, category: "pests" },

        // Soil & Fertilizer
        { label: "Paddy NPK & Zinc split dose", command: `Provide the split fertilizer dosage of Urea, DAP, Potash, and Zinc Sulphate for paddy in ${userDistrict}.`, isNav: false, category: "soil" },
        { label: "How to treat Zinc deficiency?", command: "What are the foliar spray remedies for Zinc deficiency (Khaira symptom) in paddy?", isNav: false, category: "soil" },
        { label: "Basal manure & Neem cake dose", command: `What is the recommended quantity of Farmyard Manure and Neem Cake per acre for ${farmerSoil || 'Clayey'} soil?`, isNav: false, category: "soil" },

        // Water & Irrigation
        { label: "Alternate Wetting & Drying (AWD)", command: "Explain Alternate Wetting and Drying (AWD) water-saving technique for paddy fields.", isNav: false, category: "water" },
        { label: "Irrigation for my soil type", command: `What is the optimal irrigation schedule for ${farmerSoil || 'Clayey'} soil during high temperatures in ${userDistrict}?`, isNav: false, category: "water" },

        // Mandi & MSP
        { label: "Today's eNAM Mandi rates", command: "Show eNAM Market Prices", isNav: true, category: "mandi" },
        { label: "Paddy MSP procurement rate", command: "What is the current Tamil Nadu government Direct Purchase Centre (DPC) MSP rate for paddy?", isNav: false, category: "mandi" },
        { label: "Turmeric auction trends", command: "What is the current market trend and price outlook for Turmeric in Erode and Salem mandis?", isNav: false, category: "mandi" },

        // Natural Farming
        { label: "Panchagavya preparation", command: "What are the exact ingredients and steps to brew 100 liters of 100% organic Panchagavya?", isNav: false, category: "organic" },
        { label: "Jeevamrutham microbial broth", command: "How to prepare Jeevamrutham to boost soil microflora and earthworm activity?", isNav: false, category: "organic" },
        { label: "Agni Astra insect repellent", command: "How to brew Agni Astra herbal pest repellent using garlic, chillies, and cow urine?", isNav: false, category: "organic" },

        // Subsidies & Schemes
        { label: "Uzhavan App Drip 100% subsidy", command: "How can small and marginal farmers apply for 100% drip irrigation subsidy through the Uzhavan App?", isNav: false, category: "schemes" },
        { label: "PM-KUSUM Solar pump subsidy", command: "What are the subsidies and application steps for PM-KUSUM 5HP solar agri pumps in Tamil Nadu?", isNav: false, category: "schemes" },
        { label: "Kalaignar Agri Village Scheme", command: "Explain the key benefits of Kalaignar's All Village Integrated Agriculture Development Programme.", isNav: false, category: "schemes" },
      ]
    : [
        // Navigation shortcuts
        { label: "விவசாய வானிலை", command: "விவசாய வானிலை காட்டு", isNav: true, category: "all" },
        { label: "பயிர் திட்டமிடல்", command: "பயிர் திட்டமிடல் திற", isNav: true, category: "crops" },
        { label: "சந்தை விலை நிலவரம்", command: "சந்தை விலை நிலவரம் காட்டு", isNav: true, category: "mandi" },
        { label: "பயிர் நோய் அறிதல்", command: "பயிர் நோய் அறிதல் திற", isNav: true, category: "pests" },
        { label: "நீர் பாசன மேலாண்மை", command: "நீர் பாசன மேலாண்மைக்கு செல்", isNav: true, category: "water" },
        { label: "மண் பரிசோதனை அட்டை", command: "மண் பரிசோதனை அட்டை திற", isNav: true, category: "soil" },
        { label: "அரசு சலுகைகள்", command: "விவசாய சலுகைகள் திற", isNav: true, category: "schemes" },

        // Crops & Paddy
        { label: "நெல் ரகங்கள் பரிந்துரை?", command: `${userDistrict} மாவட்டத்திற்கு ஏற்ற அதிக மகசூல் தரும் குறுகிய கால நெல் ரகங்கள் எவை?`, isNav: false, category: "crops" },
        { label: "குறுவை நாற்றங்கால் மேலாண்மை", command: "குறுவை பருவ நெல் நாற்றங்கால் பராமரிப்பு மற்றும் சூடோமோனாஸ் விதை நேர்த்தி முறைகள் யாவை?", isNav: false, category: "crops" },
        { label: "மக்காச்சோள படைப்புழு கட்டுப்பாடு", command: "மக்காச்சோளத்தில் படைப்புழு தாக்குதலை இயற்கை மற்றும் ஒருங்கிணைந்த முறையில் கட்டுப்படுத்துவது எப்படி?", isNav: false, category: "crops" },

        // Pests & Disease Doctor
        { label: "நெல் குருத்துப்பூச்சிக்கு தீர்வு", command: "நெல்லில் குருத்துப்பூச்சி மற்றும் இலை சுருட்டுப் புழு தாக்குதலைக் கட்டுப்படுத்த எளிய இயற்கை முறைகள் யாவை?", isNav: false, category: "pests" },
        { label: "மஞ்சள் இலைப்புள்ளி & அழுகல் நோய்", command: "மஞ்சள் பயிரில் இலைப்புள்ளி மற்றும் கிழங்கு அழுகல் நோயைக் குணப்படுத்தும் வழிமுறைகள் என்ன?", isNav: false, category: "pests" },
        { label: "5% வேப்பங்கொட்டை சாறு செய்முறை", command: "சாறு உறிஞ்சும் பூச்சிகளைக் கட்டுப்படுத்த 5% வேப்பங்கொட்டை சாறு (NSKE) தயாரித்து தெளிக்கும் முறை என்ன?", isNav: false, category: "pests" },
        { label: "இனிய கவர்ச்சி பொறி பயன்பாடு", command: "ஒரு ஏக்கருக்கு எத்தனை இனக்கவர்ச்சி பொறிகள் மற்றும் விளக்குப் பொறிகள் வைக்க வேண்டும்?", isNav: false, category: "pests" },

        // Soil & Fertilizer
        { label: "நெல்லுக்கான உர அட்டவணை?", command: `${userDistrict} மாவட்டத்தில் ஒரு ஏக்கர் நெல் பயிருக்கு யூரியா, டிஏபி, பொட்டாஷ் மற்றும் துத்தநாக உரம் இடும் கால அட்டவணை என்ன?`, isNav: false, category: "soil" },
        { label: "துத்தநாக பற்றாக்குறைக்கு தீர்வு", command: "நெல்லில் துத்தநாக சத்து பற்றாக்குறை (கைரா நோய்) ஏற்பட்டால் என்ன இலைவழி தெளிப்பு செய்ய வேண்டும்?", isNav: false, category: "soil" },
        { label: "அடி உரம் & வேப்பம் புண்ணாக்கு", command: `${farmerSoil || 'களிமண்'} நிலத்திற்கு ஒரு ஏக்கருக்கு பரிந்துரைக்கப்படும் மண்புழு உரம் மற்றும் வேப்பம் புண்ணாக்கு அளவு என்ன?`, isNav: false, category: "soil" },

        // Water & Irrigation
        { label: "காய்ச்சலும் பாய்ச்சலும் பாசனம்", command: "நெல்லில் 30% வரை நீர் சேமிக்கும் காய்ச்சலும் பாய்ச்சலும் (AWD) நீர்ப்பாசன முறையை விளக்குக.", isNav: false, category: "water" },
        { label: "மண் வகைக்கேற்ற பாசன இடைவெளி", command: `${userDistrict} மாவட்டத்தில் ${farmerSoil || 'களிமண்'} நிலத்திற்கு வெப்ப காலத்தில் எத்தனை நாட்களுக்கு ஒருமுறை பாசனம் செய்ய வேண்டும்?`, isNav: false, category: "water" },

        // Mandi & MSP
        { label: "நேரலை சந்தை விலைகள்", command: "சந்தை விலை நிலவரம் காட்டு", isNav: true, category: "mandi" },
        { label: "நெல் கொள்முதல் விலை (MSP)", command: "தமிழ்நாடு அரசு நேரடி நெல் கொள்முதல் நிலையங்களில் (DPC) தற்போதைய நெல் குவிண்டால் கொள்முதல் விலை என்ன?", isNav: false, category: "mandi" },
        { label: "ஈரோடு மஞ்சள் சந்தை நிலவரம்", command: "ஈரோடு ஒழுங்குமுறை விற்பனை கூடத்தில் விரலி மற்றும் கிழங்கு மஞ்சள் தற்போதைய விலை போக்கு எப்படி உள்ளது?", isNav: false, category: "mandi" },

        // Natural Farming
        { label: "பஞ்சகாவ்யா தயாரிக்கும் முறை", command: "100% இயற்கை முறையில் பயிர் வளர்ச்சி ஊக்கியான பஞ்சகாவ்யா தயாரிக்கும் பொருட்கள் மற்றும் செய்முறை என்ன?", isNav: false, category: "organic" },
        { label: "ஜீவாமிர்தம் தயாரிப்பது எப்படி?", command: "நிலத்தின் நுண்ணுயிர் பெருக்கத்திற்கு ஜீவாமிர்தம் தயாரித்து பாசன நீரில் கலப்பது எப்படி?", isNav: false, category: "organic" },
        { label: "அக்னி அஸ்திரம் பூச்சி விரட்டி", command: "பூண்டு, பச்சை மிளகாய், மாட்டுச் சிறுநீர் கொண்டு அக்னி அஸ்திரம் தயாரிக்கும் செய்முறை என்ன?", isNav: false, category: "organic" },

        // Subsidies & Schemes
        { label: "உழவன் செயலி 100% சொட்டுநீர் மானியம்", command: "உழவன் செயலி மூலம் சிறு மற்றும் குறு விவசாயிகள் 100% சொட்டுநீர் பாசன மானியம் பெறுவது எப்படி?", isNav: false, category: "schemes" },
        { label: "பி.எம் குசும் சோலார் பம்ப் திட்டம்", command: "விவசாயிகளுக்கு 70% மானியத்தில் சோலார் பம்புசெட் வழங்கும் பி.எம் குசும் திட்டத்தின் நிபந்தனைகள் யாவை?", isNav: false, category: "schemes" },
        { label: "கலைஞரின் அனைத்து கிராம வேளாண்மை திட்டம்", command: "கலைஞரின் அனைத்து கிராம ஒருங்கிணைந்த வேளாண் வளர்ச்சி திட்டத்தின் கீழ் கிடைக்கும் நன்மைகள் என்ன?", isNav: false, category: "schemes" },
      ];

  const quickVoiceActions = selectedCategory === "all"
    ? allQuickActions
    : allQuickActions.filter(a => a.category === selectedCategory || a.category === "all");

  const t = {
    English: {
      title: "Uzhavan AI Farmer • Voice Agronomist",
      subtitle: "Voice-activated farm navigation, crop doctor & agronomist intelligence. Speak in English or Tamil to switch tabs or ask agronomic queries.",
      badge: "Uzhavan Companion • TNAU Aligned",
      micStart: "Tap to Speak Voice Command",
      micListening: "Listening... Speak command or question",
      speechEngine: "Browser Speech Recognition: Ready (en-IN / ta-IN)",
      placeholder: "Ask Uzhavan AI (e.g., 'What fertilizer for paddy in Thanjavur?' or 'Go to Weather')...",
      voiceActive: "Voice Output: On",
      voiceMuted: "Voice Output: Muted",
      navFeedbackTitle: "Voice Navigation Action",
      quickActions: "Uzhavan AI Agricultural Commands & Diagnostics (Click or Speak):",
      filterByTopic: "Agronomy Focus Topics:",
      clearChat: "Clear History"
    },
    Tamil: {
      title: "உழவன் AI விவசாயி • குரல்வழி வேளாண் ஆலோசகர்",
      subtitle: "செயலியை இயக்கவும், பயிர் நோய் தீர்க்கவும், உரம் மற்றும் பாசன ஆலோசனைகளைப் பெறவும் உங்கள் குரல் கட்டளைகளைப் பயன்படுத்தவும்.",
      badge: "உழவன் தோழன் • தமிழ்நாடு வேளாண் பல்கலைக்கழக வழிகாட்டல்",
      micStart: "குரல் கட்டளை பேச கிளிக் செய்யவும்",
      micListening: "கேட்கிறது... கட்டளை அல்லது கேள்வியை பேசவும்",
      speechEngine: "உலாவி பேச்சு அறிதல்: தயார் நிலையில் உள்ளது (ta-IN / en-IN)",
      placeholder: "உழவன் AI-யிடம் கேட்கவும் (எ.கா: 'நெல்லுக்கு என்ன உரம் போட வேண்டும்?' அல்லது 'வானிலை காட்டு')...",
      voiceActive: "குரல் ஒலி: ஆன்",
      voiceMuted: "குரல் ஒலி: ஆஃப்",
      navFeedbackTitle: "குரல் வழிசெலுத்தல்",
      quickActions: "உழவன் AI வேளாண் கட்டளைகள் & விரைவு வழிகாட்டல் (கிளிக் அல்லது பேசலாம்):",
      filterByTopic: "வேளாண் துறை தலைப்புகள்:",
      clearChat: "அழிக்கவும்"
    }
  }[language];

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-130px)]">
      
      {/* Top Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-tr from-emerald-600 via-green-600 to-teal-600 p-2.5 rounded-xl text-white shadow-md shadow-emerald-600/20 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-display text-emerald-950 dark:text-emerald-50">
                {t.title}
              </h1>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {t.badge}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 max-w-2xl">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Global Assistant Controls */}
        <div className="flex items-center gap-2 self-end md:self-center text-xs font-semibold">
          <button 
            onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer transition ${
              voiceOutputEnabled 
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500/20 text-emerald-700 dark:text-emerald-300" 
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}
          >
            {voiceOutputEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{voiceOutputEnabled ? t.voiceActive : t.voiceMuted}</span>
          </button>

          <button 
            onClick={clearChat}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition border border-slate-200 dark:border-slate-700"
          >
            {t.clearChat}
          </button>
        </div>
      </div>

      {/* Voice Recognition Live Status Bar */}
      <div className={`p-3 rounded-2xl border transition duration-300 shrink-0 ${
        isListening 
          ? "bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border-red-500/40 shadow-md shadow-red-500/5" 
          : "bg-emerald-500/5 border-emerald-500/20"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Pulsing Mic Indicator */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl transition cursor-pointer flex items-center justify-center shadow-md ${
                isListening 
                  ? "bg-red-600 text-white animate-pulse shadow-red-600/30 scale-105" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
              }`}
              title={isListening ? "Stop Listening" : "Start Voice Recognition"}
            >
              {isListening ? <MicOff className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${isListening ? "bg-red-500 animate-ping" : "bg-emerald-500"}`} />
                  {isListening ? t.micListening : t.micStart}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">
                  {language === "Tamil" ? "ta-IN" : "en-IN"}
                </span>
              </div>
              
              {/* Spoken interim feedback */}
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate max-w-md font-medium">
                {lastSpokenTranscript 
                  ? `🗣️ "${lastSpokenTranscript}"` 
                  : (language === "English" 
                      ? "Say 'Go to Weather', 'Check Disease', or ask any crop query" 
                      : "'வானிலை காட்டு', 'பயிர் மருத்துவர்' அல்லது விவசாயக் கேள்விகளைப் பேசலாம்")}
              </p>
            </div>
          </div>

          {/* Sound wave visualizer when listening */}
          {isListening && (
            <div className="flex items-center gap-1 self-center sm:self-auto px-3 py-1 bg-red-50 dark:bg-red-950/40 rounded-full border border-red-200 dark:border-red-900/40">
              <span className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="w-1 h-6 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "75ms" }} />
              <span className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 ml-1.5">Audio Detected</span>
            </div>
          )}
        </div>

        {/* Real-time Navigation Toast inside status bar */}
        {navFeedback && (
          <div className="mt-2.5 p-2 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{navFeedback}</span>
          </div>
        )}

        {/* Speech error message */}
        {speechError && (
          <div className="mt-2.5 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/40 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{speechError}</span>
          </div>
        )}
      </div>

      {/* Uzhavan Agronomy Category Selector & Quick Voice Actions */}
      <div className="shrink-0 space-y-2">
        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider shrink-0 mr-1 hidden sm:inline">
            {t.filterByTopic}
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition shrink-0 cursor-pointer border ${
                  isActive
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20"
                    : "bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Quick Voice Command Action Pills (Clickable and spoken) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {t.quickActions}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {language === "English" ? "Click to simulate spoken query" : "கேள்வியை இயக்க கிளிக் செய்யவும்"}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
            {quickVoiceActions.map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => processVoiceInput(action.command)}
                className={`px-3 py-1.5 rounded-full font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer border text-[11px] ${
                  action.isNav
                    ? "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-500/20"
                    : "bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-500/20"
                }`}
              >
                <Mic className="w-3 h-3 opacity-70" />
                <span>{action.label}</span>
                {action.isNav && <ArrowUpRight className="w-3 h-3 opacity-70" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Stream (Grow/Flex) */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-inner">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm text-xs leading-relaxed font-medium ${
              msg.role === "user" 
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none" 
                : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none"
            }`}>
              {/* Voice indicator badge */}
              {msg.isVoice && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 mb-1.5 rounded-full bg-black/20 text-[10px] font-bold">
                  <Mic className="w-2.5 h-2.5" />
                  <span>{language === "English" ? "Spoken Command" : "குரல் கட்டளை"}</span>
                </div>
              )}

              {/* Display attached image */}
              {msg.image && (
                <div className="rounded-xl overflow-hidden max-w-xs mb-3 border border-emerald-500/20 shadow-sm">
                  <img src={msg.image} alt="uploaded leaf" className="w-full h-auto object-cover" />
                </div>
              )}

              <p className="whitespace-pre-line">{msg.text}</p>
              
              {msg.role === "assistant" && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <button 
                    onClick={() => speakMessage(msg.text)}
                    className="p-1 rounded hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 transition flex items-center gap-1.5 font-bold text-[11px] cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{language === "English" ? "Read Aloud (Voice)" : "குரலில் கேட்க"}</span>
                  </button>

                  <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    <span>{language === "English" ? "Uzhavan AI Farmer" : "உழவன் AI விவசாயி"}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>{language === "English" ? "Uzhavan AI Farmer is formulating agronomist advice..." : "உழவன் AI விவசாயி வழிகாட்டலை தயார் செய்கிறது..."}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSendMessage} className="shrink-0 flex items-center gap-2 pt-1">
        {/* Attachment upload */}
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer transition border border-slate-200 dark:border-slate-700 relative shadow-sm ${
            selectedImage ? "ring-2 ring-emerald-500 bg-emerald-50" : ""
          }`}
          title="Attach plant image for diagnosis"
        >
          <Upload className="w-4 h-4 text-emerald-600" />
          {selectedImage && <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-1.5 right-1.5 animate-ping" />}
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />

        <input 
          type="text"
          placeholder={t.placeholder}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold text-slate-900 dark:text-white shadow-sm"
        />

        {/* Mic dictation toggle */}
        <button 
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-xl transition cursor-pointer border shadow-sm ${
            isListening 
              ? "bg-red-600 text-white border-red-600 animate-pulse" 
              : "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
          }`}
          title={isListening ? "Stop listening" : "Speak voice command"}
        >
          {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5 text-emerald-600" />}
        </button>

        {/* Send query button */}
        <button 
          type="submit"
          className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
          title="Send query"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>

    </div>
  );
}
