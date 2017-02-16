import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from "@angular/core";
import {DetailViewTable} from "./detail-view-table.component";
import {TransactionData} from "../../../models/transaction";
import {EducationLoan} from "./special/education-loan.dyn.component";
import {CarLoan} from "./special/car-loan.dyn.component";

@Component({
  selector: 'detail-view',
  template: `
    <!--<my-expansion-panel [label]="'Details'" [sublabel]="'No Details'" -->
                        <!--[componentData]="componentData"></my-expansion-panel>-->
    <detail-view-table [colsI]="detailCols" [rowsI]="detailRows" 
                       (updatedRow)="onUpdatedRow($event)" (addRow)="onAddRow($event)"></detail-view-table>                    

    <dynamic-component [componentData]="renderedComponent"></dynamic-component>
    <!--<div flex-gt-xs="50">-->
      <!--<md-card>-->
        <!--&lt;!&ndash;<md-card-title>Gauge</md-card-title>&ndash;&gt;-->
        <!--<md-card-actions layout="row" layout-align="end center">-->
          <!--<md-select flex="20" placeholder="Select Chart" [(ngModel)]="selectedMode">-->
            <!--<md-option *ngFor="let mode of charts" [value]="mode">-->
              <!--{{mode}}-->
            <!--</md-option>-->
          <!--</md-select>-->
        <!--</md-card-actions>-->
        <!--<md-divider></md-divider>-->
        <!--<my-chart [mode]="selectedMode"></my-chart>-->
      <!--</md-card>-->
    <!--</div>-->
  `,
})

export class DetailView implements OnInit, OnChanges {
  @Input() inputData: TransactionData;
  charts = ['Gauge', 'Pie', 'Bar-V', 'Bar-H'];
  detailCols: any = [];
  detailRows: any = [];
  //----- Sample ------//
  // detailRows = [
  //   {
  //     "name": "Germany",
  //     "value": 8940000
  //   },
  //   {
  //     "name": "USA",
  //     "value": 5000000
  //   },
  //   {
  //     "name": "France",
  //     "value": 7200000
  //   }
  // ];
  //
  // detailCols = [
  //   { name: 'name', label: 'Name' },
  //   { name: 'value', label: 'Value' }
  // ];
  //----- Sample ------//
  selectedMode: string = "Gauge";

  selectedDataLabel: string = "";

  renderedComponent: any = null;

  @Output() updatedDetails = new EventEmitter();
  // @Input() cols: any;
  // @Input() isInlineEdit: boolean = false;
  //
  // @Output() selectOutput = new EventEmitter();
  // @Output() updatedRow = new EventEmitter();
  componentData = null;

  ngOnInit(): void {

  }

  onChartChange(mode) {
    //this.selectedMode = mode;
  }

  ngOnChanges(changes) {
    //console.log("I ", this.inputData);
    this.refreshDetails();
    this.updateSpecialComponent();
    //console.log("Col ", this.detailCols);
    //console.log("Row ", this.detailRows);
    //this.detailCols = [{name: 'new', label: 'New'}];
  }

  updateSpecialComponent() {
    if(this.inputData.name === 'India Education Loan') {
      this.renderedComponent = {
        component: EducationLoan,
        inputs: {
          selectedTransaction: this.inputData
        }
      };
    } else if(this.inputData.name === 'Car Loan') {
      this.renderedComponent = {
        component: CarLoan,
        inputs: {
          selectedTransaction: this.inputData
        }
      };
    }
  }

  refreshDetails() {
    this.detailCols = [];
    this.detailRows = [];
    if(this.inputData.details) {
      this.inputData.details.forEach(detail => {
        let columns: string[] = Object.keys(detail);
        let rowInfo = [];
        columns.forEach(col => {
          let colInfo = {name: col, label: col};
          this.detailCols.push(colInfo);
          rowInfo[col] = detail[col];
        });
        this.detailRows.push(rowInfo);
      });
    }
  }

  selectEvent(data) {
    //this.selectOutput.emit(data);
  }

  isLabelEmpty() {

  }

  onUpdatedRow(rowData) {
    if(this.inputData.details) {
      this.inputData.details.forEach(detail => {
        let columns: string[] = Object.keys(detail);
        let updatedColumnName: string[] = Object.keys(rowData);

        updatedColumnName.forEach(colU => {
          let columnFound = columns.find(col => col === colU);
          if(columnFound) {
            detail[columnFound] = rowData[columnFound];
          }
          //console.log("Value Updated ", detail[columnFound]);
        });
      });
    }
    //console.log("Updated Detail", this.inputData);
    this.updatedDetails.emit(this.inputData);
  }

  onAddRow(rowData) {
    let columns: string[] = Object.keys(rowData);
    if(this.inputData.details) {
      if(this.inputData.details.length == 0) {
        var newDetail = {};
        newDetail[columns[0]]= rowData[columns[0]];
        this.inputData.details.push(newDetail);
      } else {
        this.inputData.details.forEach(detail => {
          detail[columns[0]] = rowData[columns[0]];
        });
      }

    } else {
      this.inputData.details = [];
      var newDetail = {};
      newDetail[columns[0]]= rowData[columns[0]];
      this.inputData.details.push(newDetail);
    }
    //console.log("Updated Detail", this.inputData);
    this.updatedDetails.emit(this.inputData);
    this.refreshDetails();
  }
}
