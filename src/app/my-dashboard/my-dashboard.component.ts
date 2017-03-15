import {Component, AfterViewInit, ChangeDetectorRef, ViewChild} from '@angular/core';

import { Title }     from '@angular/platform-browser';

import {TdLoadingService, TdMediaService, TdDialogService} from '@covalent/core';

import { ItemsService, UsersService, ProductsService, AlertsService } from '../../services';

import { multi } from './data';
import {TransactionData} from "../../models/transaction";
import {TransactionService} from "../../services/transactions.service";
import {EnumUtils} from "../../data/enums/EnumUtils";
import {Amount, Category} from "../../models/catagory";
import {ComponentType, MdSnackBar} from "@angular/material";
import {Month} from "../../data/enums/months";
import {TableDialog} from "../shared/datatable/covalent/table-dialogs.component";
import {Observable} from "rxjs/Rx";
import {NgRedux, select, DevToolsExtension} from "@angular-redux/store";
import {AppState} from "../store";
import {CounterActions} from "../actions";

@Component({
  selector: 'qs-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss'],
  viewProviders: [ ]
})

export class MyDashboardComponent implements AfterViewInit {

  @ViewChild('td') tableDialog: TableDialog;

  cols = [
    { name: 'date', label: 'Date' },
    { name: 'name', label: 'Name' },
    { name: 'price', label: 'Price' },
    { name: 'isEssential', label: 'Is Essential?', type: 'checkbox'},
    { name: 'isIncome', label: 'Is Expense?'},
    { name: 'month', label: 'Month', type: 'month'}
  ];

  categories: Category[]; //Category List

  monthlyData: TransactionData[] = [];

  selectedType: string = "Expense";
  selectedMonth: string = "February";
  selectedYear: string = "2017";
  @select() readonly selectedMonth$: Observable<string>;
  @select() readonly selectedYear$: Observable<string>;

  selectedCategory: string = "All";
  totalForCategory: number = 0;

  rowSelected: boolean = false;
  selectedRows: TransactionData[] = [];

  createNew: boolean = false;
  isInlineEdit: boolean = false;
  isMultipleEdit: boolean = false;

  totalIncome: number = 0;
  totalExpense: number = 0;
  highestSpentName: string = "Nothing";

  totalAmountByType: number = 0;
  totalAmountOnceByType: number = 0;

  color: string;

  chips: Object = [
    { name: 'Default', color: '', selected: false },
    { name: 'Default (selected)', color: '', selected: true },
    { name: 'Primary (selected)', color: 'primary', selected: true },
    { name: 'Accent (selected)', color: 'accent', selected: true },
    { name: 'Warn (selected)', color: 'warn', selected: true },
  ];
  constructor(private transService: TransactionService,
              public media: TdMediaService,
              private _snackBarService: MdSnackBar,
              private _dialogService: TdDialogService,
              private changeDetector: ChangeDetectorRef,
              private ngRedux: NgRedux<AppState>,
              private actions: CounterActions) {

    // let data1: TransactionData = new TransactionData('Grocery', '2017', 'January', 'false', 'false');
    // data1.price = 450; data1.name="Smith's"; data1.date = 21;
    // this.monthlyData.push(data1);
    //
    // let data2: TransactionData = new TransactionData('Grocery', '2017', 'January', 'false', 'false');
    // data2.price = 32; data2.name="Indian Store"; data2.date = 12;
    // this.monthlyData.push(data2);
  }

  ngOnInit() {
    this.ngRedux.subscribe(() => {
      let newState = this.ngRedux.getState();
      if(this.selectedMonth !== newState.selectedMonth
        || this.selectedYear !== newState.selectedYear
        || this.selectedType !== newState.selectedType) {
        this.selectedMonth = newState.selectedMonth;
        this.selectedYear = newState.selectedYear;
        this.selectedType = newState.selectedType;
        this.updateRendering();
      }
    });
  }

  updateFromStore() {
    console.log("Change in Month");
    this.updateRendering();
  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this.initializeCategories();
    this.getTotalExpense(this.selectedMonth, this.selectedYear);
    this.getMonthlyDataByCategory("");
  }

