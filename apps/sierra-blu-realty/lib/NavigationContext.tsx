"use client";
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type Screen =
  | 'dashboard' | 'listings' | 'crm' | 'leads' | 'reports'
  | 'team' | 'clients' | 'protocols' | 'media' | 'experiences'
  | 'ledger' | 'sync' | 'processing' | 'nexus' | 'intelligence';

interface NavigationContextType {
  activeScreen: Screen;
  navigate: (screen: Screen) => void;
  previousScreen: Screen | null;
}

const NavigationContext = createContext<NavigationContextType>({
  activeScreen: 'dashboard',
  navigate: () => {},
  previousScreen: null,
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);

  const navigate = useCallback((screen: Screen) => {
    setPreviousScreen(activeScreen);
    setActiveScreen(screen);
  }, [activeScreen]);

  const value = useMemo(
    () => ({ activeScreen, navigate, previousScreen }),
    [activeScreen, navigate, previousScreen]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);
