import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, Calendar, Clock, Check, Heart, Sparkles, Loader2, AlertCircle, CreditCard, ArrowRight } from 'lucide-react';
import { sendBookingNotifications } from '../utils/telegram';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface BookingFlowProps {
  therapistName: string;
  therapistImage: string;
  therapistTitle: string;
  price: number;
  firstSessionPrice?: number;
  therapistTelegramId?: string;
  therapistMeetLink?: string;
  therapistEmail?: string;
  onClose: () => void;
}

const concerns = ['Anxiety', 'Stress', 'Depression', 'Relationships', 'Self Growth', 'Trauma', 'Overthinking', 'Grief', 'ADHD', 'Low Mood', 'Burnout', 'Loneliness'];
const formats = [
  { id: 'video', label: 'Video Call', emoji: '📹', desc: 'Face-to-face from home' },
  { id: 'voice', label: 'Voice Call', emoji: '📞', desc: 'Audio-only comfort' },
  { id: 'chat', label: 'Chat', emoji: '💬', desc: 'Text-based therapy' },
];

const countryCodes = [
  { code: '+91', flag: '🇮🇳', label: 'IN' },
  { code: '+1', flag: '🇺🇸', label: 'US' },
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+971', flag: '🇦🇪', label: 'UAE' },
  { code: '+61', flag: '🇦🇺', label: 'AU' },
  { code: '+65', flag: '🇸🇬', label: 'SG' },
  { code: '+60', flag: '🇲🇾', label: 'MY' },
  { code: '+880', flag: '🇧🇩', label: 'BD' },
  { code: '+94', flag: '🇱🇰', label: 'LK' },
  { code: '+977', flag: '🇳🇵', label: 'NP' },
  { code: '+92', flag: '🇵🇰', label: 'PK' },
];

function getNextDays(count: number) {
  const days = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now); d.setDate(now.getDate() + i);
    days.push({ date: d, label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) });
  }
  return days;
}

function parseSlotTime(slotStr: string, baseDate: Date): Date {
  const [timePart, meridiem] = slotStr.split(' ');
  const [hourStr, minStr] = timePart.split(':');
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);
  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  const result = new Date(baseDate);
  result.setHours(hour, min, 0, 0);
  return result;
}

const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
const afternoonSlots = ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];
const eveningSlots = ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'];

