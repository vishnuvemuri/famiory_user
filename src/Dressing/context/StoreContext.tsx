import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StoreContextType {
  filter: string;
  setFilter: (filter: string) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [filter, setFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');

  return (
    <StoreContext.Provider value={{
      filter,
      setFilter,
      cityFilter,
      setCityFilter
    }}>
      {children}
    </StoreContext.Provider>
  );
};