import {Component, Input, Output, EventEmitter, AfterViewInit, ChangeDetectorRef} from "@angular/core";
import {TdChartsComponent} from "@covalent/charts";
import {TransactionData} from "../../models/transaction";
import {TransactionService} from "../../services/transactions.service";
import {Month} from "../../data/enums/months";

@Component({
  selector: 'search-view',
  template:
    `
      <td-layout-nav logo="assets:covalent">
        <md-card tdMediaToggle="gt-xs" [mediaClasses]="['push']">
           <td-search-box class="push-left push-right" placeholder="search" [alwaysVisible]="true"
           (searchDebounce)="filterResult($event)" (search)="onSearchEnter($event)"></td-search-box>
            <td-chips [items]="items" [(ngModel)]="itemsRequireMatch" 
            [readOnly]="false" (remove)="onRemoveChip($event)" requireMatch></td-chips>      

           <button *ngIf="rowSelected" (click)="onCopyTransaction()" md-icon-button>
                    <md-icon>content_copy</md-icon>
           </button>
           <button *ngIf="rowSelected" (click)="onDeleteTransaction()" md-icon-button>
                    <md-icon>delete</md-icon>
           </button>
           <button *ngIf="!rowSelected" (click)="onInlineEditClicked()"md-icon-button>
             <md-icon>edit</md-icon>
           </button>
           <md-divider></md-divider>
           <my-table [rows]="data" [cols]="cols" [isInlineEdit]="isInlineEdit" [showPageBar]="true"
                        [searchHighlightText]="searchText"
                        (selectOutput)="onSelectTableRow($event)"
                        (updatedRow)="onUpdateRow($event)"></my-table>
        </md-card>
 
        <md-card *ngIf="rowSelected">
          <detail-view [inputData]="selectedTransaction" (updatedDetails)="onUpdatedDetail($event)"></detail-view>
        </md-card>
        <!--<md-card tdMediaToggle="gt-xs" [mediaClasses]="['push']">-->
          <!--<td-charts title="Sales Bar Chart"-->
                  <!--[shadow]="true"-->
                  <!--fillOpacity="0.95">-->
          <!--<td-axis-x [link]="chartBar1" [ticks]="true" [show]="true" [grid]="true"  legend="Day Offset"></td-axis-x>-->
          <!--<td-axis-y-left [link]="chartBar1" [show]="true" [grid]="false" legend="Sales"></td-axis-y-left>-->
          <!--<td-chart-bar #chartBar1 [colors]="['pink', 'deepPurple']"-->
                        <!--[data]="graphData"-->
                        <!--[padding]="0.1"-->
                        <!--bottomAxis="x"-->
                        <!--columns="y"-->
                        <!--[transition]="true"-->
                        <!--transitionDuration="1000"-->
                        <!--transitionDelay="3000">-->
          <!--</td-chart-bar>-->
        <!--</td-charts>-->
        <!--</md-card>-->
        <!---->
        <!--<td-layout-footer>-->
          <!--<div layout="row" layout-align="start center">-->
          <!--<span class="md-caption">Copyright &copy; 2017 OldMonk90. All rights reserved</span>-->
          <!--<span flex></span>-->
          <!--<md-icon class="md-icon-ux" svgIcon="assets:teradata-ux"></md-icon>-->
          <!--</div>-->
        <!--</td-layout-footer>-->
      </td-layout-nav>

    `,
  providers: [TdChartsComponent]
})

export class MySearchView implements AfterViewInit {
  rows = [
    { price: '453', date: '24', name: 'Swimlane', category: "Grocery", month: "January", year: "2017" },
    { price: '76', date: '26', name: 'KFC',category: "Grocery", month: "January", year: "2017" },
    { price: '25', date: '13', name: 'Burger King',category: "Grocery", month: "January", year: "2017" },
  ];

  data: TransactionData[] = [];

  items: string[] = [];
  itemsRequireMatch: string[] = this.items.slice(0, 6);

  cols = [
    { name: 'category', label: 'Category' },
    { name: 'month', label: 'Month' },
    { name: 'year', label: 'Year' },
    { name: 'date', label: 'Date' },
    { name: 'name', label: 'Name' },
    { name: 'price', label: 'Price' },
    { name: 'isEssential', label: 'Is Essential?'},
    { name: 'details', label: 'Details', isJsonColumn: true}
  ];