  //Show Categories
  initializeCategories() {
    this.categories = [];
    if(this.selectedType === "Expense") {
      EnumUtils.getExpenseCategories().map(expense => {
        this.categories.push({name: expense.name, icon: expense.icon,
                              monthlyAmount: new Amount(), expectedAmount: expense.expectedAmount});
      });
    } else {
      EnumUtils.getIncomeCategoriesString().map(income => {
        this.categories.push({name: income, icon:'local_grocery_store', monthlyAmount: new Amount(), expectedAmount: 0});
      });
    }
    this.calculateTotalAmount(this.selectedMonth, this.selectedYear);
  }

  resetEachCategoryTotal() {
    this.totalAmountByType = 0;
    this.totalAmountOnceByType = 0;
    this.categories.map((category: Category) => {
      category.monthlyAmount = new Amount();
    });
  }

  getTotalExpense(month, year) {
    this.transService.monthGetTotalExpense(month, year)
      .subscribe (
        totalExpense => {
          if(totalExpense.length > 0) {
            this.totalExpense = totalExpense[0].balance;
            this.totalExpense = Math.round(this.totalExpense);
            this.actions.totalExpense(this.totalExpense);
            this.changeDetector.detectChanges();
          } else {
            this.actions.totalExpense(0);
          }
        });
  }

  getTotalIncome(month, year) {
    this.transService.monthGetTotalIncome(month, year)
      .subscribe (
        totalIncome => {
          if(totalIncome.length > 0) {
            this.totalIncome = totalIncome[0].balance;
            this.totalIncome = Math.round(this.totalIncome);
            this.actions.totalIncome(this.totalIncome);
            this.changeDetector.detectChanges();
          } else {
            this.actions.totalExpense(0);
          }
        });
  }

  //Total Spent for Monthly Data.
  calculateTotalAmount(month, year) {
    this.resetEachCategoryTotal();
    this.transService.monthGetAllAmount(month, year)
      .subscribe (
        amountData => {
          amountData.map(body => {
            this.setEachCategoryTotal(body._id.category, body.balance);
            //console.log("Total Amount by Type:" + this.totalAmountByType);
          });
        });
  }

  //Sets amount for each category and also calculates total amount.
  setEachCategoryTotal(categoryName: string, totalAmount: number) {
    this.categories.map((category: Category) => {
      if(category.name === categoryName) {
        category.monthlyAmount.total = Math.round(totalAmount);
        if(category.name === this.selectedCategory) {
          this.totalForCategory = category.monthlyAmount.total;
        }
        this.totalAmountByType += category.monthlyAmount.total;
        this.totalAmountByType = Math.round(this.totalAmountByType);
      }
    });
  }

