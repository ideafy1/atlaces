import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, orderBy, query, doc, updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Heart, Send, MessageCircle, Shield, Clock, ChevronDown, ChevronUp, Flame, SmilePlus, TrendingUp, Users, Sparkles } from 'lucide-react';

const adjectives = ['Gentle', 'Brave', 'Calm', 'Kind', 'Quiet', 'Warm', 'Bright', 'Bold', 'Free', 'Wise', 'Soft', 'True', 'Wild', 'Pure', 'Deep', 'Still', 'Open', 'Clear', 'Strong', 'Light'];
const nouns = ['Phoenix', 'Lotus', 'River', 'Cloud', 'Moon', 'Star', 'Wave', 'Leaf', 'Petal', 'Dawn', 'Sky', 'Flame', 'Stone', 'Breeze', 'Rain', 'Pearl', 'Frost', 'Spark', 'Echo', 'Bloom'];
const avatarColors = [
  'from-violet-500 to-purple-600', 'from-rose-500 to-pink-600', 'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600', 'from-blue-500 to-indigo-600', 'from-cyan-500 to-sky-600',
  'from-fuchsia-500 to-pink-600', 'from-lime-500 to-green-600',
];

const moods = [
  { label: '😔 Feeling low', value: 'low' },
  { label: '😰 Anxious', value: 'anxious' },
  { label: '🙏 Grateful', value: 'grateful' },
  { label: '💪 Hopeful', value: 'hopeful' },
  { label: '😤 Frustrated', value: 'frustrated' },
  { label: '🌱 Growing', value: 'growing' },
  { label: '💭 Reflecting', value: 'reflecting' },
  { label: '🤗 Need support', value: 'support' },
];

const reactions = [
  { emoji: '❤️', label: 'Love' },
  { emoji: '🤗', label: 'Hug' },
  { emoji: '💪', label: 'Strength' },
  { emoji: '🙏', label: 'Support' },
];

