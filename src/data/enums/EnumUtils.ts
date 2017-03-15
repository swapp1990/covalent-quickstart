import {Month} from "./months";
import {ExpenseCategoryName, IncomeCategoryName, TasksCategoryName} from "./categories";

export class EnumUtils {

  static getMonthsString(): string[] {
    var months: string[] = [];
    for(let n in Month) {
      if(typeof Month[n] === 'number') months.push(n);
    }
    //console.log(months);
    return months;
  }

  static getExpenseCategoriesString(): string[] {
    var categories: string[] = [];
    for(let n in ExpenseCategoryName) {
      if(typeof ExpenseCategoryName[n] === 'number') categories.push(n);
    }
    return categories;
  }

  static getExpenseCategories(): any[] {
    var categories: any[] = [];
    for(let n in ExpenseCategoryName) {
      if(typeof ExpenseCategoryName[n] === 'number') {
        let expectedAmount: number = 0;
        if(n === 'Rent') expectedAmount = 1250;
        if(n === 'Utilities') expectedAmount = 150;
        if(n === 'Loan') expectedAmount = 1900;
        if(n === 'Grocery') expectedAmount = 200;
        if(n === 'Food') expectedAmount = 300;
        if(n === 'Coffee') expectedAmount = 150;
        if(n === 'Entertainment') expectedAmount = 200;
        if(n === 'Fitness') expectedAmount = 100;
        if(n === 'Education') expectedAmount = 50;
        if(n === 'Transport') expectedAmount = 100;
        let icon: string = 'local_grocery_store';
        if(n === 'Rent') icon = 'local_hotel';
        if(n === 'Utilities') icon = 'local_phone';
        if(n === 'Loan') icon = 'money_off';
        if(n === 'Grocery') icon = 'local_grocery_store';
        if(n === 'Food') icon = 'local_dining';
        if(n === 'Coffee') icon = 'local_cafe';
        if(n === 'Entertainment') icon = 'live_tv';
        if(n === 'Fitness') icon = 'local_pharmacy';
        if(n === 'Education') icon = 'book';
        if(n === 'Transport') icon = 'local_gas_station';
        let catObject: any = {'name': n, 'expectedAmount': expectedAmount, 'icon': icon};
        categories.push(catObject);
      }
    }
    return categories;
  }

  static getIncomeCategoriesString(): string[] {
    var categories: string[] = [];
    for(let n in IncomeCategoryName) {
      if(typeof IncomeCategoryName[n] === 'number') categories.push(n);
    }
    return categories;
  }

  static getTaskCategoriesString(): string[] {
    var categories: string[] = [];
    for(let n in TasksCategoryName) {
      if(typeof TasksCategoryName[n] === 'number') categories.push(n);
    }
    return categories;
  }
}
