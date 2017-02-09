import {Component, AfterViewInit, ChangeDetectorRef} from '@angular/core';

import { Title }     from '@angular/platform-browser';

import {TdLoadingService, TdMediaService, TdDialogService} from '@covalent/core';

import { ItemsService, UsersService, ProductsService, AlertsService } from '../../services';

import { multi } from './data';
import {TransactionData} from "../../models/transaction";
import {TransactionService} from "../../services/transactions.service";
import {EnumUtils} from "../../data/enums/EnumUtils";
import {Amount, Category} from "../../models/catagory";
import {ComponentType} from "@angular/material";

@Component({
  selector: 'dialog-content',
  template:
    `
      <h1> My Box </h1>
    `
})

export class MyDialogContent {

}

@Component({
  selector: 'qs-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss'],
  viewProviders: [ ],
  entryComponents: [
    MyDialogContent
  ]
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
    { name: 'price', label: 'Price' }
  ];

  categories: Category[]; //Category List

  monthlyData: TransactionData[] = [];

  types: string[] = ["Expense", "Income"];
  selectedType: string = "Expense";
  selectedMonth: string = "November";
  months: any[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  selectedCategory: string = "";
  totalForCategory: number = 0;

  rowSelected: boolean = false;
  selectedTransaction: TransactionData = null;

  createNew: boolean = false;
  isInlineEdit: boolean = false;

  constructor(private transService: TransactionService,
              public media: TdMediaService,
              private _dialogService: TdDialogService,
              private changeDetector: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();
    this.initializeCategories();
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
  }


  getMonthlyDataByCategory(changedCategory: string) {
      this.transService.getMonthlyDataByCategory(this.selectedMonth, changedCategory)
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

  onSelected(category) {
    console.log("Sel ", category);
    this.selectedCategory = category.name;
    this.getMonthlyDataByCategory(category.name);
  }

  onTypeChange() {
    this.initializeCategories();
    this.getMonthlyDataByCategory("");
  }

  onMonthChange() {
    console.log("Month");
    this.getMonthlyDataByCategory(this.selectedCategory);
  }

  onUpdatedDetail(updatedTransaction) {
    //console.log("Updated ", updatedTransaction);
    this.selectedTransaction = updatedTransaction;
    this.updateMonthData(updatedTransaction);
  }

  onSelectTableRow(data) {
    console.log("Dash ", data);
    this.rowSelected = data.selected;
    if(data.selected) {
      this.selectedTransaction = data.row;
      this.createNew = false;
    } else {
      this.selectedTransaction = null;
    }
  }

  createMonthData(data: TransactionData) {
    this.transService.createMonthData(data)
      .subscribe(
        data => {
          console.log("Create ", data);
          this.getMonthlyDataByCategory(this.selectedCategory);
        },
        err => {console.log(err);}
      );
  }

  updateMonthData(data: TransactionData) {
    this.transService.updateMonthlyData(data._id, data)
      .subscribe(
        data => {
          console.log("Updated ", data);
          this.getMonthlyDataByCategory(this.selectedCategory);
        },
        err => {console.log(err);}
      );
  }

  deleteMonthData(data: TransactionData) {
    this.transService.deleteMonthlyData(this.selectedTransaction._id)
      .subscribe (
        data => {
          console.log("Delete " + data);
          this.getMonthlyDataByCategory(this.selectedCategory);
        },
        err => {
          console.log(err);
        }
      );
  }

  onCopyTransaction() {
    this.createMonthData(this.selectedTransaction);
  }

  onDeleteTransaction() {
    this.deleteMonthData(this.selectedTransaction);
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

  onInlineEditClicked() {
    this.isInlineEdit = !this.isInlineEdit;
  }

  openCreateDialog(): void {
    this._dialogService.open(MyDialogContent);
  }

  addTransaction(date: number, name: string, price: number) {
    let newData:TransactionData  = new TransactionData(this.selectedCategory, this.selectedMonth, "false", "false");
    newData.date = date;
    newData.name = name;
    newData.price = price;
    console.log("Data ", newData);
    this.createMonthData(newData);
  }

  ngOnChanges(): void {
    this.getMonthlyDataByCategory(this.selectedCategory);
    this.changeDetector.detectChanges();
  }
}
