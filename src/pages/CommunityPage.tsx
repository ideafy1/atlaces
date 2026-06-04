import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, orderBy, query, doc, updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Heart, Send, MessageCircle, Shield, Clock, ChevronDown, ChevronUp, Flame, 
  SmilePlus, TrendingUp, Users, Sparkles, Bookmark, Grid, Image as ImageIcon, 
  MoreHorizontal, User, RefreshCw, X, Plus, Search, Info 
} from 'lucide-react';

const adjectives = ['Gentle', 'Brave', 'Calm', 'Kind', 'Quiet', 'Warm', 'Bright', 'Bold', 'Free', 'Wise', 'Soft', 'True', 'Wild', 'Pure', 'Deep', 'Still', 'Open', 'Clear', 'Strong', 'Light'];
const nouns = ['Phoenix', 'Lotus', 'River', 'Cloud', 'Moon', 'Star', 'Wave', 'Leaf', 'Petal', 'Dawn', 'Sky', 'Flame', 'Stone', 'Breeze', 'Rain', 'Pearl', 'Frost', 'Spark', 'Echo', 'Bloom'];
const avatarColors = [
  'from-violet-500 to-purple-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600', 'from-blue-500 to-indigo-600', 'from-cyan-500 to-sky-600',
  'from-fuchsia-500 to-pink-600', 'from-lime-500 to-green-600',
];

const moods = [
  { label: '😔 Feeling low', value: 'low', color: 'from-blue-400 to-indigo-500' },
  { label: '😰 Anxious', value: 'anxious', color: 'from-purple-400 to-indigo-500' },
  { label: '🙏 Grateful', value: 'grateful', color: 'from-amber-400 to-orange-500' },
  { label: '💪 Hopeful', value: 'hopeful', color: 'from-emerald-400 to-teal-500' },
  { label: '😤 Frustrated', value: 'frustrated', color: 'from-rose-400 to-red-500' },
  { label: '🌱 Growing', value: 'growing', color: 'from-green-400 to-emerald-500' },
  { label: '💭 Reflecting', value: 'reflecting', color: 'from-cyan-400 to-blue-500' },
  { label: '🤗 Need support', value: 'support', color: 'from-pink-400 to-rose-500' },
];

const reactions = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🤗', label: 'Hug' },
  { emoji: '💪', label: 'Strength' },
  { emoji: '🙏', label: 'Support' },
];

const cardGradients = [
  'from-violet-600 to-indigo-600',
  'from-rose-500 to-orange-500',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-pink-500',
  'from-slate-800 to-slate-900',
  'from-fuchsia-600 to-purple-700',
];

