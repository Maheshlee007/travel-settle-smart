import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// 1. Define the shape of our state
interface ExpenseItem {
  id: string;
  type: string;
  amount: number;
  date: string;
  remarks: string;
  image: string | null;
  travelRequestNumber: string;
}

interface Settlement {
  requestNumber: string;
  status: string;
  totalClaimed: number;
  totalApproved: number;
  totalPaid: number;
  financeReviewer: string;
  reviewDate: string;
  expenses: ExpenseItem[];
}

interface TravelSettlementState {
  expenses: ExpenseItem[];
  settlements: Settlement[];
}

// 2. Define the actions that can be performed on the state
type Action =
  | { type: 'ADD_EXPENSE'; payload: ExpenseItem }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_SETTLEMENT'; payload: Settlement }
  | { type: 'SET_EXPENSES'; payload: ExpenseItem[] };

// 3. Define the initial state with some dummy data
const initialState: TravelSettlementState = {
  expenses: [
    {
      id: '1',
      type: 'travel',
      amount: 2500,
      date: '2025-01-20',
      remarks: 'Flight to Mumbai',
      image: 'receipt1.jpg',
      travelRequestNumber: 'TR-2025-001'
    },
    {
      id: '2',
      type: 'lodging',
      amount: 3000,
      date: '2025-01-21',
      remarks: 'Hotel stay',
      image: 'receipt2.jpg',
      travelRequestNumber: 'TR-2025-001'
    },
    {
      id: '3',
      type: 'meals',
      amount: 800,
      date: '2025-01-21',
      remarks: 'Dinner with client',
      image: null,
      travelRequestNumber: 'TR-2025-002'
    }
  ],
  settlements: [
    {
      requestNumber: 'TR-2025-001',
      status: 'Under Review',
      totalClaimed: 5500,
      totalApproved: 0,
      totalPaid: 0,
      financeReviewer: 'Anil Kapoor',
      reviewDate: '2025-01-25',
      expenses: []
    }
  ],
};

// 4. Create the reducer function to handle state changes
const travelSettlementReducer = (state: TravelSettlementState, action: Action): TravelSettlementState => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    case 'ADD_SETTLEMENT':
      return {
        ...state,
        settlements: [...state.settlements, action.payload],
      };
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
      };
    default:
      return state;
  }
};

// 5. Create the context
const TravelSettlementContext = createContext<{
  state: TravelSettlementState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// 6. Create a provider component
export const TravelSettlementProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(travelSettlementReducer, initialState);

  return (
    <TravelSettlementContext.Provider value={{ state, dispatch }}>
      {children}
    </TravelSettlementContext.Provider>
  );
};

// 7. Create a custom hook for easy access to the context
export const useTravelSettlement = () => {
  const context = useContext(TravelSettlementContext);
  if (context === undefined) {
    throw new Error('useTravelSettlement must be used within a TravelSettlementProvider');
  }
  return context;
};
