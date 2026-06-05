import React from 'react';
import { Compass, Map, Activity, LayoutDashboard } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setTab: (tab: string) => void;
  isArabic: boolean;
}

export default function MobileBottomNav({ currentTab, setTab, isArabic }: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 w-full bg-background/95 backdrop-blur-md text-foreground pb-safe z-50 border-t border-border lg:hidden" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex justify-around items-center h-[68px]">
        <button 
          onClick={() => setTab('explore')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentTab === 'explore' ? 'text-primary' : 'text-foreground/50 hover:text-primary'}`}
        >
          <Compass size={22} />
          <span className="text-[10px] font-medium">{isArabic ? 'استكشف' : 'Explore'}</span>
        </button>
        <button 
          onClick={() => setTab('map')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentTab === 'map' ? 'text-primary' : 'text-foreground/50 hover:text-primary'}`}
        >
          <Map size={22} />
          <span className="text-[10px] font-medium">{isArabic ? 'الخريطة' : 'Map'}</span>
        </button>
        <button 
          onClick={() => setTab('yields')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentTab === 'yields' ? 'text-primary' : 'text-foreground/50 hover:text-primary'}`}
        >
          <Activity size={22} />
          <span className="text-[10px] font-medium">{isArabic ? 'العوائد' : 'Yields'}</span>
        </button>
        <button 
          onClick={() => setTab('console')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentTab === 'console' ? 'text-primary' : 'text-foreground/50 hover:text-primary'}`}
        >
          <LayoutDashboard size={22} />
          <span className="text-[10px] font-medium">{isArabic ? 'وحدة التحكم' : 'Console'}</span>
        </button>
      </div>
    </div>
  );
}