function getRandomName() { return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`; }
function getRandomColor() { return avatarColors[Math.floor(Math.random() * avatarColors.length)]; }
function getInitials(name: string) { return (name || 'A').split(' ').map(w => w[0]).join('').toUpperCase(); }
function formatInstaHandle(name: string) { return name.toLowerCase().replace(/\s+/g, '_'); }

function timeAgo(ts: any): string {
  if (!ts?.toDate) return 'just now';
  const s = Math.floor((Date.now() - ts.toDate().getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function getExpiryText(ts: any): string {
  if (!ts?.toDate) return '24h left';
  const msLeft = (ts.toDate().getTime() + 86400000) - Date.now();
  if (msLeft <= 0) return 'expired';
  const h = Math.floor(msLeft / 3600000);
  const m = Math.floor((msLeft % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

function getExpiryPercent(ts: any): number {
  if (!ts?.toDate) return 100;
  const msLeft = (ts.toDate().getTime() + 86400000) - Date.now();
  return Math.max(0, Math.min(100, (msLeft / 86400000) * 100));
}

interface Post {
  id: string; name: string; color: string; cardColor?: string; message: string; mood?: string;
  reactions?: Record<string, number>; replies?: Array<{ name: string; color: string; message: string; timestamp: any }>;
  timestamp: any;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedCardColor, setSelectedCardColor] = useState(cardGradients[0]);
  const [sending, setSending] = useState(false);
  
  // Local identity persona state
  const [myPersona, setMyPersona] = useState(() => {
    const saved = localStorage.getItem('brainheal_persona');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    const newP = { name: getRandomName(), color: getRandomColor() };
    localStorage.setItem('brainheal_persona', JSON.stringify(newP));
    return newP;
  });

  const handleResetPersona = () => {
    const newP = { name: getRandomName(), color: getRandomColor() };
    localStorage.setItem('brainheal_persona', JSON.stringify(newP));
    setMyPersona(newP);
  };

  const [reactedPosts, setReactedPosts] = useState<Record<string, string[]>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [activeFilterMood, setActiveFilterMood] = useState<string>('');
  const [layout, setLayout] = useState<'feed' | 'grid'>('feed');
  const [activeLightboxPost, setActiveLightboxPost] = useState<Post | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReactionsPopup, setShowReactionsPopup] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'community'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const now = Date.now();
      const p: Post[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)).filter(p => !p.timestamp?.toDate || (now - p.timestamp.toDate().getTime()) < 86400000);
      setPosts(p);
      
      // Update lightbox post if open
      if (activeLightboxPost) {
        const fresh = p.find(item => item.id === activeLightboxPost.id);
        if (fresh) setActiveLightboxPost(fresh);
      }
    }, (err) => console.warn('Community error:', err));
    
    const saved = localStorage.getItem('brainheal_reacted');
    if (saved) setReactedPosts(JSON.parse(saved));
    return () => unsub();
  }, [activeLightboxPost]);

  useEffect(() => { const i = setInterval(() => setTick(t => t + 1), 60000); return () => clearInterval(i); }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSend = async () => {
    const msg = newMessage.trim();
    if (!msg || sending) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'community'), { 
        name: myPersona.name, 
        color: myPersona.color, 
        cardColor: selectedCardColor, 
        message: msg, 
        mood: selectedMood || '', 
        reactions: { '❤️': 0, '🤗': 0, '💪': 0, '🙏': 0 }, 
        replies: [], 
        timestamp: serverTimestamp() 
      });
      setNewMessage(''); 
      setSelectedMood(''); 
      setShowCreateModal(false);
      triggerToast('Post shared anonymously!');
    } catch (e) { 
      console.error('Post error:', e); 
    } finally { 
      setSending(false); 
    }
  };

  const handleReact = async (postId: string, emoji: string) => {
    const pr = reactedPosts[postId] || [];
    if (pr.includes(emoji)) return;
    const updated = { ...reactedPosts, [postId]: [...pr, emoji] };
    setReactedPosts(updated);
    localStorage.setItem('brainheal_reacted', JSON.stringify(updated));
    try { 
      await updateDoc(doc(db, 'community', postId), { 
        [`reactions.${emoji}`]: (posts.find(p => p.id === postId)?.reactions?.[emoji] || 0) + 1 
      }); 
    } catch (e) { 
      console.warn(e); 
    }
    setShowReactionsPopup(null);
  };

  const handleReply = async (postId: string, text: string) => {
    const msg = text.trim();
    if (!msg) return;
    try { 
      await updateDoc(doc(db, 'community', postId), { 
        replies: arrayUnion({ 
          name: myPersona.name, 
          color: myPersona.color, 
          message: msg, 
          timestamp: Timestamp.now() 
        }) 
      }); 
      setReplyText(''); 
      setReplyingTo(null); 
      setExpandedReplies(prev => new Set(prev).add(postId)); 
      triggerToast('Comment posted!');
    } catch (e) { 
      console.error(e); 
    }
  };

  const toggleReplies = (id: string) => { 
    setExpandedReplies(prev => { 
      const n = new Set(prev); 
      n.has(id) ? n.delete(id) : n.add(id); 
      return n; 
    }); 
  };

  const copyPostLink = (postId: string) => {
    const url = `${window.location.origin}/community?post=${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      triggerToast('Link copied to clipboard!');
    });
  };

  const filteredPosts = posts.filter(p => !activeFilterMood || p.mood === activeFilterMood);
  const totalReactions = posts.reduce((sum, p) => sum + Object.values(p.reactions || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0), 0);
  const totalReplies = posts.reduce((sum, p) => sum + (p.replies?.length || 0), 0);

  const getPostTotalReactions = (post: Post) => {
    return Object.values(post.reactions || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
  };

  // Typography scaling for graphic card
  const getCardFontSize = (text: string) => {
    const len = text.length;
    if (len < 60) return 'text-2xl md:text-3xl font-serif italic font-semibold';
    if (len < 130) return 'text-xl md:text-2xl font-serif italic font-medium';
    if (len < 240) return 'text-base md:text-lg font-medium';
    if (len < 380) return 'text-sm md:text-base font-normal';
    return 'text-xs md:text-sm font-normal';
  };

  const GraphicCard = ({ text, gradient, mode = 'normal' }: { text: string; gradient: string; mode?: 'normal' | 'lightbox' }) => {
    return (
      <div className={`w-full aspect-square bg-gradient-to-tr ${gradient} rounded-none relative flex flex-col items-center justify-center p-8 text-center text-white select-none overflow-hidden group`}>
        {/* Film grain / overlay */}
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-white/5 opacity-40 pointer-events-none" />
        
        {/* Dynamic Typography Box */}
        <div className="w-full max-h-[80%] overflow-y-auto pr-1 relative z-10 flex flex-col items-center justify-center scrollbar-thin">
          <p className={`leading-relaxed px-2 font-instrument select-text ${getCardFontSize(text)}`}>
            “{text || 'Write something anonymous...'}”
          </p>
        </div>

        {/* Small branding watermark */}
        <div className="absolute bottom-6 left-0 right-0 text-[10px] md:text-xs text-white/50 tracking-wider font-semibold pointer-events-none">
          brainheal.in
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-brand-black pb-24 md:pb-8 flex flex-col font-sans">
      
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-zinc-900 text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Global Wrapper (Instagram Desktop layout includes a left sidebar) */}
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row relative">
        
        {/* LEFT NAVIGATION SIDEBAR (Desktop) */}
        <div className="hidden md:flex flex-col w-[240px] h-[calc(100vh-73px)] sticky top-[73px] border-r border-gray-200/80 px-4 py-6 bg-white shrink-0 justify-between">
          <div className="space-y-6">
            <div className="px-2">
              <h1 className="text-xl font-instrument font-bold tracking-tight text-brand-black flex items-center gap-2">
                BrainHeal <span className="italic font-normal text-brand-gray">feed</span>
              </h1>
            </div>

            <nav className="space-y-1">
              <button onClick={() => { setLayout('feed'); setActiveFilterMood(''); }} 
                className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-50 text-sm font-semibold transition-colors text-left text-brand-black">
                <ImageIcon className="w-5 h-5" />
                <span>Home Feed</span>
              </button>
              
              <button onClick={() => setLayout('grid')} 
                className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-50 text-sm font-semibold transition-colors text-left text-brand-black">
                <Grid className="w-5 h-5" />
                <span>Grid Gallery</span>
              </button>

              <button onClick={() => setShowCreateModal(true)} 
                className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-50 text-sm font-semibold transition-colors text-left text-brand-black">
                <Plus className="w-5 h-5" />
                <span>Create Post</span>
              </button>

              <button onClick={() => setShowGuidelines(true)} 
                className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-50 text-sm font-semibold transition-colors text-left text-brand-black">
                <Info className="w-5 h-5" />
                <span>Safety Guide</span>
              </button>
            </nav>
          </div>

          {/* User Anonymous Card at sidebar bottom */}
          <div className="border-t border-gray-100 pt-4 px-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${myPersona.color} flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                {getInitials(myPersona.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-brand-black">@{formatInstaHandle(myPersona.name)}</p>
                <p className="text-[9px] text-brand-gray">Your Anon Persona</p>
              </div>
              <button onClick={handleResetPersona} title="Reset Persona" className="p-1.5 rounded-lg hover:bg-gray-100 text-brand-gray hover:text-brand-black transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: FEED & MAIN CONTENT AREA */}
        <div className="flex-1 min-w-0 md:px-6 pt-0 md:pt-6 max-w-2xl mx-auto w-full">
          
          {/* Mobile Top Header */}
          <div className="md:hidden bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between sticky top-0 z-40">
            <h1 className="text-xl font-instrument font-bold tracking-tight text-brand-black">
              BrainHeal <span className="italic font-normal text-brand-gray">feed</span>
            </h1>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowCreateModal(true)} className="p-1 text-brand-black">
                <Plus className="w-6 h-6" />
              </button>
              <button onClick={() => setShowGuidelines(true)} className="p-1 text-brand-black">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* STORIES BAR (Horizontally Scrollable) */}
          <div className="bg-white border border-gray-200 md:rounded-xl p-4 flex gap-4 overflow-x-auto scrollbar-none mb-4 shadow-sm">
            {/* User Story */}
            <button onClick={() => setShowCreateModal(true)} className="flex flex-col items-center shrink-0 space-y-1.5 focus:outline-none">
              <div className="relative p-[2px] rounded-full border border-gray-200">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${myPersona.color} flex items-center justify-center text-white font-bold text-sm shadow-inner`}>
                  {getInitials(myPersona.name)}
                </div>
                <div className="absolute bottom-0 right-0 bg-sky-500 text-white rounded-full p-0.5 border-2 border-white">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
              <span className="text-[10px] font-medium text-brand-gray">Your Post</span>
            </button>

            {/* Filter Indicator for Moods (Stories style) */}
            <div className="w-[1px] bg-gray-200 self-stretch my-2 shrink-0" />

            <button onClick={() => setActiveFilterMood('')} 
              className="flex flex-col items-center shrink-0 space-y-1.5 focus:outline-none">
              <div className={`p-[2.5px] rounded-full transition-all ${!activeFilterMood ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : 'bg-gray-200'}`}>
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner border border-white">
                  <span className="text-xl">✨</span>
                </div>
              </div>
              <span className={`text-[10px] font-semibold ${!activeFilterMood ? 'text-zinc-900' : 'text-brand-gray'}`}>All Posts</span>
            </button>

            {moods.map((mood) => {
              const isActive = activeFilterMood === mood.value;
              const hasPosts = posts.some(p => p.mood === mood.value);
              return (
                <button key={mood.value} onClick={() => setActiveFilterMood(isActive ? '' : mood.value)} 
                  className={`flex flex-col items-center shrink-0 space-y-1.5 focus:outline-none transition-opacity ${!hasPosts && !isActive ? 'opacity-50' : 'opacity-100'}`}>
                  <div className={`p-[2.5px] rounded-full transition-all ${isActive ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 animate-pulse' : 'bg-gray-200 hover:scale-102'}`}>
                    <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner border border-white`}>
                      <span className="text-xl">{mood.label.split(' ')[0]}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium truncate max-w-[64px] ${isActive ? 'text-zinc-900 font-semibold' : 'text-brand-gray'}`}>
                    {mood.label.split(' ').slice(1).join(' ')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* VIEW SWITCHER / TABS (Instagram Style) */}
          <div className="bg-white border border-gray-200 md:rounded-t-xl border-b-0 flex items-center justify-center text-xs font-semibold tracking-wider text-brand-gray">
            <button onClick={() => setLayout('feed')} 
              className={`flex-1 py-3.5 flex items-center justify-center gap-2 border-b-2 transition-all ${layout === 'feed' ? 'border-zinc-950 text-zinc-950' : 'border-transparent hover:text-zinc-950'}`}>
              <ImageIcon className="w-4 h-4" />
              <span>FEED VIEW</span>
            </button>
            <button onClick={() => setLayout('grid')} 
              className={`flex-1 py-3.5 flex items-center justify-center gap-2 border-b-2 transition-all ${layout === 'grid' ? 'border-zinc-950 text-zinc-950' : 'border-transparent hover:text-zinc-950'}`}>
              <Grid className="w-4 h-4" />
              <span>GRID VIEW</span>
            </button>
          </div>

          {/* POSTS FEED SECTION */}
          {layout === 'feed' ? (
            <div className="space-y-4">
              {filteredPosts.map((post, postIndex) => {
                const replies = post.replies || [];
                const isExpanded = expandedReplies.has(post.id);
                const expiryPct = getExpiryPercent(post.timestamp);
                const totalReactionsCount = getPostTotalReactions(post);
                const myLikes = reactedPosts[post.id] || [];

                return (
                  <article key={post.id} className="bg-white border border-gray-200 md:rounded-b-xl overflow-hidden shadow-sm animate-fade-in">
                    
                    {/* Time remaining top indicator */}
                    <div className="h-[2.5px] bg-gray-100 relative">
                      <div className="absolute top-0 left-0 h-full rounded-r-full transition-all duration-1000"
                        style={{ 
                          width: `${expiryPct}%`, 
                          background: expiryPct > 50 
                            ? 'linear-gradient(90deg, #10b981, #34d399)' 
                            : expiryPct > 20 
                              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' 
                              : 'linear-gradient(90deg, #ef4444, #f87171)' 
                        }} 
                      />
                    </div>

                    {/* Post Card Header */}
                    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${post.color || 'from-violet-500 to-purple-600'} flex items-center justify-center text-white text-[9px] font-bold border border-white`}>
                            {getInitials(post.name)}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-zinc-900">@{formatInstaHandle(post.name)}</span>
                            {post.mood && (
                              <span className="text-[10px] bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-full text-zinc-600 font-medium scale-90">
                                {moods.find(m => m.value === post.mood)?.label}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-brand-gray flex items-center gap-1.5">
                            <span>{timeAgo(post.timestamp)}</span>
                            <span>•</span>
                            <span className={`font-semibold ${expiryPct > 50 ? 'text-green-600' : expiryPct > 20 ? 'text-amber-600' : 'text-red-500'}`}>{getExpiryText(post.timestamp)}</span>
                          </span>
                        </div>
                      </div>
                      
                      {/* Top Right Timer Badge */}
                      <button onClick={() => copyPostLink(post.id)} className="p-1 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-zinc-800 transition-colors" title="Copy Post Link">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Graphic Box (1:1 Text Card) */}
                    <GraphicCard text={post.message} gradient={post.cardColor || post.color || 'from-violet-500 to-purple-600'} />

                    {/* Post Actions Bar */}
                    <div className="px-4 pt-3 flex items-center justify-between relative">
                      <div className="flex items-center gap-4">
                        
                        {/* Reaction/Heart Trigger button */}
                        <div className="relative">
                          <button 
                            onClick={() => handleReact(post.id, '❤️')}
                            onMouseEnter={() => setShowReactionsPopup(post.id)}
                            className={`p-1 transition-transform active:scale-90 ${myLikes.length > 0 ? 'text-red-500' : 'text-zinc-800 hover:text-zinc-600'}`}>
                            <Heart className={`w-6 h-6 ${myLikes.includes('❤️') ? 'fill-current text-red-500' : ''}`} />
                          </button>

                          {/* Float-up reactions panel on hover */}
                          {showReactionsPopup === post.id && (
                            <div 
                              onMouseLeave={() => setShowReactionsPopup(null)}
                              className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200/80 rounded-full py-1.5 px-3 shadow-xl flex items-center gap-2.5 z-30 animate-scale-up">
                              {reactions.map((r) => (
                                <button key={r.emoji} onClick={() => handleReact(post.id, r.emoji)} className="hover:scale-125 transition-transform text-lg">
                                  {r.emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)} className="p-1 text-zinc-800 hover:text-zinc-600 transition-colors">
                          <MessageCircle className="w-6 h-6" />
                        </button>
                        
                        <button onClick={() => copyPostLink(post.id)} className="p-1 text-zinc-800 hover:text-zinc-600 transition-colors">
                          <Send className="w-5 h-5" />
                        </button>
                      </div>

                      <button onClick={() => triggerToast('Post bookmarked locally!')} className="p-1 text-zinc-800 hover:text-zinc-600 transition-colors">
                        <Bookmark className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Reactions Count Panel */}
                    <div className="px-4 pt-2">
                      {totalReactionsCount > 0 ? (
                        <p className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                          <span className="flex items-center -space-x-1">
                            {Object.keys(post.reactions || {}).map(emoji => (
                              post.reactions?.[emoji] && post.reactions[emoji] > 0 ? <span key={emoji} className="text-xs leading-none">{emoji}</span> : null
                            ))}
                          </span>
                          <span>{totalReactionsCount} {totalReactionsCount === 1 ? 'reaction of support' : 'reactions of support'}</span>
                        </p>
                      ) : (
                        <p className="text-xs text-brand-gray">Be the first to show anonymous support.</p>
                      )}
                    </div>

                    {/* Caption / Mood Text details */}
                    <div className="px-4 pt-1.5 pb-2 text-xs">
                      <p className="leading-relaxed">
                        <span className="font-bold mr-2">@{formatInstaHandle(post.name)}</span>
                        <span className="text-zinc-800 italic">Anonymous card posted in the community. </span>
                        {post.mood && (
                          <span className="text-brand-gray font-medium">Currently feeling {moods.find(m => m.value === post.mood)?.label.split(' ').slice(1).join(' ')}.</span>
                        )}
                      </p>
                    </div>

                    {/* Comments Toggle and Collapsed List */}
                    {replies.length > 0 && (
                      <div className="px-4 pb-2">
                        <button onClick={() => toggleReplies(post.id)} className="text-xs text-brand-gray font-semibold hover:text-zinc-950 mb-2 block">
                          {isExpanded ? 'Hide comments' : `View all ${replies.length} comments`}
                        </button>

                        {isExpanded && (
                          <div className="space-y-3 pt-1 border-t border-gray-50 max-h-[220px] overflow-y-auto pr-1">
                            {replies.map((reply: any, ri: number) => (
                              <div key={ri} className="flex gap-2.5 text-xs py-1 animate-fade-in items-start">
                                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${reply.color || 'from-blue-500 to-indigo-600'} flex items-center justify-center text-white text-[8px] font-bold shrink-0 shadow-sm`}>
                                  {getInitials(reply.name)}
                                </div>
                                <div className="flex-1 min-w-0 leading-tight">
                                  <p>
                                    <span className="font-bold mr-1.5">@{formatInstaHandle(reply.name)}</span>
                                    <span className="text-zinc-800">{reply.message}</span>
                                  </p>
                                  <span className="text-[9px] text-brand-gray block mt-0.5">{timeAgo(reply.timestamp)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add Inline Comment Box */}
                    <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-1">
                        <SmilePlus className="w-5 h-5 text-gray-400 shrink-0" />
                        <input 
                          type="text" 
                          placeholder="Add a comment anonymously..."
                          value={replyingTo === post.id ? replyText : ''}
                          onChange={(e) => { setReplyingTo(post.id); setReplyText(e.target.value); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleReply(post.id, replyText); }}
                          className="w-full text-xs text-brand-black placeholder:text-gray-400 bg-transparent border-0 focus:outline-none py-1"
                        />
                      </div>
                      <button 
                        onClick={() => handleReply(post.id, replyText)}
                        disabled={replyingTo !== post.id || !replyText.trim()}
                        className={`text-xs font-bold shrink-0 transition-colors ${replyingTo === post.id && replyText.trim() ? 'text-sky-500 hover:text-sky-600' : 'text-sky-200 cursor-default'}`}>
                        Post
                      </button>
                    </div>

                  </article>
                );
              })}

              {filteredPosts.length === 0 && (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-xl px-5">
                  <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                    <ImageIcon className="w-6 h-6 text-brand-gray" />
                  </div>
                  <h3 className="font-instrument text-lg text-brand-black mb-1">No posts found</h3>
                  <p className="text-xs text-brand-gray max-w-xs mx-auto">Be the first to share an anonymous story or update for this mood filter.</p>
                </div>
              )}
            </div>
          ) : (
            
            /* GRID GALLERY VIEW (Instagram Profile Style) */
            <div className="grid grid-cols-3 gap-[2px] md:gap-4 pb-12">
              {filteredPosts.map((post) => {
                const totalReactionsCount = getPostTotalReactions(post);
                const replies = post.replies || [];
                return (
                  <div 
                    key={post.id} 
                    onClick={() => setActiveLightboxPost(post)}
                    className="aspect-square w-full bg-zinc-950 relative cursor-pointer group select-none overflow-hidden md:rounded-xl shadow-sm border border-gray-100">
                    
                    {/* Gradient preview graphic */}
                    <div className={`w-full h-full bg-gradient-to-tr ${post.cardColor || post.color || 'from-violet-500 to-purple-600'} flex items-center justify-center p-3 text-center text-white text-[8px] md:text-xs font-medium`}>
                      <p className="line-clamp-4 font-instrument text-center font-semibold scale-90">
                        {post.message}
                      </p>
                    </div>

                    {/* Instagram Hover Icons overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-3 md:gap-6 text-white text-xs md:text-sm font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        <span>{totalReactionsCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        <span>{replies.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredPosts.length === 0 && (
                <div className="col-span-3 text-center py-20 bg-white border border-gray-200 rounded-xl px-5">
                  <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                    <Grid className="w-6 h-6 text-brand-gray" />
                  </div>
                  <h3 className="font-instrument text-lg text-brand-black mb-1">Grid is empty</h3>
                  <p className="text-xs text-brand-gray max-w-xs mx-auto">No posts created under this category yet.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: DESKTOP SUGGESTIONS PANEL */}
        <div className="hidden lg:block w-[310px] sticky top-[100px] h-fit pl-6 pr-2 shrink-0">
          <div className="space-y-6">
            
            {/* User identity profile header */}
            <div className="flex items-center gap-3 bg-white p-3.5 border border-gray-200 rounded-xl shadow-sm">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${myPersona.color} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                {getInitials(myPersona.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-brand-black">@{formatInstaHandle(myPersona.name)}</p>
                <p className="text-[10px] text-brand-gray truncate">Anonymous identity</p>
              </div>
              <button 
                onClick={handleResetPersona}
                className="text-[10px] font-bold text-sky-500 hover:text-sky-600 active:scale-95 transition-all">
                Reset
              </button>
            </div>

            {/* Trending Moods / Filter shortcuts */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-semibold text-brand-gray">Mood Trends</span>
                <span className="text-[10px] text-zinc-950 font-bold">Suggested Filters</span>
              </div>

              <div className="space-y-2 bg-white p-3.5 border border-gray-200 rounded-xl shadow-sm">
                {moods.slice(0, 5).map((m) => (
                  <div key={m.value} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-zinc-50 border border-zinc-100 p-1 rounded-lg">{m.label.split(' ')[0]}</span>
                      <span className="font-semibold text-brand-black">{m.label.split(' ').slice(1).join(' ')}</span>
                    </div>
                    <button 
                      onClick={() => setActiveFilterMood(activeFilterMood === m.value ? '' : m.value)}
                      className={`text-[10px] font-bold transition-all ${activeFilterMood === m.value ? 'text-rose-500' : 'text-sky-500 hover:text-sky-600'}`}>
                      {activeFilterMood === m.value ? 'Filtered' : 'Filter'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Statistics summary */}
            <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm space-y-3">
              <span className="text-xs font-semibold text-brand-gray block border-b border-gray-100 pb-1.5">Community Stats</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <Flame className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                  <p className="text-sm font-bold text-brand-black">{posts.length}</p>
                  <p className="text-[8px] text-brand-gray uppercase">Active</p>
                </div>
                <div>
                  <Heart className="w-4 h-4 mx-auto text-red-500 mb-1" />
                  <p className="text-sm font-bold text-brand-black">{totalReactions}</p>
                  <p className="text-[8px] text-brand-gray uppercase">Support</p>
                </div>
                <div>
                  <MessageCircle className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                  <p className="text-sm font-bold text-brand-black">{totalReplies}</p>
                  <p className="text-[8px] text-brand-gray uppercase">Replies</p>
                </div>
              </div>
            </div>

            {/* Small Footer copyright notes */}
            <div className="px-1 text-[10px] text-brand-gray leading-relaxed space-y-2">
              <p className="hover:underline cursor-pointer">About • Guidelines • FAQ • Safety Center • Terms • Privacy</p>
              <p className="font-semibold uppercase tracking-wider text-[8px]">© 2026 Brainheal Online Community</p>
            </div>

          </div>
        </div>

      </div>

      {/* INSTAGRAM POST LIGHTBOX OVERLAY (Click grid square post) */}
      {activeLightboxPost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          {/* Lightbox container */}
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[95vh] md:h-[600px] overflow-hidden flex flex-col md:flex-row relative animate-scale-up">
            
            {/* Top Close Button (for small screen layout mostly) */}
            <button 
              onClick={() => setActiveLightboxPost(null)}
              className="absolute top-4 right-4 md:hidden bg-zinc-950/60 p-1.5 rounded-full text-white z-50">
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Graphic Image display */}
            <div className="w-full md:w-3/5 bg-zinc-950 flex items-center justify-center relative overflow-hidden select-none border-r border-gray-100">
              <GraphicCard text={activeLightboxPost.message} gradient={activeLightboxPost.cardColor || activeLightboxPost.color || 'from-violet-500 to-purple-600'} mode="lightbox" />
            </div>

            {/* Right Column: Comments & Interaction Info panel */}
            <div className="w-full md:w-2/5 flex flex-col h-[40%] md:h-full bg-white">
              
              {/* Header Info */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeLightboxPost.color} flex items-center justify-center text-white text-[9px] font-bold shadow-inner`}>
                    {getInitials(activeLightboxPost.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-950">@{formatInstaHandle(activeLightboxPost.name)}</p>
                    <p className="text-[9px] text-zinc-400">Anonymous support group</p>
                  </div>
                </div>
                
                {/* Desktop Close trigger */}
                <button onClick={() => setActiveLightboxPost(null)} className="hidden md:block p-1 text-zinc-400 hover:text-zinc-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable feed inside lightbox */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Original Post content / Caption first */}
                <div className="flex gap-2.5 items-start text-xs border-b border-gray-50 pb-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeLightboxPost.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                    {getInitials(activeLightboxPost.name)}
                  </div>
                  <div className="leading-relaxed">
                    <p>
                      <span className="font-bold mr-1.5">@{formatInstaHandle(activeLightboxPost.name)}</span>
                      <span className="text-zinc-700 italic">Posted an anonymous graphic card.</span>
                    </p>
                    {activeLightboxPost.mood && (
                      <span className="inline-block mt-1 text-[10px] bg-zinc-50 border border-zinc-150 px-2 py-0.5 rounded-full text-zinc-600 font-medium">
                        {moods.find(m => m.value === activeLightboxPost.mood)?.label}
                      </span>
                    )}
                    <span className="text-[9px] text-brand-gray block mt-1">{timeAgo(activeLightboxPost.timestamp)}</span>
                  </div>
                </div>

                {/* Sub-Replies listing */}
                <div className="space-y-3.5">
                  {(activeLightboxPost.replies || []).map((reply: any, ri: number) => (
                    <div key={ri} className="flex gap-2.5 text-xs items-start animate-fade-in">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${reply.color || 'from-blue-500 to-indigo-600'} flex items-center justify-center text-white text-[8px] font-bold shrink-0`}>
                        {getInitials(reply.name)}
                      </div>
                      <div className="leading-tight flex-1">
                        <p>
                          <span className="font-bold mr-1.5">@{formatInstaHandle(reply.name)}</span>
                          <span className="text-zinc-800">{reply.message}</span>
                        </p>
                        <span className="text-[9px] text-brand-gray block mt-0.5">{timeAgo(reply.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                  {(activeLightboxPost.replies || []).length === 0 && (
                    <p className="text-[10px] text-brand-gray text-center py-6">No comments yet. Write a supportive comment below.</p>
                  )}
                </div>

              </div>

              {/* Action Toolbar panel */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleReact(activeLightboxPost.id, '❤️')} className="text-zinc-800 hover:text-red-500 transition-colors">
                      <Heart className={`w-6 h-6 ${(reactedPosts[activeLightboxPost.id] || []).includes('❤️') ? 'fill-current text-red-500' : ''}`} />
                    </button>
                    <button onClick={() => copyPostLink(activeLightboxPost.id)} className="text-zinc-800 hover:text-sky-500 transition-colors">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <span className={`text-[10px] font-semibold ${getExpiryPercent(activeLightboxPost.timestamp) > 50 ? 'text-green-600' : 'text-rose-500'}`}>
                    {getExpiryText(activeLightboxPost.timestamp)}
                  </span>
                </div>

                <div className="text-xs font-bold text-zinc-950">
                  {getPostTotalReactions(activeLightboxPost)} reactions of support
                </div>
              </div>

              {/* Footer comment post input */}
              <div className="border-t border-gray-100 p-3 bg-white flex items-center gap-2">
                <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleReply(activeLightboxPost.id, replyText); }}
                  placeholder="Add a comment anonymously..."
                  className="w-full text-xs placeholder:text-gray-400 bg-transparent border-0 focus:outline-none py-1.5"
                />
                <button 
                  onClick={() => handleReply(activeLightboxPost.id, replyText)}
                  disabled={!replyText.trim()}
                  className={`text-xs font-bold ${replyText.trim() ? 'text-sky-500 hover:text-sky-600' : 'text-sky-200 cursor-default'}`}>
                  Post
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CREATE POST MODAL WITH REAL-TIME CANVAS PREVIEW */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col md:flex-row animate-scale-up">
            
            {/* Left Preview Box (Desktop) */}
            <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200/60 relative">
              <span className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-wider text-brand-gray bg-white border border-gray-100 px-2.5 py-1 rounded-full shadow-sm">
                Card Live Preview
              </span>
              
              <div className="w-full max-w-[280px] aspect-square rounded-xl overflow-hidden shadow-md border border-gray-200/80 bg-zinc-950 mt-4">
                <GraphicCard text={newMessage} gradient={selectedCardColor} />
              </div>
            </div>

            {/* Right Editor Inputs */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full">
              <div className="space-y-4">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center pb-2 border-b border-gray-150">
                  <span className="text-sm font-bold text-zinc-950">Create Anonymous Post</span>
                  <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-brand-gray hover:text-zinc-800 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Persona Identifier */}
                <div className="flex items-center gap-2.5 py-1">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${myPersona.color} flex items-center justify-center text-white text-[8px] font-bold shadow-sm`}>
                    {getInitials(myPersona.name)}
                  </div>
                  <span className="text-xs font-bold text-brand-black">@{formatInstaHandle(myPersona.name)}</span>
                  <span className="text-[10px] text-zinc-400">(Anonymous)</span>
                </div>

                {/* Main Message Text area input */}
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share what is on your mind anonymously... (Posts automatically expire in 24 hours)"
                  maxLength={500}
                  rows={4}
                  className="w-full text-xs md:text-sm font-sans placeholder:text-gray-400 bg-zinc-50 focus:bg-white border border-gray-150 rounded-xl p-3.5 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 resize-none transition-all"
                />
                
                {/* Character Limit */}
                <div className="text-right text-[10px] text-brand-gray">
                  {newMessage.length} / 500 characters
                </div>

                {/* Mood Select Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gray block">Associate a Mood</span>
                  <div className="flex flex-wrap gap-1.5">
                    {moods.map((mood) => {
                      const isSelected = selectedMood === mood.value;
                      return (
                        <button 
                          type="button" 
                          key={mood.value}
                          onClick={() => setSelectedMood(isSelected ? '' : mood.value)}
                          className={`px-2.5 py-1.5 rounded-full text-[10px] font-semibold border transition-all ${isSelected ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white hover:bg-gray-50 border-gray-200 text-brand-gray'}`}>
                          {mood.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Background Gradient Color Swatches */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gray block">Select Background style</span>
                  <div className="flex flex-wrap gap-2.5">
                    {cardGradients.map((g) => {
                      const isSelected = selectedCardColor === g;
                      return (
                        <button 
                          type="button" 
                          key={g}
                          onClick={() => setSelectedCardColor(g)}
                          className={`w-6 h-6 rounded-full bg-gradient-to-tr ${g} shadow-sm border transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-zinc-950 scale-110' : 'border-transparent hover:scale-105'}`}
                        />
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action triggers */}
              <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-gray-200 text-brand-black hover:bg-gray-50 font-bold py-2.5 px-4 rounded-xl text-center text-xs active:scale-98 transition-all">
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className={`flex-1 text-white font-bold py-2.5 px-4 rounded-xl text-center text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all ${newMessage.trim() && !sending ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-100'}`}>
                  {sending ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Anonymously</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* GUIDELINES SIDE CARD MODAL (Desktop menu trigger or Mobile Header Info) */}
      {showGuidelines && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden p-6 relative animate-scale-up space-y-4">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Safety Guidelines</span>
              </span>
              <button onClick={() => setShowGuidelines(false)} className="p-1 rounded-full hover:bg-gray-100 text-brand-gray">
                <X className="w-4 h-4" />
              </button>
            </div>

            <ul className="space-y-3.5 text-xs text-brand-gray leading-relaxed">
              <li className="flex gap-2">
                <span className="text-emerald-500">✦</span> 
                <span><strong>100% Anonymous:</strong> Your profile handles are randomized session pseudonyms (e.g. brave_lotus). Your real identity is never saved or shown.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">✦</span> 
                <span><strong>24-Hour Lifespan:</strong> Posts automatically vanish from the network exactly 24 hours after publishing to keep discussions clean and safe.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">✦</span> 
                <span><strong>Kindness Mandate:</strong> Please be supportive, warm, and show empathy. Aggressive, hateful, or abusive posts will be deleted.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">✦</span> 
                <span><strong>No Personal Info:</strong> Do not write phone numbers, email IDs, or names to maintain absolute anonymity.</span>
              </li>
            </ul>

            <button 
              onClick={() => setShowGuidelines(false)}
              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl text-center text-xs active:scale-98 transition-all">
              Got It, Thank You
            </button>
          </div>
        </div>
      )}

      {/* Global CSS Inject Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        /* Scrollbar hides */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.15);
          border-radius: 9999px;
        }
      `}</style>

    </div>
  );
}

