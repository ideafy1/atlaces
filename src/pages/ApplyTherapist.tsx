import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, Brain, Sparkles, ArrowRight, BadgeCheck, Rocket, ChevronRight } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import SEOHead from '../components/SEOHead';

export default function ApplyTherapist() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: '',
    qualification: '',
    specialties: [] as string[],
    reason: ''
  });

  const statuses = ['Studying', 'Working in a Clinic/Hospital', 'Independent Practice', 'Other'];
  const qualifications = ['B.A. Psychology', 'M.A. Clinical/Counseling', 'M.Phil Clinical Psychology', 'Ph.D Psychology', 'Other'];
  const possibleSpecialties = ['Anxiety', 'Depression', 'Stress', 'Relationships', 'Trauma', 'ADHD', 'Grief', 'Self Growth', 'Career Counseling', 'LGBTQ+'];

  const handleSpecialtyToggle = (spec: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(spec) 
        ? prev.specialties.filter(s => s !== spec)
        : [...prev.specialties, spec]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'therapist_applications'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'Pending Review'
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] font-inter flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[2rem] max-w-lg w-full text-center shadow-sm border border-gray-100">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)] animate-[bounce_1s_ease-in-out_infinite]">
            <BadgeCheck className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-instrument text-4xl text-[#202124] mb-4 animate-[fadeIn_0.5s_ease-out]">Application Sent!</h1>
          <p className="text-[#5F6368] mb-8 text-lg animate-[fadeIn_0.7s_ease-out]">
            Thank you for applying to join BrainHeal. Our clinical team will review your application and reach out to you within 3-5 business days.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#1A73E8] text-white px-8 py-4 rounded-full font-bold hover:bg-[#1557B0] hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl group flex items-center gap-2 mx-auto animate-[fadeIn_0.9s_ease-out]"
          >
            Return to Home <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Join as a Therapist | BrainHeal" 
        description="Apply to join India's premium online therapy collective." 
        url="https://brainheal.in/apply" 
      />
      
      <div className="min-h-screen bg-[#F8F9FA] font-inter">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center sticky top-0 z-50">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-4">
            <ArrowLeft className="w-5 h-5 text-[#5F6368]" />
          </button>
          <div className="flex items-center gap-2 group cursor-default">
            <Brain className="w-6 h-6 text-[#1A73E8] group-hover:scale-110 group-hover:rotate-12 transition-transform" />
            <span className="font-instrument text-xl font-medium text-[#202124]">BrainHeal for Therapists</span>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-12 md:py-20">
          <div className="text-center mb-12">
            <h1 className="font-instrument text-4xl md:text-5xl text-[#202124] mb-4 tracking-tight">
              Join our collective.
            </h1>
            <p className="text-[#5F6368] text-lg max-w-lg mx-auto">
              We're building India's most trusted mental health platform. Bring your expertise, we'll bring the clients.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500 relative overflow-hidden">
            {/* Background decorative blob */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-medium text-[#1A73E8]">Step {step} of 3</span>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${i <= step ? 'bg-[#1A73E8]' : 'bg-[#E8EAED]'}`} />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Basic Info */}
              <div className={step === 1 ? 'block' : 'hidden'}>
                <h2 className="text-2xl font-medium text-[#202124] mb-6">Let's start with the basics</h2>
                
                <div className="space-y-5">
                  <div className="relative">
                    <input 
                      type="text" 
                      required={step === 1}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="peer w-full border-2 border-[#E8EAED] rounded-xl px-4 pt-6 pb-2 text-[#202124] focus:border-[#1A73E8] focus:outline-none transition-all hover:border-gray-300 focus:-translate-y-0.5 focus:shadow-md"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-4 text-[#5F6368] text-sm peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#1A73E8] peer-focus:font-medium peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2 transition-all pointer-events-none">
                      Full Name
                    </label>
                  </div>

                  <div className="relative">
                    <input 
                      type="email" 
                      required={step === 1}
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="peer w-full border-2 border-[#E8EAED] rounded-xl px-4 pt-6 pb-2 text-[#202124] focus:border-[#1A73E8] focus:outline-none transition-all hover:border-gray-300 focus:-translate-y-0.5 focus:shadow-md"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-4 text-[#5F6368] text-sm peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#1A73E8] peer-focus:font-medium peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2 transition-all pointer-events-none">
                      Email Address
                    </label>
                  </div>

                  <div className="relative">
                    <input 
                      type="tel" 
                      required={step === 1}
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="peer w-full border-2 border-[#E8EAED] rounded-xl px-4 pt-6 pb-2 text-[#202124] focus:border-[#1A73E8] focus:outline-none transition-all hover:border-gray-300 focus:-translate-y-0.5 focus:shadow-md"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-4 text-[#5F6368] text-sm peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#1A73E8] peer-focus:font-medium peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-2 transition-all pointer-events-none">
                      Phone Number
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 2: Professional Details */}
              <div className={step === 2 ? 'block' : 'hidden'}>
                <h2 className="text-2xl font-medium text-[#202124] mb-6">Professional Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#202124] font-medium mb-3">Current Status</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {statuses.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData({...formData, status: s})}
                          className={`p-4 rounded-xl border-2 text-left transition-all hover:-translate-y-1 hover:shadow-md ${
                            formData.status === s 
                              ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1967D2]' 
                              : 'border-[#E8EAED] text-[#5F6368] hover:border-gray-300'
                          }`}
                        >
                          <span className="text-sm font-medium flex items-center justify-between">
                            {s}
                            {formData.status === s && <CheckCircle className="w-4 h-4 text-[#1A73E8] animate-[scaleIn_0.2s_ease-out]" />}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#202124] font-medium mb-3">Highest Qualification</label>
                    <select 
                      required={step === 2}
                      value={formData.qualification}
                      onChange={e => setFormData({...formData, qualification: e.target.value})}
                      className="w-full border-2 border-[#E8EAED] rounded-xl p-4 text-[#202124] focus:border-[#1A73E8] focus:outline-none appearance-none bg-white transition-all hover:border-gray-300 focus:-translate-y-0.5 focus:shadow-md cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235F6368%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                    >
                      <option value="" disabled>Select your qualification</option>
                      {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Experience & Motivation */}
              <div className={step === 3 ? 'block' : 'hidden'}>
                <h2 className="text-2xl font-medium text-[#202124] mb-6">Expertise & Vision</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#202124] font-medium mb-3">Key Specialties (Select up to 4)</label>
                    <div className="flex flex-wrap gap-2">
                      {possibleSpecialties.map(spec => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => handleSpecialtyToggle(spec)}
                          disabled={!formData.specialties.includes(spec) && formData.specialties.length >= 4}
                          className={`px-4 py-2 rounded-full border-2 transition-all hover:scale-105 active:scale-95 ${
                            formData.specialties.includes(spec)
                              ? 'border-[#1A73E8] bg-[#1A73E8] text-white shadow-md'
                              : 'border-[#E8EAED] text-[#5F6368] hover:bg-gray-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <span className="text-sm font-medium">{spec}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#202124] font-medium mb-3">Why do you want to join BrainHeal?</label>
                    <textarea 
                      required={step === 3}
                      value={formData.reason}
                      onChange={e => setFormData({...formData, reason: e.target.value})}
                      rows={4}
                      className="w-full border-2 border-[#E8EAED] rounded-xl p-4 text-[#202124] focus:border-[#1A73E8] focus:outline-none resize-none transition-all hover:border-gray-300 focus:-translate-y-1 focus:shadow-lg"
                      placeholder="Share a bit about your therapeutic approach and why our platform resonates with you..."
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-[#E8EAED] mt-8">
                {step > 1 ? (
                  <button 
                    type="button" 
                    onClick={() => setStep(step - 1)}
                    className="text-[#5F6368] font-medium px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                ) : <div />}
                
                <button 
                  type="submit"
                  disabled={isSubmitting || (step === 2 && (!formData.status || !formData.qualification)) || (step === 3 && formData.specialties.length === 0)}
                  className="bg-[#1A73E8] text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#1557B0] hover:scale-105 active:scale-95 transition-all shadow-[0_8px_20px_rgb(26,115,232,0.3)] hover:shadow-[0_12px_25px_rgb(26,115,232,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none group"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : step < 3 ? (
                    <>Next <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <>Submit Application <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </div>

            </form>
          </div>
          
          <div className="mt-8 text-center flex items-center justify-center gap-2 text-[#5F6368] text-sm">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Join 50+ verified professionals changing mental healthcare in India.</span>
          </div>
        </main>
      </div>
    </>
  );
}
