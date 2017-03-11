import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AppState } from './store';

@Injectable()
export class CounterActions {
  static INCREMENT = 'INCREMENT';
  static DECREMENT = 'DECREMENT';
  static MONTH = 'MONTH';
  static YEAR = 'YEAR';
  static TYPE = 'TYPE';
  static CATEGORY = 'CATEGORY';
  static TOTALEXPENSE = 'TOTALEXPENSE';
  static TOTALINCOME = 'TOTALINCOME';

  constructor(private ngRedux: NgRedux<AppState>) {}

  increment() {
    this.ngRedux.dispatch({ type: CounterActions.INCREMENT });
  }

  decrement() {
    this.ngRedux.dispatch({ type: CounterActions.DECREMENT });
  }

  month(selectedMonth: string) {
    this.ngRedux.dispatch({ type: CounterActions.MONTH, payload: selectedMonth });
  }

  year(selectedYear: string) {
    this.ngRedux.dispatch({ type: CounterActions.YEAR, payload: selectedYear });
  }

  category(selectedCategory: string) {
    this.ngRedux.dispatch({ type: CounterActions.CATEGORY, payload: selectedCategory });
  }

  type(selectedType: string) {
    this.ngRedux.dispatch({ type: CounterActions.TYPE, payload: selectedType });
  }

  totalIncome(value: number) {
    this.ngRedux.dispatch({ type: CounterActions.TOTALINCOME, payload: value });
  }

  totalExpense(value: number) {
    this.ngRedux.dispatch({ type: CounterActions.TOTALEXPENSE, payload: value });
  }
}
