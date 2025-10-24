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
  isDraft?: boolean;
}

interface TravelSettlementState {
  expenses: ExpenseItem[];
  settlements: Settlement[];
  draftSettlements: Settlement[];
}

// 2. Define the actions that can be performed on the state
type Action =
  | { type: 'ADD_EXPENSE'; payload: ExpenseItem }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_SETTLEMENT'; payload: Settlement }
  | { type: 'ADD_DRAFT_SETTLEMENT'; payload: Settlement }
  | { type: 'MOVE_DRAFT_TO_SETTLEMENT'; payload: string }
  | { type: 'SET_EXPENSES'; payload: ExpenseItem[] };

// 3. Define the initial state with some dummy data
const initialState: TravelSettlementState = {
  expenses: [
    {
      id: '1',
      type: 'travel',
      amount: 4500,
      date: '2025-01-20',
      remarks: 'Flight to Mumbai',
      image: 'receipt1.jpg',
      travelRequestNumber: 'TR-2025-001'
    },
    {
      id: '2',
      type: 'lodging',
      amount: 4000,
      date: '2025-01-21',
      remarks: 'Hotel stay',
      image: 'receipt2.jpg',
      travelRequestNumber: 'TR-2025-001'
    },
    {
      id: '3',
      type: 'meals',
      amount: 1200,
      date: '2025-01-21',
      remarks: 'Dinner with client',
      image: null,
      travelRequestNumber: 'TR-2025-002'
    }
  ],
  settlements: [
    {
      requestNumber: 'TR-2025-002',
      status: 'Under Review',
      totalClaimed: 6200,
      totalApproved: 0,
      totalPaid: 0,
      financeReviewer: 'Priya Sharma',
      reviewDate: '2025-01-26',
      expenses: [
        {
          id: '9',
          type: 'meals',
          amount: 1200,
          date: '2025-01-21',
          remarks: 'Dinner with client',
          image: null,
          travelRequestNumber: 'TR-2025-002'
        },
        {
          id: '10',
          type: 'meals',
          amount: 1500,
          date: '2025-01-22',
          remarks: 'Team lunch meeting',
          image: 'lunch_receipt.jpg',
          travelRequestNumber: 'TR-2025-002'
        },
        {
          id: '11',
          type: 'conveyance',
          amount: 3500,
          date: '2025-01-23',
          remarks: 'Local transport and taxi',
          image: 'transport_receipt.jpg',
          travelRequestNumber: 'TR-2025-002'
        }
      ]
    }
  ],
  draftSettlements: [
    {
      requestNumber: 'TR-2025-003',
      status: 'Draft',
      totalClaimed: 4800,
      totalApproved: 0,
      totalPaid: 0,
      financeReviewer: 'Not Assigned',
      reviewDate: new Date().toISOString().split("T")[0],
      expenses: [
        {
          id: '4',
          type: 'travel',
          amount: 2800,
          date: '2025-01-23',
          remarks: 'Train ticket to Chennai',
          image: null,
          travelRequestNumber: 'TR-2025-003'
        },
        {
          id: '5',
          type: 'lodging',
          amount: 2000,
          date: '2025-01-23',
          remarks: 'Hotel accommodation Chennai',
          image: null,
          travelRequestNumber: 'TR-2025-003'
        }
      ],
      isDraft: true
    }
  ]
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
    case 'ADD_DRAFT_SETTLEMENT':
      return {
        ...state,
        draftSettlements: [...state.draftSettlements, { ...action.payload, isDraft: true }],
      };
    case 'MOVE_DRAFT_TO_SETTLEMENT':
      const draftToMove = state.draftSettlements.find(draft => draft.requestNumber === action.payload);
      if (draftToMove) {
        return {
          ...state,
          draftSettlements: state.draftSettlements.filter(draft => draft.requestNumber !== action.payload),
          settlements: [...state.settlements, { ...draftToMove, isDraft: false, status: 'Under Review' }],
        };
      }
      return state;
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
