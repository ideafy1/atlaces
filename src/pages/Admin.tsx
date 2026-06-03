import React, { useState, useEffect } from 'react';
import { useData } from '../DataContext';
import { doc, setDoc, collection, onSnapshot, deleteDoc, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Brain, MessageCircle, Trash2, Plus, Save, Eye, Shield, AlertTriangle, X, ChevronDown, ChevronUp, Edit3, CheckCircle, XCircle, Clock, CreditCard, Video } from 'lucide-react';

// Types
interface Therapist {
  id?: string; name: string; title: string; credentials: string; experience: string;
  rating: number; reviews: number; price: number; image: string; available: string;
  online: boolean; languages: string[]; specialties: string[]; bio?: string; telegramId?: string;
  instagramUrl?: string; linkedinUrl?: string; email?: string; twitterUrl?: string; education?: string; approach?: string; quote?: string;
  slug?: string; meetLink?: string;
}

interface CommunityPost {
  id: string; name: string; color: string; message: string; mood: string;
  reactions: Record<string, number>; replies: any[]; timestamp: any;
}

const emptyTherapist: Therapist = {
  name: '', title: '', credentials: '', experience: '', rating: 4.8,
  reviews: 0, price: 1500, image: '', available: 'Available Today',
  online: true, languages: ['English', 'Hindi'], specialties: [], bio: '', telegramId: '',
  instagramUrl: '', linkedinUrl: '', email: '', twitterUrl: '', education: '', approach: '', quote: '',
  slug: '', meetLink: '',
};

const tabs = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', Icon: CreditCard },
  { id: 'therapists', label: 'Therapists', Icon: Brain },
  { id: 'community', label: 'Community', Icon: MessageCircle },
  { id: 'applications', label: 'Applications', Icon: Users },
  { id: 'content', label: 'Website Content', Icon: Edit3 },
];