export default function BookingFlow({ therapistName, therapistImage, therapistTitle, price, firstSessionPrice, therapistTelegramId, therapistMeetLink, therapistEmail, onClose }: BookingFlowProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState({
    concerns: [] as string[],
    note: '',
    triedBefore: null as boolean | null,
    format: '',
    duration: '1 Hour' as '1 Hour' | '30 Min',
    date: 0,
    time: '',
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    age18: false,
    consent: false,
  });
  const [finalPrice, setFinalPrice] = useState(price);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  const totalSteps = 7;
  const progress = ((step + 1) / totalSteps) * 100;

  const days = getNextDays(7);

  // Filter time slots for 5-hour minimum when date is Today
  const getFilteredSlots = useMemo(() => {
    return (slots: string[]): string[] => {
      if (selected.date !== 0) return slots;
      const now = new Date();
      const cutoff = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      const today = new Date();
      return slots.filter(slot => {
        const slotTime = parseSlotTime(slot, today);
        return slotTime >= cutoff;
      });
    };
  }, [selected.date]);

  const filteredMorning = useMemo(() => getFilteredSlots(morningSlots), [getFilteredSlots]);
  const filteredAfternoon = useMemo(() => getFilteredSlots(afternoonSlots), [getFilteredSlots]);
  const filteredEvening = useMemo(() => getFilteredSlots(eveningSlots), [getFilteredSlots]);

  // Auto-select next day if all today slots are gone
  useEffect(() => {
    if (selected.date === 0 && filteredMorning.length === 0 && filteredAfternoon.length === 0 && filteredEvening.length === 0) {
      setSelected(prev => ({ ...prev, date: 1, time: '' }));
    }
  }, [selected.date, filteredMorning, filteredAfternoon, filteredEvening]);

  const goNext = async () => {
    if (step === 5) {
      setSending(true);
      try {
        const bookingsRef = collection(db, 'bookings');
        const fullPhone = selected.countryCode + selected.phone;
        const qEmail = query(bookingsRef, where('email', '==', selected.email));
        const qPhone = query(bookingsRef, where('phone', '==', fullPhone));

        const [emailSnap, phoneSnap] = await Promise.all([getDocs(qEmail), getDocs(qPhone)]);

        if (!emailSnap.empty || !phoneSnap.empty) {
          setFinalPrice(selected.duration === '30 Min' ? Math.floor(price / 2) : price);
          setIsNewUser(false);
        } else {
          const baseFirstPrice = firstSessionPrice || 11;
          setFinalPrice(selected.duration === '30 Min' ? baseFirstPrice : baseFirstPrice * 2);
          setIsNewUser(true);
        }
      } catch (err) {
        console.error("Error checking user status:", err);
        setFinalPrice(selected.duration === '30 Min' ? Math.floor(price / 2) : price);
        setIsNewUser(false);
      }
      setSending(false);
      setDir(1);
      setStep(6);
      return;
    }

    if (step === 6) {
      setSending(true);
      const fullPhone = selected.countryCode + selected.phone;

      const options = {
        key: 'rzp_live_SwoffkyhRR1i0n',
        amount: finalPrice * 100,
        currency: 'INR',
        name: 'BrainHeal',
        description: 'Therapy Session Booking',
        image: '/logo.png',
        handler: async function (response: any) {
          try {
            const bookingId = response.razorpay_payment_id;
            await setDoc(doc(db, 'bookings', bookingId), {
              email: selected.email,
              phone: fullPhone,
              name: selected.name,
              therapist: therapistName,
              therapistTitle: therapistTitle,
              pricePaid: finalPrice,
              sessionDate: days[selected.date]?.label || '',
              sessionTime: selected.time,
              sessionFormat: selected.format,
              sessionDuration: selected.duration,
              concerns: selected.concerns,
              note: selected.note,
              meetLink: therapistMeetLink || '',
              isFirstSession: isNewUser || false,
              status: 'confirmed',
              date: new Date().toISOString()
            });

            await sendBookingNotifications({
              clientName: selected.name,
              clientEmail: selected.email,
              clientPhone: fullPhone,
              therapistName,
              therapistTitle,
              date: days[selected.date]?.label || '',
              time: selected.time,
              format: selected.format,
              duration: selected.duration,
              concerns: selected.concerns,
              note: selected.note,
              price: finalPrice,
              therapistTelegramId,
            });

            // Send Email Confirmation to Customer
            try {
              await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  toEmail: selected.email,
                  customerName: selected.name,
                  therapistName: therapistName,
                  date: days[selected.date]?.label || '',
                  time: selected.time,
                  duration: selected.duration,
                  meetLink: therapistMeetLink || '',
                  price: finalPrice,
                  type: 'customer'
                })
              });
            } catch (emailErr) {
              console.error('Failed to send customer email:', emailErr);
            }

            // Send Email Notification to Therapist
            if (therapistEmail) {
              try {
                await fetch('/api/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    toEmail: therapistEmail,
                    customerName: selected.name,
                    customerEmail: selected.email,
                    customerPhone: fullPhone,
                    therapistName: therapistName,
                    date: days[selected.date]?.label || '',
                    time: selected.time,
                    duration: selected.duration,
                    meetLink: therapistMeetLink || '',
                    price: finalPrice,
                    concerns: selected.concerns,
                    note: selected.note,
                    type: 'therapist'
                  })
                });
              } catch (emailErr) {
                console.error('Failed to send therapist email:', emailErr);
              }
            }

            setSending(false);
            setDir(1);
            setStep(7);
          } catch (err) {
            console.error('Error post-payment:', err);
            alert("Payment successful but there was an error processing your booking. Please contact support.");
            setSending(false);
          }
        },
        prefill: {
          name: selected.name,
          email: selected.email,
          contact: selected.countryCode + selected.phone
        },
        theme: { color: '#1a1a1a' }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment Failed: " + response.error.description);
        setSending(false);
      });
      rzp.open();
    } else if (step < totalSteps) {
      setDir(1);
      setStep(s => s + 1);
    }
  };
  const goBack = () => { if (step > 0) { setDir(-1); setStep(s => s - 1); } };

  const toggleConcern = (c: string) => {
    setSelected(prev => ({
      ...prev,
      concerns: prev.concerns.includes(c) ? prev.concerns.filter(x => x !== c) : [...prev.concerns, c]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return selected.concerns.length > 0;
      case 1: return selected.triedBefore !== null;
      case 2: return selected.format !== '';
      case 3: return selected.duration !== '';
      case 4: return selected.time !== '';
      case 5: return selected.name.trim() !== '' && selected.email.trim() !== '' && selected.phone.replace(/\D/g, '').length === 10;
      case 6: return selected.age18 && selected.consent;
      default: return true;
    }
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const timeSections = [
    { label: 'Morning', icon: '\u2600\uFE0F', slots: filteredMorning },
    { label: 'Afternoon', icon: '\uD83C\uDF24\uFE0F', slots: filteredAfternoon },
    { label: 'Evening', icon: '\uD83C\uDF19', slots: filteredEvening },
  ];


  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        style={{ animation: 'bookingSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Header */}
        {step < 6 && (
          <div className="px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {therapistImage && <img src={therapistImage} alt="" className="w-10 h-10 rounded-xl object-cover" />}
                <div>
                  <p className="text-sm font-semibold text-brand-black">{therapistName}</p>
                  <p className="text-[10px] text-brand-gray">{therapistTitle}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-brand-gray" />
              </button>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-black rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div key={step} className="animate-stepIn" style={{ '--step-dir': dir > 0 ? '24px' : '-24px' } as React.CSSProperties}>

            {/* Step 0: What concerns you? */}
            {step === 0 && (
              <div>
                <h2 className="font-instrument text-2xl text-brand-black mb-1">What's on your mind?</h2>
                <p className="text-sm text-brand-gray mb-5">Pick everything that resonates with you</p>
                <div className="grid grid-cols-2 gap-2">
                  {concerns.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleConcern(c)}
                      className={`p-3.5 rounded-2xl border-2 text-sm font-medium text-left transition-all duration-300 ${
                        selected.concerns.includes(c)
                          ? 'border-brand-black bg-brand-black text-white scale-[0.97]'
                          : 'border-gray-100 bg-gray-50 text-brand-black hover:border-gray-300 active:scale-95'
                      }`}
                      style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      {selected.concerns.includes(c) && <Check className="w-3.5 h-3.5 inline mr-1.5" />}
                      {c}
                    </button>
                  ))}
                </div>

                {/* Note textarea */}
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-brand-gray mb-2">Want to share more?</label>
                  <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)' }}>
                    <textarea
                      value={selected.note}
                      onChange={e => setSelected(prev => ({ ...prev, note: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-gray-50/70 rounded-2xl border border-gray-200/60 text-sm font-medium text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:bg-white transition-all resize-none"
                      placeholder="Describe what you're going through... (optional)"
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                  {selected.note.length > 0 && (
                    <p className="text-[10px] text-brand-gray mt-1 text-right">{selected.note.length}/500</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Tried therapy before? */}
            {step === 1 && (
              <div>
                <h2 className="font-instrument text-2xl text-brand-black mb-1">Have you tried therapy before?</h2>
                <p className="text-sm text-brand-gray mb-6">No wrong answers here, just helps us understand you better</p>
                <div className="space-y-3">
                  {[
                    { val: true, emoji: '🙋', label: "Yes, I have", sub: "I know what to expect" },
                    { val: false, emoji: '🌱', label: "No, this is my first time", sub: "I'm ready to start my journey" },
                  ].map(opt => (
                    <button
                      key={String(opt.val)}
                      onClick={() => setSelected(prev => ({ ...prev, triedBefore: opt.val }))}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                        selected.triedBefore === opt.val
                          ? 'border-brand-black bg-gray-50 scale-[0.98]'
                          : 'border-gray-100 hover:border-gray-300 active:scale-95'
                      }`}
                      style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <div>
                        <p className="font-semibold text-brand-black">{opt.label}</p>
                        <p className="text-xs text-brand-gray mt-0.5">{opt.sub}</p>
                      </div>
                      {selected.triedBefore === opt.val && <Check className="w-5 h-5 text-brand-black ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Session format */}
            {step === 2 && (
              <div>
                <h2 className="font-instrument text-2xl text-brand-black mb-1">How would you like to connect?</h2>
                <p className="text-sm text-brand-gray mb-6">Choose what feels most comfortable</p>
                <div className="space-y-3">
                  {formats.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelected(prev => ({ ...prev, format: f.id }))}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                        selected.format === f.id
                          ? 'border-brand-black bg-gray-50 scale-[0.98]'
                          : 'border-gray-100 hover:border-gray-300 active:scale-95'
                      }`}
                      style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      <span className="text-3xl">{f.emoji}</span>
                      <div>
                        <p className="font-semibold text-brand-black">{f.label}</p>
                        <p className="text-xs text-brand-gray mt-0.5">{f.desc}</p>
                      </div>
                      {selected.format === f.id && <Check className="w-5 h-5 text-brand-black ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Duration */}
            {step === 3 && (
              <div className="animate-stepIn">
                <h2 className="font-instrument text-2xl text-brand-black mb-1">Session Duration</h2>
                <p className="text-sm text-brand-gray mb-6">Choose how long you'd like to talk</p>
                <div className="space-y-3">
                  {[
                    { id: '30 Min', title: '30 Minutes', desc: 'A quick check-in or focused session', icon: <Clock className="w-5 h-5" /> },
                    { id: '1 Hour', title: '1 Hour', desc: 'A standard deep-dive therapy session', icon: <Clock className="w-5 h-5" /> }
                  ].map(dur => (
                    <button
                      key={dur.id}
                      onClick={() => setSelected(prev => ({ ...prev, duration: dur.id as any }))}
                      className={`w-full flex items-center p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                        selected.duration === dur.id ? 'border-brand-black bg-gray-50 shadow-md' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${selected.duration === dur.id ? 'bg-brand-black text-white' : 'bg-gray-100 text-brand-gray'}`}>
                        {dur.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-brand-black">{dur.title}</p>
                        <p className="text-xs text-brand-gray mt-0.5">{dur.desc}</p>
                      </div>
                      {selected.duration === dur.id && <Check className="w-5 h-5 text-brand-black ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Date & Time */}
            {step === 4 && (
              <div>
                <h2 className="font-instrument text-2xl text-brand-black mb-1">Pick your slot</h2>
                <p className="text-sm text-brand-gray mb-5">When works best for you?</p>

                {/* Date pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(prev => ({ ...prev, date: i, time: '' }))}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-center transition-all duration-300 ${
                        selected.date === i
                          ? 'bg-brand-black text-white shadow-md'
                          : 'bg-gray-50 text-brand-black border border-gray-100 hover:border-gray-300'
                      }`}
                      style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      <p className="text-xs font-bold">{d.label}</p>
                    </button>
                  ))}
                </div>

                {/* Time slots */}
                {timeSections.map(section => {
                  if (section.slots.length === 0) return null;
                  return (
                    <div key={section.label} className="mb-4">
                      <p className="text-xs font-semibold text-brand-gray mb-2 flex items-center gap-1.5">{section.icon} {section.label}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {section.slots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setSelected(prev => ({ ...prev, time: slot }))}
                            className={`py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                              selected.time === slot
                                ? 'bg-brand-black text-white shadow-md scale-95'
                                : 'bg-gray-50 text-brand-black border border-gray-100 hover:border-gray-300 active:scale-90'
                            }`}
                            style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {timeSections.every(s => s.slots.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-sm text-brand-gray">No available slots for this date. Please select another day.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Your details */}
            {step === 5 && (
              <div>
                <h2 className="font-instrument text-2xl text-brand-black mb-1">Almost there!</h2>
                <p className="text-sm text-brand-gray mb-6">Tell us a little about yourself</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-gray mb-1.5">Full Name</label>
                    <input
                      value={selected.name}
                      onChange={e => setSelected(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-brand-black focus:outline-none focus:border-brand-black focus:bg-white transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-gray mb-1.5">Email</label>
                    <input
                      type="email"
                      value={selected.email}
                      onChange={e => setSelected(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-brand-black focus:outline-none focus:border-brand-black focus:bg-white transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-gray mb-1.5">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="relative flex-shrink-0">
                        <select
                          value={selected.countryCode}
                          onChange={e => setSelected(prev => ({ ...prev, countryCode: e.target.value }))}
                          className="appearance-none w-[100px] px-3 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-brand-black focus:outline-none focus:border-brand-black focus:bg-white transition-all cursor-pointer pr-6"
                        >
                          {countryCodes.map(cc => (
                            <option key={cc.code} value={cc.code}>
                              {cc.flag} {cc.code}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-3 h-3 text-brand-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={selected.phone}
                        onChange={e => {
                          const digits = e.target.value.replace(/\D/g, '');
                          setSelected(prev => ({ ...prev, phone: digits.slice(0, 10) }));
                        }}
                        maxLength={10}
                        className="flex-1 px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-brand-black focus:outline-none focus:border-brand-black focus:bg-white transition-all"
                        placeholder="9876543210"
                      />
                    </div>
                    {selected.phone.length > 0 && selected.phone.length < 10 && (
                      <p className="text-[10px] text-amber-600 mt-1">{10 - selected.phone.length} more digit{10 - selected.phone.length !== 1 ? 's' : ''} needed</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Consent & Summary */}
            {step === 6 && (
              <div className="animate-stepIn relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                
                <div className="relative z-10">
                  <h2 className="font-instrument text-3xl text-brand-black mb-1">You're taking a great step.</h2>
                  <p className="text-sm text-brand-gray mb-6">Review your session details before we finalize.</p>

                  {/* Stunning Summary Card */}
                  <div className="relative p-[2px] rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-500 mb-6 shadow-xl shadow-fuchsia-500/10">
                    <div className="bg-white rounded-[22px] p-5 relative overflow-hidden">
                      {/* Inner background pattern */}
                      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]"></div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest text-brand-gray uppercase mb-1">Therapist</p>
                            <p className="font-instrument text-xl text-brand-black">{therapistName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold tracking-widest text-brand-gray uppercase mb-1">Format & Time</p>
                            <div className="flex items-center gap-2 justify-end">
                              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                <span className="text-xs">{formats.find(f => f.id === selected.format)?.emoji}</span>
                                <span className="text-xs font-semibold text-brand-black capitalize">{selected.format}</span>
                              </div>
                              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                <Clock className="w-3 h-3 text-brand-gray" />
                                <span className="text-xs font-semibold text-brand-black capitalize">{selected.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-5">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest text-brand-gray uppercase mb-1">When</p>
                            <p className="text-sm font-semibold text-brand-black">{days[selected.date]?.label}</p>
                            <p className="text-xs text-brand-gray">{selected.time}</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shadow-inner">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                          {isNewUser === true && (
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                          )}
                          <div className="relative z-10">
                            {isNewUser === true ? (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" /> First Session Gift
                                  </span>
                                  <span className="text-xs font-medium text-gray-400 line-through">Rs.{price.toLocaleString()}</span>
                                </div>
                                <div className="flex items-end justify-between">
                                  <span className="text-sm text-brand-gray font-medium">Total to pay</span>
                                  <div className="flex items-start gap-1">
                                    <span className="text-sm font-bold text-brand-black mt-1">Rs.</span>
                                    <span className="text-4xl font-black font-inter tracking-tighter text-brand-black leading-none drop-shadow-sm">{finalPrice}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1">
                                    Welcome Back
                                  </span>
                                </div>
                                <div className="flex items-end justify-between">
                                  <span className="text-sm text-brand-gray font-medium">Total to pay</span>
                                  <div className="flex items-start gap-1">
                                    <span className="text-sm font-bold text-brand-black mt-1">Rs.</span>
                                    <span className="text-3xl font-black font-inter tracking-tighter text-brand-black leading-none">{price.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-brand-gray uppercase tracking-widest mb-3 px-1">Quick Confirmations</p>
                  <div className="space-y-3 mb-2">
                    <button
                      onClick={() => setSelected(prev => ({ ...prev, age18: !prev.age18 }))}
                      className={`w-full relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                        selected.age18 ? 'border-emerald-500 bg-emerald-50/30 shadow-md shadow-emerald-500/10' : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {selected.age18 && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>}
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected.age18 ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-sm' : 'border-gray-300'}`}>
                        {selected.age18 && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm transition-colors ${selected.age18 ? 'text-emerald-800' : 'text-brand-black'}`}>I am 18 years or older</p>
                        <p className="text-[11px] text-brand-gray mt-0.5">Or have parental/guardian consent</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelected(prev => ({ ...prev, consent: !prev.consent }))}
                      className={`w-full relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                        selected.consent ? 'border-brand-black bg-gray-50 shadow-md shadow-black/5' : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {selected.consent && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-brand-black shadow-[0_0_10px_rgba(0,0,0,0.2)]"></div>}
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected.consent ? 'bg-brand-black border-brand-black scale-110 shadow-sm' : 'border-gray-300'}`}>
                        {selected.consent && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-black text-sm">I agree to the terms</p>
                        <p className="text-[11px] text-brand-gray mt-0.5">
                          I agree to the <a href="/terms" target="_blank" className="underline font-semibold" onClick={e=>e.stopPropagation()}>Terms</a>, <a href="/privacy" target="_blank" className="underline font-semibold" onClick={e=>e.stopPropagation()}>Privacy</a> & No-refund policy.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Premium Confirmation */}
            {step === 7 && (
              <div className="relative overflow-hidden confirmation-root" style={{ animation: 'confirmFadeIn 0.5s ease both' }}>
                {/* Subtle background pattern — animated dot grid */}
                <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04, backgroundImage: 'radial-gradient(circle, #0d9488 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                {/* ── Top Section ── */}
                <div className="relative z-10 text-center pt-8 pb-5 px-5">
                  {/* Animated checkmark */}
                  <div className="relative w-20 h-20 mx-auto mb-5">
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ animation: 'confirmPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both' }}>
                      <defs>
                        <linearGradient id="confirmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0d9488" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="46" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#confirmGrad)" strokeWidth="3" strokeLinecap="round" className="confirm-circle-draw" />
                      <path d="M30 52 L44 66 L72 36" fill="none" stroke="url(#confirmGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="confirm-check-draw" />
                    </svg>
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full" style={{ border: '2px solid #0d9488', animation: 'confirmPulseRing 2s ease-out 0.8s both', opacity: 0 }} />
                  </div>

                  {/* Title + Subtitle */}
                  <h2 className="font-instrument text-[22px] sm:text-2xl font-bold text-brand-black mb-1.5 tracking-tight" style={{ animation: 'confirmSlideUp 0.6s ease-out 0.35s both' }}>
                    Session Confirmed
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{ animation: 'confirmSlideUp 0.6s ease-out 0.5s both' }}>
                    Your session with <span className="font-semibold text-brand-black">{therapistName}</span> is booked
                  </p>

                  {/* Price chip */}
                  <div className="mt-4" style={{ animation: 'confirmSlideUp 0.6s ease-out 0.6s both' }}>
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-teal-700 bg-teal-50 border border-teal-100">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
                      Rs.{finalPrice}
                      {isNewUser && <span className="text-[10px] font-bold text-teal-500 uppercase tracking-wider ml-1">First Session</span>}
                    </span>
                  </div>
                </div>

                {/* ── Session Details Card ── */}
                <div className="relative z-10 mx-4 mb-4" style={{ animation: 'confirmSlideUp 0.7s ease-out 0.7s both' }}>
                  <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' }}>
                    {/* Detail rows — desktop: 2x2 grid, mobile: list */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-50">
                      {/* Therapist */}
                      <div className="p-4 sm:p-5 flex flex-col items-center text-center border-b border-gray-50 sm:border-b-0">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center mb-2.5">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Therapist</span>
                        <span className="text-[13px] font-semibold text-brand-black leading-tight">{therapistName}</span>
                      </div>
                      {/* Date */}
                      <div className="p-4 sm:p-5 flex flex-col items-center text-center border-b border-gray-50 sm:border-b-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-2.5">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><circle cx="12" cy="16" r="1.5" fill="#3b82f6" /></svg>
                        </div>
                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Date</span>
                        <span className="text-[13px] font-semibold text-brand-black">{days[selected.date]?.label}</span>
                      </div>
                      {/* Time */}
                      <div className="p-4 sm:p-5 flex flex-col items-center text-center">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-2.5">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Time</span>
                        <span className="text-[13px] font-semibold text-brand-black">{selected.time}</span>
                      </div>
                      {/* Format */}
                      <div className="p-4 sm:p-5 flex flex-col items-center text-center">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center mb-2.5">
                          {selected.format === 'video' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                          ) : selected.format === 'voice' ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Format</span>
                        <span className="text-[13px] font-semibold text-brand-black capitalize">{selected.format}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Confirmation email notice ── */}
                <div className="relative z-10 mx-4 mb-4" style={{ animation: 'confirmSlideUp 0.6s ease-out 0.9s both' }}>
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 font-medium leading-none mb-0.5">Confirmation sent to</p>
                      <p className="text-[13px] font-semibold text-brand-black truncate">{selected.email}</p>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Tips Card ── */}
                <div className="relative z-10 mx-4 mb-5" style={{ animation: 'confirmSlideUp 0.6s ease-out 1s both' }}>
                  <div className="rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3.5">
                    <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      Before your session
                    </p>
                    <div className="space-y-2.5 mt-3">
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 min-w-[20px] rounded-full bg-teal-500 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-[1px]">1</span>
                        <span className="text-[13px] text-teal-900 leading-[20px] text-left">Find a quiet space with no interruptions</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 min-w-[20px] rounded-full bg-teal-500 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-[1px]">2</span>
                        <span className="text-[13px] text-teal-900 leading-[20px] text-left">Test your mic and internet beforehand</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 min-w-[20px] rounded-full bg-teal-500 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-[1px]">3</span>
                        <span className="text-[13px] text-teal-900 leading-[20px] text-left">Join 2–3 minutes early to settle in</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Done Button ── */}
                <div className="relative z-10 px-4 pb-6" style={{ animation: 'confirmSlideUp 0.6s ease-out 1.1s both' }}>
                  <button
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', color: '#fff', boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  >
                    <Check className="w-4 h-4" /> Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        {step < 7 && (
          <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
            {step > 0 && (
              <button onClick={goBack} className="px-5 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-brand-black hover:bg-gray-50 active:scale-95 transition-all"
                style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!canProceed() || sending}
              className={`flex-1 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                canProceed() && !sending
                  ? step === 6 && isNewUser
                    ? 'bg-brand-black text-white hover:scale-[1.02] active:scale-95 shadow-sm pay-btn-glow'
                    : 'bg-brand-black text-white hover:scale-[1.02] active:scale-95 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              {step === 6 ? (
                sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...</>
                ) : isNewUser ? (
                  <><CreditCard className="w-4 h-4" /> Pay Rs.{finalPrice} & Book</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pay Rs.{finalPrice.toLocaleString()} & Book</>
                )
              ) : step === 5 ? (
                sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Checking Offer...</>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )
              ) : (
                <>Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bookingSlideUp {
          from { opacity: 0; transform: translateY(100px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-stepIn {
          animation: stepSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes stepSlide {
          from { opacity: 0; transform: translateX(var(--step-dir, 24px)); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* ── Confirmation screen animations ── */
        @keyframes confirmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes confirmPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confirmSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confirmPulseRing {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .confirm-circle-draw {
          stroke-dasharray: 290;
          stroke-dashoffset: 290;
          animation: confirmDrawCircle 0.8s ease-out 0.2s forwards;
        }
        @keyframes confirmDrawCircle {
          to { stroke-dashoffset: 0; }
        }
        .confirm-check-draw {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: confirmDrawCheck 0.4s ease-out 0.7s forwards;
        }
        @keyframes confirmDrawCheck {
          to { stroke-dashoffset: 0; }
        }

        /* Green glow for pay button (new user) */
        .pay-btn-glow {
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