  graphData: any = [
    {'x': 'Jan', 'y': 0},
    {'x': 'Feb', 'y': 0},
    {'x': 'Mar', 'y': 0},
    {'x': 'Apr', 'y': 0},
    {'x': 'May', 'y': 0},
    {'x': 'Jun', 'y': 0},
    {'x': 'Jul', 'y': 0},
    {'x': 'Aug', 'y': 0},
    {'x': 'Sep', 'y': 0},
    {'x': 'Oct', 'y': 0},
    {'x': 'Nov', 'y': 0},
    {'x': 'Dec', 'y': 0}];

  rowSelected: boolean = false;
  selectedTransaction: TransactionData = null;

  isInlineEdit: boolean = true;
  searchText: string = "";

  currentState: string = '';

  tdDisabled: boolean = false;
  states: Object[] = [
    {code: 'AL', name: 'Alabama'},
    {code: 'AK', name: 'Alaska'},
    {code: 'AZ', name: 'Arizona'},
    {code: 'AR', name: 'Arkansas'},
    {code: 'CA', name: 'California'},
    {code: 'CO', name: 'Colorado'},
    {code: 'CT', name: 'Connecticut'},
    {code: 'DE', name: 'Delaware'},
    {code: 'FL', name: 'Florida'},
    {code: 'GA', name: 'Georgia'},
    {code: 'HI', name: 'Hawaii'}];

  constructor(private transService: TransactionService, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {

  }

  filterStates(val: string): Object[] {
    return val ? this.states.filter((s: any) => s.name.match(new RegExp(val, 'gi'))) : this.states;
  }

  onUpdateRow(row) {
    //console.log("On ", row);
    this.updateMonthData(row);
  }

  updateMonthData(data: TransactionData) {
    if(!data.year) {
      data.year = "2016";
    }
    this.transService.updateMonthlyData(data._id, data)
      .subscribe(
        data => {
          //console.log("Updated ", data);
          this.getDataBySearchTag(this.searchText);
        },
        err => {console.log(err);}
      );
  }

  createMonthData(data: TransactionData) {
    this.transService.createMonthData(data)
      .subscribe(
        data => {
          //console.log("Create ", data);
          this.getDataBySearchTag(this.searchText);
        },
        err => {console.log(err);}
      );
  }

  deleteMonthData(data: TransactionData) {
    this.transService.deleteMonthlyData(this.selectedTransaction._id)
      .subscribe (
        data => {
          //console.log("Delete " + data);
          this.getDataBySearchTag(this.searchText);
        },
        err => {
          console.log(err);
        }
      );
  }

  filterResult(displayName: string = ''): void {
    this.searchText = displayName;
    if(this.searchText !== "") {
      this.getDataBySearchTag(displayName);
    }
  }

  onSearchEnter(displayName: string = ''): void {
    this.searchText = displayName;
    if(this.searchText !== "") {
      this.items.push(this.searchText);
      this.itemsRequireMatch = this.items.slice(0, 6);
      this.searchText = "";
    }
  }

  getDataBySearchTag(searchText: string) {
    this.transService.getAllDataBasedOnQuery(searchText)
      .subscribe (
        monthlyData => {
          this.data = monthlyData;
          // this.calculateTotalDollars();
          this.updateGraph();
          // this.formatDetailsForExpander();
        },
        err => {
          console.log(err);
        }
      );
  }

  updateGraph() {
    let dataValues: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
    this.data.forEach((monthData: TransactionData) => {
      let index: number = Month[monthData.month];
      let value = dataValues[index];
      let priceRounded = Math.round(monthData.price);
      value += priceRounded;
      dataValues[index] = value;
    });

    let count = 0;
    this.graphData.forEach(item => {
      //console.log("I ", item);
      item.y = dataValues[count++];
    });
    console.log(this.graphData);
    this.changeDetector.detectChanges();
    this.graphData = this.graphData.slice();
  }

  onSelectTableRow(data) {
    //console.log("Dash ", data);
    this.rowSelected = data.selected;
    if(data.selected) {
      this.selectedTransaction = data.row;
      //this.createNew = false;
    } else {
      this.selectedTransaction = null;
    }
    console.log("Selected ", this.selectedTransaction);
  }

  onCopyTransaction() {
    this.createMonthData(this.selectedTransaction);
  }

  onDeleteTransaction() {
    this.deleteMonthData(this.selectedTransaction);
  }

  onEditTransaction() {
    //this.openCreateDialog();
  }

  onUpdatedDetail(updatedTransaction) {
    //console.log("Updated ", updatedTransaction);
    this.selectedTransaction = updatedTransaction;
    this.updateMonthData(updatedTransaction);
  }

  onInlineEditClicked() {
    this.isInlineEdit = !this.isInlineEdit;
  }

  onRemoveChip(chipLabel) {
    console.log(this.items, " T ", this.itemsRequireMatch);
  }
}
