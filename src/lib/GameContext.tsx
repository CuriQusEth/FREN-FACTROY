import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface Fren {
  id: string;
  name: string;
  rarity: Rarity;
  productionRate: number; // Goo per second
}

interface GameState {
  goo: number;
  frenTokens: number;
  frens: Fren[];
  frensProducing: boolean;
}

type Action =
  | { type: 'CLICK_PRODUCE' }
  | { type: 'TICK', payload: { gooGenerated: number, frenGenerated: number } }
  | { type: 'HATCH_FREN', payload: { cost: number; newFren: Fren } }
  | { type: 'MERGE_FRENS', payload: { id1: string; id2: string; newFren: Fren } }
  | { type: 'TOGGLE_PRODUCTION' };

const initialState: GameState = {
  goo: 0,
  frenTokens: 0,
  frens: [],
  frensProducing: true,
};

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'CLICK_PRODUCE':
      return { ...state, goo: state.goo + 10 };
    case 'TICK':
      return { 
        ...state, 
        goo: state.goo + action.payload.gooGenerated,
        frenTokens: state.frenTokens + action.payload.frenGenerated
      };
    case 'HATCH_FREN':
      if (state.goo < action.payload.cost) return state;
      return {
        ...state,
        goo: state.goo - action.payload.cost,
        frens: [...state.frens, action.payload.newFren],
      };
    case 'MERGE_FRENS': {
      const frensWithoutMerged = state.frens.filter(
        (f) => f.id !== action.payload.id1 && f.id !== action.payload.id2
      );
      return {
        ...state,
        frens: [...frensWithoutMerged, action.payload.newFren],
      };
    }
    case 'TOGGLE_PRODUCTION':
      return { ...state, frensProducing: !state.frensProducing };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.frensProducing) {
        const totalRate = state.frens.reduce((sum, f) => sum + f.productionRate, 0);
        // Passive $FREN yield based on total rarity or something
        const passiveTokenYield = state.frens.length > 0 ? state.frens.length * 0.1 : 0;
        
        dispatch({ type: 'TICK', payload: { gooGenerated: totalRate, frenGenerated: passiveTokenYield } });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.frens, state.frensProducing]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
