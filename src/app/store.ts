import { Action } from 'redux';
import { CounterActions } from './actions';

export interface IPayloadAction extends Action {
  payload?: any;
  error?: any;
}

export interface AppState {
  counter: number;
  selectedMonth: string;
  selectedYear: string;
  selectedCategory: string;
  selectedType: string;
  totalIncome: number;
  totalExpense: number;
  searchText: string
}

export const INITIAL_STATE: AppState = {
  counter: 0,
  selectedMonth: 'March',
  selectedYear: '2017',
  selectedCategory: '',
  selectedType: 'Expense',
  totalIncome: 0,
  totalExpense: 0,
  searchText: 'Seasons'
};

export function rootReducer(state: AppState, action: IPayloadAction): AppState {
  switch (action.type) {
    case CounterActions.INCREMENT: {
      state.counter = state.counter + 1;
      return state;
    }
    case CounterActions.DECREMENT: {
      state.counter = state.counter - 1;
      return state;
    }
    case CounterActions.MONTH: {
      state.selectedMonth = action.payload;
      return state;
    }
    case CounterActions.YEAR: {
      state.selectedYear = action.payload;
      return state;
    }
    case CounterActions.CATEGORY: {
      state.selectedCategory = action.payload;
      return state;
    }
    case CounterActions.TYPE: {
      state.selectedType = action.payload;
      return state;
    }
    case CounterActions.TOTALEXPENSE: {
      state.totalExpense = action.payload;
      return state;
    }
    case CounterActions.TOTALINCOME: {
      state.totalIncome = action.payload;
      return state;
    }
    case CounterActions.SEARCHTEXT: {
      state.searchText = action.payload;
      return state;
    }
    default: return state;
  }
}
