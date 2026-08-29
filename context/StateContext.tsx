'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ActiveState = 'Himachal Pradesh' | 'Uttarakhand';

interface StateContextType {
  selectedState: ActiveState;
  setSelectedState: (state: ActiveState) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedState] = useState<ActiveState>('Himachal Pradesh');

  // Load from localStorage if available (client-side only)
  useEffect(() => {
    const savedState = localStorage.getItem('ndrf_selected_state');
    if (savedState === 'Himachal Pradesh' || savedState === 'Uttarakhand') {
      setSelectedState(savedState as ActiveState);
    }
  }, []);

  const handleSetSelectedState = (state: ActiveState) => {
    setSelectedState(state);
    localStorage.setItem('ndrf_selected_state', state);
  };

  return (
    <StateContext.Provider value={{ selectedState, setSelectedState: handleSetSelectedState }}>
      {children}
    </StateContext.Provider>
  );
}

export function useActiveState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useActiveState must be used within a StateProvider');
  }
  return context;
}
