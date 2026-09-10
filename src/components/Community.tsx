import { useState, FormEvent } from "react";
import { MessageSquare, ThumbsUp, Calendar, MapPin, User, Send, Star, AlertCircle } from "lucide-react";
import { ForumPost, UserRole } from "../types";

interface CommunityProps {
  language: 'English' | 'Tamil';
  userProfileName: string;
  userProfileDistrict: string;
  userRole: UserRole;
}

export default function Community({ language, userProfileName, userProfileDistrict, userRole }: CommunityProps) {
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem("uzhavan_forum");
    if (saved) return JSON.parse(saved);

    // High fidelity default posts from actual Tamil Nadu farmers and officers
    return [
      {
        id: "post1",
        author: "Kathirvel Pandian",
        district: "Thanjavur",
        role: "farmer",
        content: "Our Samba Paddy (CR 1009 Sub 1) is currently at day 55 (tillering stage). Water availability is robust from the Grand Anicut canal. Noticeable leaf folders in certain plots, planning to spray neem seed kernel extract (NSKE 5%) tomorrow morning. Any organic recommendations from fellow delta farmers?",
        timestamp: "4 hours ago",
        likes: 12,
        likedBy: [],
        comments: [
          {
            id: "com1",
            author: "Dr. Selvakumar (Agri Officer)",
            role: "officer",
            content: "NSKE 5% is excellent, Kathirvel. Additionally, release Trichogramma chilonis egg parasitoids @ 2cc/acre at weekly intervals to organically neutralize stem borers and folders. Avoid nitrogenous fertilizer excess.",
            timestamp: "3 hours ago"
          }
        ]
      },
      {
        id: "post2",
        author: "Meenakshi Sundaram",
        district: "Erode",
        role: "farmer",
        content: "Turmeric arrivals are high at Erode yard today. Finger grade fetched up to ₹13,400/quintal. Bulb grade is stable around ₹10,500. Highly recommend delta farmers wait if possible as arrivals might tighten in August.",
        timestamp: "Yesterday",
        likes: 18,
        likedBy: [],
        comments: []
      }
    ];
  });

  const [newPostText, setNewPostText] = useState("");
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [selectedDistrict, setSelectedDistrict] = useState("All");

  const savePosts = (updatedPosts: ForumPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem("uzhavan_forum", JSON.stringify(updatedPosts));
  };

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: userProfileName || "Anonymous Farmer",
      district: userProfileDistrict || "Coimbatore",
      role: userRole,
      content: newPostText,
      timestamp: "Just now",
      likes: 0,
      likedBy: [],
      comments: []
    };

    const updated = [newPost, ...posts];
    savePosts(updated);
    setNewPostText("");
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(userProfileName);
        const likedBy = hasLiked 
          ? post.likedBy.filter(u => u !== userProfileName)
          : [...post.likedBy, userProfileName];
        const likes = hasLiked ? post.likes - 1 : post.likes + 1;
        return { ...post, likes, likedBy };
      }
      return post;
    });
    savePosts(updated);
  };

  const handleAddComment = (postId: string) => {
    const text = commentText[postId] || "";
    if (!text.trim()) return;

    const updated = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now().toString(),
          author: userProfileName || "Anonymous",
          role: userRole,
          content: text,
          timestamp: "Just now"
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });

    savePosts(updated);
    setCommentText(prev => ({ ...prev, [postId]: "" }));
  };

  const filteredPosts = posts.filter(p => {
    if (selectedDistrict === "All") return true;
    return p.district.toLowerCase() === selectedDistrict.toLowerCase();
  });

  const t = {
    English: {
      title: "Uzhavan Community Forum",
      subtitle: "Share real-time crop yields, pest alerts, and market price reports with other farmers. Verified experts answer queries.",
      inputPlaceholder: "What is happening in your fields today? Share a disease warning, crop yield, or pricing updates...",
      shareBtn: "Post Discussion",
      officerBadge: "Agri Officer",
      farmerBadge: "Farmer",
      districtFilter: "Filter District",
      allPosts: "Active Conversations",
      replyPlaceholder: "Write a reply...",
      commentBtn: "Reply",
      likes: "Likes",
      comments: "Comments",
    },
    Tamil: {
      title: "விவசாயிகள் கலந்துரையாடல் மன்றம்",
      subtitle: "பாதிப்புகள், பூச்சி எச்சரிக்கைகள் மற்றும் அறுவடை விலைகளை சக விவசாயிகளுடன் பகிருங்கள். வேளாண் அதிகாரிகள் பதிலளிப்பார்கள்.",
      inputPlaceholder: "இன்று உங்கள் வயலில் என்ன நடக்கிறது? பூச்சி தாக்குதல், பயிர் விளைச்சல் அல்லது விலை விவரங்களைப் பகிருங்கள்...",
      shareBtn: "விவாதிக்கவும்",
      officerBadge: "வேளாண் அதிகாரி",
      farmerBadge: "விவசாயி",
      districtFilter: "மாவட்ட வடிகட்டி",
      allPosts: "சமீபத்திய விவாதங்கள்",
      replyPlaceholder: "பதிலெழுதவும்...",
      commentBtn: "பதில்",
      likes: "விருப்பங்கள்",
      comments: "பதில்கள்",
    }
  }[language];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
            <MessageSquare className="text-emerald-600" />
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* District selection */}
        <div className="flex items-center gap-2 self-start shrink-0">
          <span className="text-xs font-semibold text-slate-500">{t.districtFilter}:</span>
          <select 
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold dark:text-white"
          >
            <option value="All">All Districts (முழு விவரம்)</option>
            {["Coimbatore", "Madurai", "Salem", "Trichy", "Chennai", "Thanjavur", "Erode", "Tirunelveli", "Cuddalore", "Dharmapuri"].map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Left create/view discussions, Right details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left discussions panel (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* New Post Box */}
          <form onSubmit={handleCreatePost} className="p-5 rounded-2xl glass-card border border-emerald-500/10 shadow-md space-y-3.5">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={t.inputPlaceholder}
              rows={3}
              className="w-full p-4 bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs font-semibold dark:text-white leading-relaxed resize-none"
            />
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Posting in <strong>{userProfileDistrict}</strong> as <strong>{userProfileName}</strong>
              </span>

              <button 
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition cursor-pointer"
              >
                {t.shareBtn}
              </button>
            </div>
          </form>

          {/* Discussion feed list */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-emerald-900 dark:text-emerald-100">
              {t.allPosts} ({filteredPosts.length})
            </h3>

            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 rounded-2xl glass-card border border-emerald-500/10 shadow-lg space-y-4">
                
                {/* Post Author Info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                        {post.author}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] uppercase font-bold px-1.5 rounded ${
                          post.role === "officer" 
                            ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300" 
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        }`}>
                          {post.role === "officer" ? t.officerBadge : t.farmerBadge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">•</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" /> {post.district}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{post.timestamp}</span>
                </div>

                {/* Content body */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                  {post.content}
                </p>

                {/* Action bars (likes, replies) */}
                <div className="flex gap-4 border-y border-slate-100 dark:border-slate-800/80 py-2.5 text-xs text-slate-500">
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-1 hover:text-emerald-600 transition font-bold cursor-pointer"
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.likedBy.includes(userProfileName) ? "fill-emerald-600 text-emerald-600" : ""}`} />
                    <span>{post.likes} {t.likes}</span>
                  </button>

                  <div className="flex items-center gap-1 font-bold">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} {t.comments}</span>
                  </div>
                </div>

                {/* Nested Replies */}
                {post.comments.length > 0 && (
                  <div className="space-y-3.5 pl-6 border-l-2 border-emerald-500/10">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-50/50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{comment.author}</span>
                          <span className="text-slate-400">{comment.timestamp}</span>
                        </div>
                        <span className={`text-[8px] uppercase font-bold px-1.5 rounded inline-block ${
                          comment.role === "officer" 
                            ? "bg-indigo-100 text-indigo-800" 
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {comment.role === "officer" ? t.officerBadge : t.farmerBadge}
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Form input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t.replyPlaceholder}
                    value={commentText[post.id] || ""}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                    className="flex-1 px-3.5 py-1.5 bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold dark:text-white"
                  />
                  <button 
                    onClick={() => handleAddComment(post.id)}
                    className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl text-xs cursor-pointer transition flex items-center gap-1 border border-emerald-500/10"
                  >
                    <Send className="w-3 h-3" />
                    {t.commentBtn}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Officer board (Col 4) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-indigo-50/20 dark:bg-slate-950/25 border border-indigo-500/10 shadow-lg space-y-4">
          <h3 className="font-display font-extrabold text-base text-indigo-900 dark:text-indigo-400 flex items-center gap-2 border-b border-indigo-500/10 pb-2.5">
            <Star className="w-5 h-5 text-indigo-500 fill-current" />
            Officer Advisory Board
          </h3>

          <p className="text-xs leading-relaxed text-slate-500 font-medium">
            Agricultural officers from Tamil Nadu Department of Agriculture actively audit posts tagged with disease warnings. They answer within 1-2 hours.
          </p>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/10 flex items-start gap-2 text-xs">
            <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-200 block">Weekly Officer Visit</span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Joint Director visits block units on Tuesdays for field diagnostic camps. Carry leaf specimens.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