export default function Admin() {
  const { data, setData } = useData();
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formData, setFormData] = useState<any>(data);
  const [saving, setSaving] = useState(false);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [showTherapistForm, setShowTherapistForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '5941') {
      setIsAuthenticated(true);
      setFormData(data);
    } else {
      alert('Incorrect PIN');
    }
  };

  // Load therapists from data
  useEffect(() => {
    if (isAuthenticated && data?.therapyPage?.therapists) {
      setTherapists(data.therapyPage.therapists);
    }
  }, [isAuthenticated, data]);

  // Load community posts real-time
  useEffect(() => {
    if (!isAuthenticated) return;
    const q = query(collection(db, 'community'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const posts: CommunityPost[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as CommunityPost));
      setCommunityPosts(posts);
    });
    return () => unsub();
  }, [isAuthenticated]);

  // Load applications
  useEffect(() => {
    if (!isAuthenticated) return;
    const q = query(collection(db, 'therapist_applications'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setApplications(apps);
    });
    return () => unsub();
  }, [isAuthenticated]);

  // Load bookings
  useEffect(() => {
    if (!isAuthenticated) return;
    const q = query(collection(db, 'bookings'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const b = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setBookings(b);
    });
    return () => unsub();
  }, [isAuthenticated]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Save website content
  const handleSaveContent = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'website', 'content'), formData);
      setData(formData);
      showSuccess('Website content saved!');
    } catch (error) {
      alert('Error saving: ' + error);
    }
    setSaving(false);
  };

  // Save therapist (add or edit)
  const handleSaveTherapist = async (therapist: Therapist) => {
    const updatedList = editingTherapist
      ? therapists.map(t => (t.name === editingTherapist.name ? therapist : t))
      : [...therapists, therapist];
    
    setTherapists(updatedList);
    const newData = { ...formData, therapyPage: { ...formData.therapyPage, therapists: updatedList } };
    setFormData(newData);
    
    try {
      await setDoc(doc(db, 'website', 'content'), newData);
      setData(newData);
      showSuccess(editingTherapist ? 'Therapist updated!' : 'Therapist added!');
    } catch (e) {
      alert('Error: ' + e);
    }
    setShowTherapistForm(false);
    setEditingTherapist(null);
  };

  // Delete therapist
  const handleDeleteTherapist = async (index: number) => {
    if (!confirm('Delete this therapist?')) return;
    const updatedList = therapists.filter((_, i) => i !== index);
    setTherapists(updatedList);
    const newData = { ...formData, therapyPage: { ...formData.therapyPage, therapists: updatedList } };
    setFormData(newData);
    try {
      await setDoc(doc(db, 'website', 'content'), newData);
      setData(newData);
      showSuccess('Therapist deleted');
    } catch (e) { alert('Error: ' + e); }
  };

  // Delete community post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'community', postId));
      showSuccess('Post deleted');
    } catch (e) { alert('Error: ' + e); }
  };

  // Delete all expired posts
  const handleCleanupPosts = async () => {
    const now = Date.now();
    const expired = communityPosts.filter(p => p.timestamp?.toDate && (now - p.timestamp.toDate().getTime()) >= 86400000);
    if (expired.length === 0) { showSuccess('No expired posts to clean'); return; }
    if (!confirm(`Delete ${expired.length} expired post(s)?`)) return;
    for (const p of expired) { await deleteDoc(doc(db, 'community', p.id)); }
    showSuccess(`${expired.length} expired posts cleaned`);
  };

  // Update application status
  const handleUpdateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'therapist_applications', appId), { status: newStatus });
      showSuccess(`Application marked as ${newStatus}`);
    } catch (e) {
      alert('Error updating status: ' + e);
    }
  };

  // Content editor helper
  const renderFields = (obj: any, path: string[]) => {
    if (Array.isArray(obj)) {
      return (
        <div className="ml-4 border-l-2 border-gray-200 pl-4 my-2">
          {obj.map((item, index) => (
            <div key={index} className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="font-semibold text-gray-400 mb-2 text-xs">Item {index + 1}</div>
              {renderFields(item, [...path, index.toString()])}
            </div>
          ))}
        </div>
      );
    } else if (typeof obj === 'object' && obj !== null) {
      return (
        <div className="ml-4 border-l-2 border-gray-200 pl-4 my-2">
          {Object.keys(obj).map((key) => (
            <div key={key} className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 capitalize mb-1">{key}</label>
              {renderFields(obj[key], [...path, key])}
            </div>
          ))}
        </div>
      );
    } else if (typeof obj === 'boolean') {
      return (
        <input type="checkbox" checked={obj}
          onChange={(e) => {
            setFormData((prev: any) => {
              const d = JSON.parse(JSON.stringify(prev));
              let c = d; for (let i = 0; i < path.length - 1; i++) c = c[path[i]];
              c[path[path.length - 1]] = e.target.checked; return d;
            });
          }}
          className="w-5 h-5 accent-brand-black"
        />
      );
    } else {
      const handleChange = (e: any) => {
        setFormData((prev: any) => {
          const d = JSON.parse(JSON.stringify(prev));
          let c = d; for (let i = 0; i < path.length - 1; i++) c = c[path[i]];
          c[path[path.length - 1]] = e.target.value; return d;
        });
      };
      const isLong = typeof obj === 'string' && obj.length > 50;
      return isLong ? (
        <textarea value={obj} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 min-h-[80px] text-sm focus:border-brand-black focus:outline-none transition-colors" />
      ) : (
        <input type="text" value={obj} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-brand-black focus:outline-none transition-colors" />
      );
    }
  };

  // Format time
  const formatTime = (ts: any) => {
    if (!ts?.toDate) return 'Unknown';
    const d = ts.toDate();
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const isExpired = (ts: any) => {
    if (!ts?.toDate) return false;
    return (Date.now() - ts.toDate().getTime()) >= 86400000;
  };

  // ---- PIN SCREEN ----
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form onSubmit={handlePinSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center border border-gray-100">
          <img src="/logo.png" alt="BrainHeal" className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
          <div className="font-instrument text-3xl mb-1 text-brand-black">Admin Panel</div>
          <p className="text-gray-500 text-sm mb-8">Enter your secure access code</p>
          <input
            type="password" maxLength={4} value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="----"
            className="w-full text-center text-4xl tracking-[1em] border border-gray-300 rounded-xl p-4 mb-6 focus:outline-none focus:border-brand-black transition-colors"
          />
          <button type="submit" className="w-full bg-brand-black text-white rounded-xl py-4 font-medium hover:scale-[1.02] transition-transform">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  // ---- ADMIN PANEL ----
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-[9999] bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2" style={{ animation: 'fadeSlideIn 0.3s ease' }}>
          <div className="w-2 h-2 rounded-full bg-white" /> {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-brand-black text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-instrument text-xl">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition flex items-center gap-1">
              <Eye className="w-4 h-4" /> View Site
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-16">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-black text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.Icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-[10px] font-semibold ${activeTab === tab.id ? 'text-brand-black' : 'text-gray-400'}`}>
              <tab.Icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 pb-20 md:pb-0">

          {/* ============ DASHBOARD ============ */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="font-instrument text-3xl text-brand-black mb-6">Dashboard</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Brain className="w-5 h-5 text-blue-600" /></div>
                    <div><p className="text-2xl font-bold text-brand-black">{therapists.length}</p><p className="text-xs text-gray-500">Therapists</p></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-green-600" /></div>
                    <div><p className="text-2xl font-bold text-brand-black">{communityPosts.length}</p><p className="text-xs text-gray-500">Active Posts</p></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
                    <div><p className="text-2xl font-bold text-brand-black">{communityPosts.filter(p => isExpired(p.timestamp)).length}</p><p className="text-xs text-gray-500">Expired Posts</p></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Users className="w-5 h-5 text-purple-600" /></div>
                    <div><p className="text-2xl font-bold text-brand-black">{applications.length}</p><p className="text-xs text-gray-500">New Applications</p></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><CreditCard className="w-5 h-5 text-emerald-600" /></div>
                    <div><p className="text-2xl font-bold text-brand-black">{bookings.length}</p><p className="text-xs text-gray-500">Total Bookings</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-brand-black mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab('therapists')} className="px-4 py-2.5 bg-brand-black text-white rounded-xl text-sm font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Add Therapist</button>
                  <button onClick={handleCleanupPosts} className="px-4 py-2.5 bg-gray-100 text-brand-black rounded-xl text-sm font-medium flex items-center gap-2"><Trash2 className="w-4 h-4" /> Clean Expired Posts</button>
                  <button onClick={() => navigate('/')} className="px-4 py-2.5 bg-gray-100 text-brand-black rounded-xl text-sm font-medium flex items-center gap-2"><Eye className="w-4 h-4" /> View Website</button>
                </div>
              </div>
            </div>
          )}

          {/* ============ THERAPISTS ============ */}
          {activeTab === 'therapists' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-instrument text-3xl text-brand-black">Therapists</h2>
                <button onClick={() => { setEditingTherapist(null); setShowTherapistForm(true); }}
                  className="bg-brand-black text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Therapist
                </button>
              </div>

              {/* Therapist Form Modal */}
              {showTherapistForm && (
            <TherapistForm
              initial={editingTherapist || emptyTherapist}
              existingTherapists={therapists}
              onSave={handleSaveTherapist}
              onCancel={() => { setShowTherapistForm(false); setEditingTherapist(null); }}
            />
          )}{/* Therapist list */}
              <div className="space-y-3">
                {therapists.map((t, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {t.image ? <img src={t.image} alt={t.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No img</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-brand-black text-sm">{t.name}</h3>
                        {t.online && <span className="w-2 h-2 rounded-full bg-green-500" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{t.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Rs.{t.price}</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-500">{t.experience}</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-500">{t.rating} stars</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditingTherapist(t); setShowTherapistForm(true); }}
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTherapist(i)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {therapists.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No therapists added yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============ BOOKINGS ============ */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="font-instrument text-3xl text-brand-black mb-6">All Bookings</h2>
              <div className="space-y-3">
                {bookings.map((b: any) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-brand-black">{b.name || 'Unknown'}</h3>
                        <p className="text-xs text-gray-500">{b.email} • {b.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.isFirstSession ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {b.isFirstSession ? 'First Session' : 'Returning'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          Rs.{b.pricePaid}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Therapist</p>
                        <p className="font-medium text-brand-black text-xs">{b.therapist}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Date & Time</p>
                        <p className="font-medium text-brand-black text-xs">{b.sessionDate || '—'} at {b.sessionTime || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Format</p>
                        <p className="font-medium text-brand-black text-xs capitalize">{b.sessionFormat || '—'} • {b.sessionDuration || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Booked On</p>
                        <p className="font-medium text-brand-black text-xs">{b.date ? new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                      </div>
                    </div>
                    {(b.concerns?.length > 0 || b.note) && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {b.concerns?.length > 0 && <div className="flex flex-wrap gap-1 mb-2">{b.concerns.map((c: string) => <span key={c} className="px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] rounded-full font-medium">{c}</span>)}</div>}
                        {b.note && <p className="text-xs text-gray-500 italic">"{b.note}"</p>}
                      </div>
                    )}
                    {b.meetLink && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <a href={b.meetLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-medium flex items-center gap-1"><Video className="w-3 h-3" /> {b.meetLink}</a>
                      </div>
                    )}
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No bookings yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============ COMMUNITY ============ */}
          {activeTab === 'community' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-instrument text-3xl text-brand-black">Community Moderation</h2>
                <button onClick={handleCleanupPosts}
                  className="bg-gray-100 text-brand-black px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Clean Expired
                </button>
              </div>

              <div className="space-y-3">
                {communityPosts.map(post => {
                  const expired = isExpired(post.timestamp);
                  return (
                    <div key={post.id} className={`bg-white rounded-2xl border p-5 ${expired ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${post.color || 'from-violet-500 to-purple-600'} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white text-[10px] font-bold">{(post.name || 'A').split(' ').map((w: string) => w[0]).join('').toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-brand-black">{post.name}</span>
                            <span className="text-[10px] text-gray-400">{formatTime(post.timestamp)}</span>
                            {expired && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">EXPIRED</span>}
                            {post.mood && <span className="text-[10px] text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{post.mood}</span>}
                          </div>
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed">{post.message}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span>Reactions: {Object.values(post.reactions || {}).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0)}</span>
                            <span>Replies: {post.replies?.length || 0}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeletePost(post.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {communityPosts.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No community posts yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* ============ APPLICATIONS ============ */}
          {activeTab === 'applications' && (
            <div>
              <h2 className="font-instrument text-3xl text-brand-black mb-6">Therapist Applications</h2>
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-brand-black">{app.name}</h3>
                        <p className="text-sm text-gray-500">{app.email} • {app.phone}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Pending Review' ? 'bg-amber-100 text-amber-700' : 
                        app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'Waitlisted' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status || 'New'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div><span className="font-semibold text-gray-600">Qualification:</span> {app.qualification}</div>
                      <div><span className="font-semibold text-gray-600">Current Status:</span> {app.status}</div>
                      <div className="md:col-span-2">
                        <span className="font-semibold text-gray-600">Specialties:</span> {(app.specialties || []).join(', ')}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 italic border border-gray-100 mb-4">
                      "{app.reason}"
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleUpdateApplicationStatus(app.id, 'Approved')}
                        className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group"
                      >
                        <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Approve
                      </button>
                      <button 
                        onClick={() => handleUpdateApplicationStatus(app.id, 'Waitlisted')}
                        className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group"
                      >
                        <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" /> Waitlist
                      </button>
                      <button 
                        onClick={() => handleUpdateApplicationStatus(app.id, 'Rejected')}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group"
                      >
                        <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No applications received yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============ CONTENT EDITOR ============ */}
          {activeTab === 'content' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-instrument text-3xl text-brand-black">Website Content</h2>
                <button onClick={handleSaveContent} disabled={saving}
                  className="bg-brand-black text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-gray-500 text-sm mb-6 pb-4 border-b border-gray-100">
                  Edit any text, stat, or image URL below. Changes go live after saving.
                </p>
                {renderFields(formData, [])}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ---- THERAPIST FORM COMPONENT ----
function TherapistForm({ initial, onSave, onCancel, existingTherapists }: { initial: Therapist; onSave: (t: Therapist) => void; onCancel: () => void; existingTherapists: Therapist[] }) {
  const [form, setForm] = useState<Therapist>({ ...initial });
  const [specInput, setSpecInput] = useState('');
  const [langInput, setLangInput] = useState('');

  const predefinedTitles = ['Therapist', 'Couples Therapist', 'Counsellor', 'Psychiatrist', 'Clinical Psychologist', 'Counseling Psychologist', 'Psychotherapist', 'Child Psychologist'];
  const predefinedSpecialties = ['Anxiety', 'Low Mood', 'Overthinking', 'Stress', 'Relationships', 'Self Growth', 'Trauma', 'ADHD', 'Depression', 'Grief', 'OCD', 'Bipolar Disorder', 'Career Counseling', 'Anger Management', 'PTSD'];

  const update = (key: keyof Therapist, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const addSpec = () => {
    if (specInput.trim()) {
      const items = specInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
      update('specialties', [...form.specialties, ...items]);
      setSpecInput('');
    }
  };

  const addLang = () => {
    if (langInput.trim()) {
      const items = langInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
      update('languages', [...form.languages, ...items]);
      setLangInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 className="font-instrument text-xl text-brand-black">{initial.name ? 'Edit Therapist' : 'Add Therapist'}</h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
            <input value={form.name} onChange={e => update('name', e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" placeholder="Dr. Jane Smith" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-600 mb-1">Custom URL (Slug) *</label>
            <div className="flex items-center">
              <span className="text-gray-400 bg-gray-50 border border-r-0 border-gray-300 rounded-l-xl p-3 text-sm">brainheal.in/therapist/</span>
              <input value={form.slug || ''} onChange={e => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} className="w-full border border-gray-300 rounded-r-xl p-3 text-sm focus:border-brand-black focus:outline-none" placeholder="janesmith" />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Only lowercase letters and numbers allowed. No spaces.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
            <input value={form.title} onChange={e => update('title', e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" placeholder="Clinical Psychologist" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {predefinedTitles.map(t => (
                <button key={t} onClick={() => update('title', t)} className="px-2 py-1 bg-gray-100 text-[10px] text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Credentials</label>
            <input value={form.credentials} onChange={e => update('credentials', e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" placeholder="M.Phil, RCI Licensed" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Experience</label>
              <input value={form.experience} onChange={e => update('experience', e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" placeholder="8 yrs exp." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Price (Rs.)</label>
              <input type="number" value={form.price} onChange={e => update('price', Number(e.target.value))} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => update('rating', Number(e.target.value))} onFocus={e => { if (e.target.value === '0') e.target.value = ''; }} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Reviews Count</label>
              <input type="number" value={form.reviews} onChange={e => update('reviews', Number(e.target.value))} onFocus={e => { if (e.target.value === '0') e.target.value = ''; }} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Profile Image URL *</label>
            <input value={form.image} onChange={e => update('image', e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" placeholder="https://..." />
            {form.image && <img src={form.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover mt-2" />}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Availability</label>
            <input value={form.available} onChange={e => update('available', e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" placeholder="Available Today" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={form.online} onChange={e => update('online', e.target.checked)} className="w-5 h-5 accent-green-600" />
            <label className="text-sm text-gray-700">Currently Online</label>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Bio (for SEO and profile page)</label>
            <textarea value={form.bio || ''} onChange={e => update('bio', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none min-h-[100px]"
              placeholder="Write a detailed bio. This will appear on their public profile page and be used for Google SEO. Include their approach, education, specializations, and what makes them unique." />
            <p className="text-[10px] text-gray-400 mt-1">Tip: More detail = better Google ranking. Include therapy approaches (CBT, EMDR, etc.), education, and personal philosophy.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Quote (Editorial Style)</label>
            <input value={form.quote || ''} onChange={e => update('quote', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none"
              placeholder="e.g. Healing starts when you feel heard." />
            <p className="text-[10px] text-gray-400 mt-1">A catchy personal quote that will appear in large font at the top of their profile.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Education</label>
            <input value={form.education || ''} onChange={e => update('education', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none"
              placeholder="e.g. M.A. Clinical Psychology, Delhi University" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Therapeutic Approach</label>
            <input value={form.approach || ''} onChange={e => update('approach', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none"
              placeholder="e.g. Cognitive Behavioral Therapy (CBT), Trauma-Informed" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Instagram URL</label>
              <input value={form.instagramUrl || ''} onChange={e => update('instagramUrl', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none"
                placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">LinkedIn URL</label>
              <input value={form.linkedinUrl || ''} onChange={e => update('linkedinUrl', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none"
                placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Twitter (X) URL</label>
              <input value={form.twitterUrl || ''} onChange={e => update('twitterUrl', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none"
                placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
              <input type="email" value={form.email || ''} onChange={e => update('email', e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none"
                placeholder="therapist@example.com" />
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-semibold text-blue-600 mb-1">Google Meet Link (Permanent)</label>
            <input value={(form as any).meetLink || ''} onChange={e => update('meetLink' as any, e.target.value)}
              className="w-full border border-blue-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none bg-blue-50/30"
              placeholder="https://meet.google.com/xxx-yyyy-zzz" />
            <p className="text-[10px] text-gray-400 mt-1">Therapist's permanent Google Meet link. This will be sent to customers in their booking confirmation email.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Telegram Chat ID (for booking notifications)</label>
            <input value={form.telegramId || ''} onChange={e => update('telegramId', e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none"
              placeholder="e.g. 123456789" />
            <p className="text-[10px] text-gray-400 mt-1">Therapist must first message @BrainHealBot on Telegram, then send /start to @userinfobot to get their numeric ID.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Specialties</label>
            <div className="flex gap-2 mb-2">
              <input value={specInput} onChange={e => { const v = e.target.value; if (v.includes(',')) { const items = v.split(',').map(s => s.trim()).filter(s => s.length > 0); if (items.length > 0) { update('specialties', [...new Set([...form.specialties, ...items])]); } setSpecInput(''); } else { setSpecInput(v); } }} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" placeholder="Type and press Enter or comma to separate" />
              <button onClick={addSpec} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">Add</button>
            </div>
            
            <p className="text-[10px] font-semibold text-gray-500 mb-1.5">Quick Add:</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {predefinedSpecialties.filter(s => !form.specialties.includes(s)).map(s => (
                <button key={s} onClick={() => update('specialties', [...form.specialties, s])} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] rounded-md border border-blue-100 hover:bg-blue-100 transition-colors">
                  + {s}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {form.specialties.map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium flex items-center gap-1.5">
                  {s} <button onClick={() => update('specialties', form.specialties.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500">x</button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Languages</label>
            <div className="flex gap-2 mb-2">
              <input value={langInput} onChange={e => { const v = e.target.value; if (v.includes(',')) { const items = v.split(',').map(s => s.trim()).filter(s => s.length > 0); if (items.length > 0) { update('languages', [...form.languages, ...items]); } setLangInput(''); } else { setLangInput(v); } }} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLang())}
                className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:border-brand-black focus:outline-none" placeholder="Type and press Enter or comma to separate" />
              <button onClick={addLang} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.languages.map((l, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium flex items-center gap-1.5">
                  {l} <button onClick={() => update('languages', form.languages.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500">x</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={() => { 
            if (!form.name || !form.title) { alert('Name and Title are required'); return; } 
            if (!form.slug) { alert('Custom URL (Slug) is required'); return; }
            
            const cleanSlug = form.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
            const isDuplicate = existingTherapists.some(t => t.slug === cleanSlug && t.name !== form.name);
            if (isDuplicate) {
              alert('This Custom URL is already taken by another therapist. Please choose a unique one.');
              return;
            }
            onSave({ ...form, slug: cleanSlug }); 
          }}
            className="flex-1 py-3 rounded-xl bg-brand-black text-white text-sm font-medium hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Therapist
          </button>
        </div>
      </div>
    </div>
  );
}
