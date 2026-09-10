import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { Mic, MicOff, Send, MessageSquare, Volume2, VolumeX, Sparkles, RefreshCw, Upload, AlertCircle } from "lucide-react";

interface AIAssistantProps {
  language: 'English' | 'Tamil';
  userDistrict: string;
}

export default function AIAssistant({ language, userDistrict }: AIAssistantProps) {
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; text: string; image?: string }[]>(() => {
    const saved = localStorage.getItem("uzhavan_chat");
    if (saved) return JSON.parse(saved);
    
    // Initial welcome greetings
    return [
      {
        id: "welcome",
        role: "assistant",
        text: language === "English" 
          ? `Vannkam! I am Uzhavan AI, your virtual smart farming advisor. Ask me any questions about crop schedules, fertilizer quantities, organic Tamil pesticides, or free state electricity schemes.`
          : `வணக்கம்! நான் உழவன் AI, உங்களின் விவசாய தொழில்நுட்ப ஆலோசகர். உரங்களின் அளவு, இயற்கை பூச்சிக்கொல்லிகள் அல்லது அரசு மானியங்கள் பற்றி என்னிடம் கேளுங்கள்.`
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("uzhavan_chat", JSON.stringify(messages));
  }, [messages]);

  // Configure browser Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "Tamil" ? "ta-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setInputMessage(text);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition error:", event);
        setSpeechError("Voice input error or silent: " + event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (e?: FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = (customText || inputMessage).trim();
    if (!query && !selectedImage) return;

    const userMsgId = Date.now().toString();
    const newMsg = {
      id: userMsgId,
      role: 'user' as const,
      text: query,
      image: selectedImage || undefined
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

      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
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
        
        // Trigger voice synthesis readback
        if (voiceOutputEnabled) {
          speakMessage(data.text);
        }
      } else {
        throw new Error("Uzhavan API is down. Try again shortly.");
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

  // Speaks assistant text out loud
  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const cleanText = text.replace(/[*#`_-]/g, ""); // strip markdown tokens
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === "Tamil" ? "ta-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
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
            ? `Vannkam! I am Uzhavan AI, your virtual smart farming advisor. Ask me any questions.`
            : `வணக்கம்! நான் உழவன் AI, உங்களின் விவசாய தொழில்நுட்ப ஆலோசகர்.`
        }
      ];
      setMessages(welcome);
      localStorage.setItem("uzhavan_chat", JSON.stringify(welcome));
    }
  };

  // Upload crop leaves directly inside chat
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

  // Suggest topics
  const suggestedQuestions = language === "English" 
    ? [
        "Sowing season for turmeric in Erode district?",
        "What are some organic sprays for Paddy leaf folder?",
        "How do I apply for the Free Agris electricity program?",
        "Best NPK balance for sandy soils?"
      ]
    : [
        "நெல் இலை சுருட்டுப் புழுவை கட்டுப்படுத்தும் இயற்கை முறை?",
        "இலவச விவசாய மின்சார திட்டத்திற்கு எவ்வாறு விண்ணப்பிப்பது?",
        "மஞ்சள் பயிரிட உகந்த பருவம் எது?",
        "கரிசல் மண்ணில் என்ன பயிர்கள் நன்றாக வளரும்?"
      ];

  const t = {
    English: {
      title: "Uzhavan – Smart AI Farming Assistant",
      subtitle: "Ask farming queries naturally. Integrates speech recognition in Tamil & English and voice synthesis audio outputs.",
      placeholder: "Ask Uzhavan AI anything...",
      suggested: "Suggested farming topics:",
      clearChat: "Clear History",
      voiceActive: "Voice Output: On",
      voiceMuted: "Voice Output: Muted",
    },
    Tamil: {
      title: "உழவன் AI விவசாயத் தொழில்நுட்ப உதவி",
      subtitle: "உழவன் AI விவசாயக் கேள்விகளுக்கு எளிதாக குரல் அல்லது உரை மூலம் பதிலளிக்கும்.",
      placeholder: "விவசாயக் கேள்விகளைக் கேளுங்கள்...",
      suggested: "பரிந்துரைக்கப்படும் கேள்விகள்:",
      clearChat: "அழிக்கவும்",
      voiceActive: "குரல் ஒலி: ஆன்",
      voiceMuted: "குரல் ஒலி: ஆஃப்",
    }
  }[language];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      
      {/* Title */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
            <MessageSquare className="text-emerald-600 animate-bounce" />
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex gap-2 text-xs font-semibold">
          <button 
            onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
            className={`p-2 rounded-xl border flex items-center gap-1 cursor-pointer transition ${
              voiceOutputEnabled 
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/10 text-emerald-700 dark:text-emerald-300" 
                : "bg-slate-100 dark:bg-slate-800 border-slate-200/50 dark:border-slate-800 text-slate-500"
            }`}
          >
            {voiceOutputEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{voiceOutputEnabled ? t.voiceActive : t.voiceMuted}</span>
          </button>

          <button 
            onClick={clearChat}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition text-xs border border-slate-200/50 dark:border-slate-800"
          >
            {t.clearChat}
          </button>
        </div>
      </div>

      {speechError && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-300 flex items-center gap-2 text-xs shrink-0 font-medium">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Messages Stream (Grow/Flex) */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-xs leading-relaxed font-medium ${
              msg.role === "user" 
                ? "bg-emerald-600 text-white rounded-tr-none" 
                : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-tl-none"
            }`}>
              {/* Display attached image in bubble */}
              {msg.image && (
                <div className="rounded-xl overflow-hidden max-w-xs mb-3 border border-emerald-500/10">
                  <img src={msg.image} alt="uploaded leaf" className="w-full h-auto object-cover" />
                </div>
              )}
              <p className="whitespace-pre-line">{msg.text}</p>
              
              {msg.role === "assistant" && (
                <button 
                  onClick={() => speakMessage(msg.text)}
                  className="mt-2.5 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600 transition flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Speak Response (ஒலிபெருக்கு)
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Uzhavan is compiling response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips row */}
      {messages.length <= 1 && (
        <div className="shrink-0 space-y-2 text-xs">
          <span className="font-extrabold text-slate-600 dark:text-slate-400 block flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            {t.suggested}
          </span>
          <div className="flex gap-2 flex-wrap">
            {suggestedQuestions.map((q, idx) => (
              <button 
                key={idx}
                onClick={() => handleSendMessage(undefined, q)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-500/10 rounded-full font-bold cursor-pointer text-left transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Bar */}
      <form onSubmit={handleSendMessage} className="shrink-0 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
        {/* Attachment image upload button */}
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer transition border border-slate-200/50 dark:border-slate-800 relative ${
            selectedImage ? "ring-1 ring-emerald-500 bg-emerald-50" : ""
          }`}
        >
          <Upload className="w-4.5 h-4.5 text-emerald-600" />
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
          className="flex-1 px-4 py-3 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold dark:text-white"
        />

        {/* Mic dictation */}
        <button 
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-xl transition cursor-pointer border ${
            isListening 
              ? "bg-red-500 text-white border-red-500 animate-pulse" 
              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-800"
          }`}
        >
          {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5 text-emerald-600" />}
        </button>

        {/* Send message button */}
        <button 
          type="submit"
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition cursor-pointer"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>

    </div>
  );
}
