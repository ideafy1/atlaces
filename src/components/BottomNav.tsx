import React from 'react';
import { Home, Brain, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Home', Icon: Home, path: '/' },
  { label: 'Therapy', Icon: Brain, path: '/therapy' },
  { label: 'Community', Icon: Users, path: '/community' },
];

interface BottomNavProps {
  active: number;
  onChange: (index: number) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  const navigate = useNavigate();

  const handleTap = (i: number) => {
    onChange(i);
    navigate(tabs[i].path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div style={{ background: 'rgba(10,10,10,0.94)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', boxShadow: '0 -4px 30px rgba(0,0,0,0.15)', borderRadius: '24px 24px 0 0' }}>
        <div className="relative flex items-center max-w-md mx-auto">
          {/* Sliding pill */}
          <div className="absolute top-1.5 bottom-1.5 rounded-2xl pointer-events-none"
            style={{ width: `${100 / tabs.length}%`, left: 0, transform: `translateX(${active * 100}%)`, background: 'rgba(255,255,255,0.1)', transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] w-8 rounded-full" style={{ background: 'rgba(255,255,255,0.8)' }} />
          </div>

          {tabs.map((tab, i) => {
            const isActive = active === i;
            return (
              <button key={i} onClick={() => handleTap(i)} className="relative z-10 flex-1 flex flex-col items-center justify-center gap-1 py-3.5">
                <tab.Icon size={isActive ? 23 : 21} strokeWidth={isActive ? 2.3 : 1.6} fill={isActive ? 'currentColor' : 'none'}
                  style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)', transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)', filter: isActive ? 'drop-shadow(0 0 6px rgba(255,255,255,0.2))' : 'none' }} />
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)', transition: 'color 0.3s ease' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