  getMonthlyDataByCategory(changedCategory: string) {
    if(changedCategory === "All") {
      changedCategory = "";
    }
    this.transService.getMonthlyDataByCategory(this.selectedYear, this.selectedMonth, changedCategory)
      .subscribe (
        (monthlyData: TransactionData[]) => {
          this.monthlyData = monthlyData;
          //console.log("Get Data", this.monthlyData);
          console.log("Got Data ", this.monthlyData.length);
          if(this.monthlyData.length == 0) {
            this.rowSelected = false;
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  updateRendering() {
    this.totalForCategory = 0;
    this.totalExpense = 0;
    this.totalIncome = 0;
    this.initializeCategories();
    this.getMonthlyDataByCategory(this.selectedCategory);
    this.getTotalExpense(this.selectedMonth, this.selectedYear);
    this.calculateTotalAmount(this.selectedMonth, this.selectedYear);
    this.getTotalIncome(this.selectedMonth, this.selectedYear);
  }

  onSelected(category) {
    //console.log("Sel ", category);
    this.selectedCategory = category.name;
    this.calculateTotalAmount(this.selectedMonth, this.selectedYear);
    this.getMonthlyDataByCategory(category.name);
  }

  onTypeChange() {
    this.initializeCategories();
    this.selectedCategory = this.categories[0].name;
    this.getMonthlyDataByCategory(this.selectedCategory);
  }

  onMonthChange() {
    //console.log("Month");
    this.updateRendering();
  }

  onYearChange() {
    this.updateRendering();
  }

  onUpdatedDetail(updatedTransaction) {
    //console.log("Updated ", updatedTransaction);
    if(!this.isMultipleEdit) {
      this.updateMonthData(updatedTransaction);
    }
  }

  onSelectTableRow(data) {
    //console.log("Dash ", data);
    this.rowSelected = data.selected;
    if(!this.isMultipleEdit) {
      if(data.selected) {
        this.createNew = false;
      }
      console.log(" Mul: ", this.selectedRows);
    } else {
      if(data.selected) {

      } else {

      }
      console.log(" Mul: ", this.selectedRows);
    }
  }

  getSelectedData() {
    if(!this.isMultipleEdit) {
      if(this.selectedRows.length > 0) {
        let lastSelectedRow: TransactionData = this.selectedRows[this.selectedRows.length-1];
        if(lastSelectedRow && lastSelectedRow.details) {
          return this.selectedRows[this.selectedRows.length-1];
        }
      }
    }
    return null;
  }

  createMonthData(data: TransactionData) {
    this.transService.createMonthData(data)
      .subscribe(
        data => {
          console.log("Create ", data);
          this._snackBarService.open('Create Success!', 'Close', { duration: 3000 });
          this.updateRendering();
          this.selectedRows = [];
          this.rowSelected = false;
        },
        err => {console.log(err);}
      );
  }

  updateMonthData(data: TransactionData) {
    if(!data.year) {
      data.year = "2016";
    }
    if(data.isIncome === "false") {
      data.isIncome = "Expense";
    }
    this.transService.updateMonthlyData(data._id, data)
      .subscribe(
        data => {
          //console.log("Updated ", data);
          this._snackBarService.open('Update Success!', 'Close', { duration: 3000 });
          this.updateRendering();
        },
        err => {console.log(err);}
      );
  }

  deleteMonthData(data: TransactionData) {
    this.transService.deleteMonthlyData(data._id)
      .subscribe (
        data => {
          //console.log("Delete " + data);
          this._snackBarService.open('Delete Success!', 'Close', { duration: 3000 });
          this.selectedRows = [];
          this.updateRendering();
          this.rowSelected = false;
        },
        err => {
          console.log(err);
        }
      );
  }

  onCopyTransaction() {
    if(!this.isMultipleEdit) {
      this.createMonthData(this.selectedRows[0]);
    }
  }

  onDeleteTransaction() {
    if(!this.isMultipleEdit) {
      this.deleteMonthData(this.selectedRows[0]);
    }
  }

  onEditTransaction() {
    this.openCreateDialog();
  }

  onCreateClicked() {
    this.createNew = !this.createNew;
  }

  onUpdateRow(row) {
    //console.log("On ", row);
    this.updateMonthData(row);
  }

  onSelection(data) {
    if(data.month) {
      //this.selectedMonth = data.month;
    } else if(data.year) {
      //this.selectedYear = data.year;
    } else if(data.type) {
      //this.selectedType = data.type;
    }
    this.updateRendering();
    console.log("Mon ", this.selectedMonth);
  }

  onDateChangedMobile() {

  }

  onInlineEditClicked() {
    if(!this.isInlineEdit && !this.isMultipleEdit) {
      this.isMultipleEdit = true;
      this.isInlineEdit = false;
    }
    else if(this.isMultipleEdit) {
      this.isInlineEdit = true;
      this.isMultipleEdit = false;
      this.rowSelected = false;
      this.selectedRows = [];
    }
    else if(this.isInlineEdit) {
      this.isInlineEdit = false;
      this.isMultipleEdit = false;
    }
  }

  onMonthIncrement() {

  }

  onMonthDecrement() {

  }

  onSettings() {
    let settingsData: any = {
      isIncome: this.selectedType,
      types: ["Expense", "Income"],
      displayType: 'Toggle'
    }
    console.log("Set ", settingsData);
    this.tableDialog.showDialogMain('Settings', settingsData)
      .subscribe((value: any) => {
        console.log("Show ", value);
        this.selectedType = value.selectedType;
        this.updateRendering();
      });
  }

  openCreateDialog(): void {
    //this._dialogService.open(MyDialogContent);
  }

  addTransaction(date: number, name: string, price: number) {
    let newData:TransactionData  = new TransactionData(this.selectedCategory, this.selectedYear, this.selectedMonth, this.selectedType, "false");
    newData.date = date;
    newData.name = name;
    newData.price = price;
    //console.log("Data ", newData);
    this.createMonthData(newData);
  }

  ngOnChanges(): void {
    this.getMonthlyDataByCategory(this.selectedCategory);
    this.selectedMonth$.subscribe((data) => {
      this.selectedMonth = data;
      this.updateFromStore();
    });
    this.changeDetector.detectChanges();
  }
}
