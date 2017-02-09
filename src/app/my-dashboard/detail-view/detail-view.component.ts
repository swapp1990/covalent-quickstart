import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from "@angular/core";
import {DetailViewTable} from "./detail-view-table.component";
import {TransactionData} from "../../../models/transaction";

@Component({
  selector: 'detail-view',
  template: `
    <!--<my-expansion-panel [label]="'Details'" [sublabel]="'No Details'" -->
                        <!--[componentData]="componentData"></my-expansion-panel>-->
    <detail-view-table [colsI]="detailCols" [rowsI]="detailRows" 
                       (updatedRow)="onUpdatedRow($event)" (addRow)="onAddRow($event)"></detail-view-table>                    
  `,
})

export class DetailView implements OnInit, OnChanges {
  @Input() inputData: TransactionData;
  detailCols: any = [];
  detailRows: any = [];

  @Output() updatedDetails = new EventEmitter();
  // @Input() cols: any;
  // @Input() isInlineEdit: boolean = false;
  //
  // @Output() selectOutput = new EventEmitter();
  // @Output() updatedRow = new EventEmitter();
  componentData = null;

  ngOnInit(): void {
    this.componentData = {
      component: DetailViewTable,
      inputs: {
        cols : this.detailCols,
        rows: this.detailRows
      }
    };
  }

  ngOnChanges(changes) {
    //console.log("I ", this.inputData);
    this.refreshDetails();

    //console.log("Col ", this.detailCols);
    //console.log("Row ", this.detailRows);
    //this.detailCols = [{name: 'new', label: 'New'}];
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
