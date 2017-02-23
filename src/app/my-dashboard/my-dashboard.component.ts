import {Component, AfterViewInit, ChangeDetectorRef} from '@angular/core';

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

@Component({
  selector: 'qs-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss'],
  viewProviders: [ ]
})

export class MyDashboardComponent implements AfterViewInit {

  rows = [
    { price: '453', date: '24', name: 'Swimlane', category: "Grocery" },
    { price: '76', date: '26', name: 'KFC' },
    { price: '25', date: '13', name: 'Burger King' },
  ];

  cols = [
    { name: 'date', label: 'Date' },
    { name: 'name', label: 'Name' },
    { name: 'price', label: 'Price' },
    { name: 'isEssential', label: 'Is Essential?'},
    { name: 'isIncome', label: 'Is Expense?'}
  ];

  categories: Category[]; //Category List

  monthlyData: TransactionData[] = [];

  selectedType: string = "Expense";
  selectedMonth: string = "February";
  selectedYear: string = "2017";

  selectedCategory: string = "";
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
  constructor(private transService: TransactionService,
              public media: TdMediaService,
              private _snackBarService: MdSnackBar,
              private _dialogService: TdDialogService,
              private changeDetector: ChangeDetectorRef) {

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
      EnumUtils.getExpenseCategoriesString().map(expense => {
        this.categories.push({name: expense, icon:'local_grocery_store', monthlyAmount: new Amount(), expectedAmount: 0});
      });
    } else {
      EnumUtils.getIncomeCategoriesString().map(income => {
        this.categories.push({name: income, icon:'local_grocery_store', monthlyAmount: new Amount(), expectedAmount: 0});
      });
    }
    this.selectedCategory = "";
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
            this.changeDetector.detectChanges();
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
            this.changeDetector.detectChanges();
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
      this.selectedMonth = data.month;
    } else if(data.year) {
      this.selectedYear = data.year;
    } else if(data.type) {
      this.selectedType = data.type;
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
    let monthNumber = Month[this.selectedMonth];
    monthNumber = monthNumber + 1;
    if(monthNumber == 12) {
      this.selectedYear = "2017";
      monthNumber = 0;
    }
    this.selectedMonth = Month[monthNumber];
    this.updateRendering();
  }

  onMonthDecrement() {
    let monthNumber = Month[this.selectedMonth];
    monthNumber = monthNumber - 1;
    if(monthNumber == -1) {
      this.selectedYear = "2016";
      monthNumber = 11;
    }
    this.selectedMonth = Month[monthNumber];
    this.updateRendering();
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
    this.changeDetector.detectChanges();
  }
}