function getRandomName() { return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`; }
function getRandomColor() { return avatarColors[Math.floor(Math.random() * avatarColors.length)]; }
function getInitials(name: string) { return (name || 'A').split(' ').map(w => w[0]).join('').toUpperCase(); }

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
  id: string; name: string; color: string; message: string; mood?: string;
  reactions?: Record<string, number>; replies?: Array<{ name: string; color: string; message: string; timestamp: any }>;
  timestamp: any;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [showMoods, setShowMoods] = useState(false);
  const [sending, setSending] = useState(false);
  const [reactedPosts, setReactedPosts] = useState<Record<string, string[]>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [, setTick] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'community'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const now = Date.now();
      const p: Post[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)).filter(p => !p.timestamp?.toDate || (now - p.timestamp.toDate().getTime()) < 86400000);
      setPosts(p);
    }, (err) => console.warn('Community error:', err));
    const saved = localStorage.getItem('brainheal_reacted');
    if (saved) setReactedPosts(JSON.parse(saved));
    return () => unsub();
  }, []);

  useEffect(() => { const i = setInterval(() => setTick(t => t + 1), 60000); return () => clearInterval(i); }, []);

  const handleSend = async () => {
    const msg = newMessage.trim();
    if (!msg || sending) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'community'), { name: getRandomName(), color: getRandomColor(), message: msg, mood: selectedMood || '', reactions: { '❤️': 0, '🤗': 0, '💪': 0, '🙏': 0 }, replies: [], timestamp: serverTimestamp() });
      setNewMessage(''); setSelectedMood(''); setShowMoods(false);
    } catch (e) { console.error('Post error:', e); }
    finally { setSending(false); }
  };

  const handleReact = async (postId: string, emoji: string) => {
    const pr = reactedPosts[postId] || [];
    if (pr.includes(emoji)) return;
    const updated = { ...reactedPosts, [postId]: [...pr, emoji] };
    setReactedPosts(updated);
    localStorage.setItem('brainheal_reacted', JSON.stringify(updated));
    try { await updateDoc(doc(db, 'community', postId), { [`reactions.${emoji}`]: (posts.find(p => p.id === postId)?.reactions?.[emoji] || 0) + 1 }); } catch (e) { console.warn(e); }
  };

  const handleReply = async (postId: string) => {
    const msg = replyText.trim();
    if (!msg) return;
    try { await updateDoc(doc(db, 'community', postId), { replies: arrayUnion({ name: getRandomName(), color: getRandomColor(), message: msg, timestamp: Timestamp.now() }) }); setReplyText(''); setReplyingTo(null); setExpandedReplies(prev => new Set(prev).add(postId)); } catch (e) { console.error(e); }
  };

  const toggleReplies = (id: string) => { setExpandedReplies(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

  const totalReactions = posts.reduce((sum, p) => sum + Object.values(p.reactions || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0), 0);
  const totalReplies = posts.reduce((sum, p) => sum + (p.replies?.length || 0), 0);
  const moodLabel = moods.find(m => m.value === selectedMood)?.label;
  const postMoodLabel = (val: string) => moods.find(m => m.value === val)?.label || '';

  // Sidebar component (desktop only)
  const Sidebar = () => (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-[140px] space-y-5">
        {/* Stats cards */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-instrument text-lg text-brand-black mb-4">Community pulse</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Flame className="w-5 h-5 text-orange-500" /></div>
              <div><p className="text-xl font-bold text-brand-black">{posts.length}</p><p className="text-[11px] text-brand-gray">Active posts</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><Heart className="w-5 h-5 text-red-500" /></div>
              <div><p className="text-xl font-bold text-brand-black">{totalReactions}</p><p className="text-[11px] text-brand-gray">Reactions sent</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-blue-500" /></div>
              <div><p className="text-xl font-bold text-brand-black">{totalReplies}</p><p className="text-[11px] text-brand-gray">Replies</p></div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-violet-600" />
            <h3 className="font-semibold text-sm text-violet-800">Safe space guidelines</h3>
          </div>
          <ul className="space-y-2 text-xs text-violet-700 leading-relaxed">
            <li className="flex gap-2"><span>✦</span> Be kind and supportive</li>
            <li className="flex gap-2"><span>✦</span> Your identity is 100% hidden</li>
            <li className="flex gap-2"><span>✦</span> Posts vanish after 24 hours</li>
            <li className="flex gap-2"><span>✦</span> No personal information</li>
            <li className="flex gap-2"><span>✦</span> React with empathy</li>
          </ul>
        </div>

        {/* Trending moods */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-brand-gray" />
            <h3 className="font-semibold text-sm text-brand-black">Trending moods</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {moods.slice(0, 5).map(m => (
              <span key={m.value} className="px-3 py-1.5 rounded-full bg-gray-50 text-[11px] font-medium text-brand-gray border border-gray-100">{m.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 md:pb-12">
      {/* Header */}
      <div className="bg-white sticky top-0 md:top-[73px] z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-instrument tracking-tight text-brand-black">
                Community <span className="italic text-brand-gray">space</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-600" /><span className="text-[10px] text-green-700 font-semibold">Anonymous</span></div>
                <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-600" /><span className="text-[10px] text-amber-700 font-semibold">Posts vanish in 24h</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-bold text-brand-black">{posts.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - with sidebar on desktop */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-5 flex gap-8">
        {/* Feed column */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Compose */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm focus-within:border-brand-black focus-within:shadow-md transition-all duration-300">
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="What's on your mind? You're anonymous here..."
              rows={3}
              maxLength={500}
              className="w-full px-5 pt-4 pb-1 text-sm md:text-base font-inter text-brand-black placeholder:text-gray-400 resize-none focus:outline-none bg-transparent"
            />
            {selectedMood && (
              <div className="px-5 pb-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-[11px] font-semibold border border-violet-100">
                  {moodLabel}
                  <button onClick={() => setSelectedMood('')} className="ml-1 text-violet-400 hover:text-violet-600">×</button>
                </span>
              </div>
            )}
            {showMoods && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {moods.map(m => (
                  <button key={m.value} onClick={() => { setSelectedMood(m.value); setShowMoods(false); }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-200 ${selectedMood === m.value ? 'bg-brand-black text-white border-brand-black' : 'bg-gray-50 text-brand-gray border-gray-200 hover:border-gray-400'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-2">
                <button onClick={() => setShowMoods(!showMoods)} className={`p-1.5 rounded-lg transition-colors ${showMoods ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:bg-gray-100'}`}><SmilePlus className="w-4 h-4" /></button>
                <span className="text-[10px] text-gray-400">{newMessage.length}/500</span>
              </div>
              <button onClick={handleSend} disabled={!newMessage.trim() || sending}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${newMessage.trim() ? 'bg-brand-black text-white shadow-sm hover:shadow-md active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                {sending ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Share
              </button>
            </div>
          </div>

          {/* Posts */}
          {posts.map((post, i) => {
            const repliesArr = post.replies || [];
            const isExpanded = expandedReplies.has(post.id);
            const expiryPct = getExpiryPercent(post.timestamp);

            return (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                style={{ animation: i < 5 ? `fadeSlideUp 0.4s ease-out ${i * 0.06}s both` : 'none' }}>
                {/* Expiry bar */}
                <div className="h-[3px] bg-gray-100 relative">
                  <div className="absolute top-0 left-0 h-full rounded-r-full transition-all duration-1000"
                    style={{ width: `${expiryPct}%`, background: expiryPct > 50 ? 'linear-gradient(90deg, #10b981, #34d399)' : expiryPct > 20 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)' }} />
                </div>

                <div className="p-5 md:p-6 pb-4">
                  {/* Author */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${post.color || 'from-violet-500 to-purple-600'} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-[11px] md:text-xs font-bold">{getInitials(post.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-brand-black">{post.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-brand-gray">{timeAgo(post.timestamp)}</span>
                        <span className="text-[10px] text-brand-gray">·</span>
                        <span className={`text-[10px] font-semibold ${expiryPct > 50 ? 'text-green-600' : expiryPct > 20 ? 'text-amber-600' : 'text-red-500'}`}>{getExpiryText(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  {post.mood && <div className="mb-2 pl-12 md:pl-[52px]"><span className="inline-block px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-semibold border border-violet-100">{postMoodLabel(post.mood)}</span></div>}

                  <p className="text-sm md:text-base text-brand-black leading-relaxed font-inter pl-12 md:pl-[52px]">{post.message}</p>

                  {/* Reactions */}
                  <div className="flex items-center gap-2 mt-4 pl-12 md:pl-[52px] flex-wrap">
                    {reactions.map(r => {
                      const count = post.reactions?.[r.emoji] || 0;
                      const reacted = (reactedPosts[post.id] || []).includes(r.emoji);
                      return (
                        <button key={r.emoji} onClick={() => handleReact(post.id, r.emoji)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-300 ${reacted ? 'bg-gray-100 border-gray-300 scale-105' : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50 active:scale-95'}`}>
                          <span className="text-sm">{r.emoji}</span>
                          {count > 0 && <span className="text-brand-gray">{count}</span>}
                        </button>
                      );
                    })}
                    <button onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 ml-auto">
                      <MessageCircle className="w-3 h-3" /><span>{repliesArr.length || ''}</span>
                    </button>
                  </div>

                  {/* Reply input */}
                  {replyingTo === post.id && (
                    <div className="mt-3 pl-12 md:pl-[52px] flex gap-2 items-center">
                      <input autoFocus value={replyText} onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleReply(post.id); } }}
                        placeholder="Reply anonymously..." maxLength={300}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs md:text-sm font-inter focus:outline-none focus:border-brand-black transition-colors" />
                      <button onClick={() => handleReply(post.id)} disabled={!replyText.trim()}
                        className={`p-2.5 rounded-xl transition-all ${replyText.trim() ? 'bg-brand-black text-white active:scale-90' : 'bg-gray-100 text-gray-400'}`}>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Replies */}
                  {repliesArr.length > 0 && (
                    <div className="mt-3 pl-12 md:pl-[52px]">
                      <button onClick={() => toggleReplies(post.id)} className="flex items-center gap-1 text-[11px] font-semibold text-brand-gray hover:text-brand-black transition-colors mb-2">
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {repliesArr.length} {repliesArr.length === 1 ? 'reply' : 'replies'}
                      </button>
                      {isExpanded && (
                        <div className="space-y-2">
                          {repliesArr.map((reply: any, ri: number) => (
                            <div key={ri} className="flex gap-2.5 py-2 border-l-2 border-gray-200 pl-3">
                              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${reply.color || 'from-blue-500 to-indigo-600'} flex items-center justify-center flex-shrink-0`}>
                                <span className="text-white text-[8px] font-bold">{getInitials(reply.name)}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2"><span className="text-[11px] font-semibold text-brand-black">{reply.name}</span><span className="text-[10px] text-brand-gray">{timeAgo(reply.timestamp)}</span></div>
                                <p className="text-xs text-brand-gray mt-0.5 leading-relaxed">{reply.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4"><MessageCircle className="w-8 h-8 text-white" /></div>
              <h3 className="font-instrument text-xl text-brand-black mb-2">You're not alone.</h3>
              <p className="text-sm text-brand-gray max-w-xs mx-auto leading-relaxed">Share what's on your mind, anonymously. Posts vanish after 24 hours.</p>
            </div>
          )}
        </div>

        {/* Desktop sidebar */}
        <Sidebar />
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
