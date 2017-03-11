import {Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild} from "@angular/core";
import {Month} from "../../data/enums/months";
import {NgRedux, select, DevToolsExtension} from "@angular-redux/store";
import {AppState, INITIAL_STATE, rootReducer} from "../store";
import {Observable} from "rxjs/Rx";
import {CounterActions} from "../actions";
import {TableDialog} from "../shared/datatable/covalent/table-dialogs.component";

@Component({
    selector: 'current-month-bar',
    template: `
     <div style="width: 350px" layout="row" flex hide-gt-lg hide-gt-md>
      <md-card class="my-md-card" flex="10">
        <md-card-content layout="row" layout-align="center center">
          <a md-icon-button (click)="onMonthDecrement()"><md-icon>fast_rewind</md-icon> </a>
        </md-card-content>
      </md-card>
      <md-card class="my-md-card" flex="80">
        <md-card-title layout="row" layout-align="center center">
          <h3 align="center" style="margin-top: 0px; margin-bottom: 0px;">
            <span style="color:blue">+{{totalIncome$ | async}}</span>
              /<span style="color:red">-{{totalExpense$ | async}}</span>
          </h3>
        </md-card-title>
        <md-card-subtitle layout="row" layout-align="center center">
          {{ selectedMonth$ | async }}, {{ selectedYear$ | async }}
        </md-card-subtitle>
      </md-card>
      <md-card class="my-md-card" flex="10">
        <md-card-content layout="row" layout-align="center center">
          <a md-icon-button (click)="onMonthIncrement()"><md-icon>fast_forward</md-icon> </a>
        </md-card-content>
      </md-card>
        <!--<p>The counter value is {{ counter$ | async }}</p>-->
        <!--<p>-->
          <!--<button (click)="actions.increment()">+</button>-->
          <!--<button (click)="actions.decrement()">-</button>-->
        <!--</p>-->
      <button td-menu-button><md-icon (click)="onSettings($event)">settings</md-icon></button>
      <table-dialog #td></table-dialog>
    </div>    

    `,
    styles: [`
      .my-md-card {
        margin: 2px;
      }
      
      .my-md-card md-card-content {
        padding: 2px;
        height: 100%;
      }
      
      .my-md-card md-card-title {
        padding: 2px;
        margin: 0px;
      }
    `]
})

export class CurrentMonthTitle {

  @select() readonly counter$:Observable<number>;
  @select() readonly selectedMonth$:Observable<string>;
  @select() readonly selectedYear$:Observable<string>;

  selectedMonth: string = "February";
  selectedYear: string = "2017";
  selectedType: string = "Expense";

  @select() readonly totalIncome$:Observable<number>;
  @select() readonly totalExpense$:Observable<number>;

  @ViewChild('td') tableDialog: TableDialog;

  constructor(private changeDetector:ChangeDetectorRef,
              private actions:CounterActions) {

  }

  ngOnInit() {
    this.selectedMonth$.subscribe((data) => {
      this.selectedMonth = data;
    });
    this.selectedYear$.subscribe((data) => {
      this.selectedYear = data;
    });
  }

  ngOnContentInit() {

  }

  ngAfterViewInit() {

  }

  onMonthIncrement() {
    let monthNumber = Month[this.selectedMonth];
    monthNumber = monthNumber + 1;
    if(monthNumber == 12) {
      this.selectedYear = "2017";
      monthNumber = 0;
      this.actions.year(this.selectedYear);
    }
    this.selectedMonth = Month[monthNumber];

    this.actions.month(this.selectedMonth);
  }

  onMonthDecrement() {
    let monthNumber = Month[this.selectedMonth];
    monthNumber = monthNumber - 1;
    if(monthNumber == -1) {
      this.selectedYear = "2016";
      monthNumber = 11;
      this.actions.year(this.selectedYear);
    }
    this.selectedMonth = Month[monthNumber];

    this.actions.month(this.selectedMonth);
  }

  onSettings() {
    let settingsData: any = {
      isIncome: this.selectedType,
      types: ["Expense", "Income"],
      displayType: 'Toggle'
    }

    this.tableDialog.showDialogMain('Settings', settingsData)
      .subscribe((value: any) => {
        console.log("Show ", value);
        this.selectedType = value.selectedType;
        this.actions.type(this.selectedType);
      });
  }
}

