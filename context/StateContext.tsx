'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ActiveState = 'Himachal Pradesh' | 'Uttarakhand' | 'Ladakh' | 'Jammu & Kashmir';

interface StateContextType {
  selectedState: ActiveState;
  setSelectedState: (state: ActiveState) => void;
  lowBandwidth: boolean;
  setLowBandwidth: (value: boolean) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedState] = useState<ActiveState>('Himachal Pradesh');
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);

  // Load from localStorage if available (client-side only)
  useEffect(() => {
    const savedState = localStorage.getItem('ndrf_selected_state');
    if (
      savedState === 'Himachal Pradesh' ||
      savedState === 'Uttarakhand' ||
      savedState === 'Ladakh' ||
      savedState === 'Jammu & Kashmir'
    ) {
      setSelectedState(savedState as ActiveState);
    }

    const savedLowBandwidth = localStorage.getItem('ndrf_low_bandwidth');
    if (savedLowBandwidth === 'true') {
      setLowBandwidth(true);
    }
  }, []);

  const handleSetSelectedState = (state: ActiveState) => {
    setSelectedState(state);
    localStorage.setItem('ndrf_selected_state', state);
  };

  const handleSetLowBandwidth = (val: boolean) => {
    setLowBandwidth(val);
    localStorage.setItem('ndrf_low_bandwidth', String(val));
  };

  return (
    <StateContext.Provider
      value={{
        selectedState,
        setSelectedState: handleSetSelectedState,
        lowBandwidth,
        setLowBandwidth: handleSetLowBandwidth,
      }}
    >
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
