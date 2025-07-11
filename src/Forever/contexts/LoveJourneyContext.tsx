import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  mediaFiles: MediaFile[];
  createdAt: string;
  category: 'proposal' | 'engagement' | 'family' | 'party';
}

export interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  size: number;
}

interface LoveJourneyState {
  memories: Memory[];
  activeTab: string;
  backgroundImage: string;
  isLoading: boolean;
}

type LoveJourneyAction =
  | { type: 'SET_MEMORIES'; payload: Memory[] }
  | { type: 'ADD_MEMORY'; payload: Memory }
  | { type: 'UPDATE_MEMORY'; payload: Memory }
  | { type: 'DELETE_MEMORY'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_BACKGROUND_IMAGE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: LoveJourneyState = {
  memories: [],
  activeTab: 'proposal',
  backgroundImage: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  isLoading: false,
};

const loveJourneyReducer = (state: LoveJourneyState, action: LoveJourneyAction): LoveJourneyState => {
  switch (action.type) {
    case 'SET_MEMORIES':
      return { ...state, memories: action.payload };
    case 'ADD_MEMORY':
      return { ...state, memories: [...state.memories, action.payload] };
    case 'UPDATE_MEMORY':
      return {
        ...state,
        memories: state.memories.map(memory =>
          memory.id === action.payload.id ? action.payload : memory
        ),
      };
    case 'DELETE_MEMORY':
      return {
        ...state,
        memories: state.memories.filter(memory => memory.id !== action.payload),
      };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_BACKGROUND_IMAGE':
      return { ...state, backgroundImage: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface LoveJourneyContextType {
  state: LoveJourneyState;
  dispatch: React.Dispatch<LoveJourneyAction>;
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  updateMemory: (memory: Memory) => void;
  deleteMemory: (id: string) => void;
  setActiveTab: (tab: string) => void;
  setBackgroundImage: (url: string) => void;
}

const LoveJourneyContext = createContext<LoveJourneyContextType | undefined>(undefined);

export const LoveJourneyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(loveJourneyReducer, initialState);

  const addMemory = (memory: Omit<Memory, 'id' | 'createdAt'>) => {
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MEMORY', payload: newMemory });
  };

  const updateMemory = (memory: Memory) => {
    dispatch({ type: 'UPDATE_MEMORY', payload: memory });
  };

  const deleteMemory = (id: string) => {
    dispatch({ type: 'DELETE_MEMORY', payload: id });
  };

  const setActiveTab = (tab: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  };

  const setBackgroundImage = (url: string) => {
    dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: url });
  };

  const value = {
    state,
    dispatch,
    addMemory,
    updateMemory,
    deleteMemory,
    setActiveTab,
    setBackgroundImage,
  };

  return (
    <LoveJourneyContext.Provider value={value}>
      {children}
    </LoveJourneyContext.Provider>
  );
};

export const useLoveJourney = () => {
  const context = useContext(LoveJourneyContext);
  if (context === undefined) {
    throw new Error('useLoveJourney must be used within a LoveJourneyProvider');
  }
  return context;
};