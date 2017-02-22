import {Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";
import {DetailViewTable} from "./detail-view-table.component";
import {TransactionData} from "../../../models/transaction";
import {EducationLoan} from "./special/education-loan.dyn.component";
import {CarLoan} from "./special/car-loan.dyn.component";
import {MobileBill} from "./special/mobile-bill.dyn.component";

@Component({
  selector: 'detail-view',
  template: `
    <!--<my-expansion-panel [label]="'Details'" [sublabel]="'No Details'" -->
                        <!--[componentData]="componentData"></my-expansion-panel>-->
    <detail-view-table [colsI]="detailCols" [rowsI]="detailRows" 
                       (updatedRow)="onUpdatedRow($event)" (addRow)="onAddRow($event)"></detail-view-table>   
    <dynamic-component [componentData]="renderedComponent"></dynamic-component>
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

  constructor(private detectorChanges: ChangeDetectorRef) {}

  ngOnInit(): void {
    //----- Sample ------//
    this.inputData = new TransactionData("Utilities", "2017", "January", "Expense", "true");
    this.inputData.name = "Mobile Bill";
    this.inputData.details = [
      {
        "Total Bill": 320,
        "Billing Cycle": "January",
        "Paid": {
          "Credit Card": "Discover",
          "Amount": 315
        },
        "Family Plan": {
          "Prashant": {
            "Amount": 24,
            "Transfer Date": "March "
          },
          "Binoy": {
            "Amount": 24,
            "Transfer Date": "March "
          },
          "Abhiram": {
            "Amount": 62,
            "Transfer Date": "March "
          },
          "Hitesh": {
            "Amount": 48,
            "Credit": 4,
            "Transfer Date": "March "
          },
          "Shreyas": {
            "Amount": 32,
            "Transfer Date": "March "
          },
          "Swapnil": {
            "Amount": 87,
            "Division": {
              "HTC Phone": 25,
              "Extra": {
                "Data Pass": {
                  "Type": "7 Day International",
                  "Timeline": "January 1st week",
                  "Amount": 25
                },
                "Talk": {
                  "Type": "Roaming International",
                  "Amount": 13
                }
              }
            }
          },
        },
      }
    ];
    //----- Sample ------//
    this.refreshDetails();
    this.updateSpecialComponent();
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
      else if(this.inputData.name === 'Mobile Bill') {
        this.renderedComponent = {
          component: MobileBill,
          inputs: {
            selectedTransaction: this.inputData
          }
        };
    }
  }

  /**
   * TODO: get a recursive function for data
   * @param jsonData
   */
  getColumnData(jsonData) {
    let columns: string[] = Object.keys(jsonData);
    columns.forEach(colO => {
      let colInfo = {name: colO, label: colO};
    });
  }

  /**
   * In String Format
   * @param jsonData
   * @returns {string}
   */
  getNestedRowData(jsonData) {
    let nestedCols: string[]  = Object.keys(jsonData);
    let stringForm: string = '';
    nestedCols.forEach(colN => {
      let nestedData: string = "";
      if(jsonData[colN] instanceof Object) {
        nestedData += this.getNestedRowData(jsonData[colN]);
      } else {
        nestedData = jsonData[colN];
      }
      stringForm += colN + " - " + nestedData + ",\n ";
    });
    return stringForm;
  }

  refreshDetails() {
    this.detailCols = [];
    this.detailRows = [];
    if(this.inputData.details) {
      //console.log(this.inputData.details);
      this.inputData.details.forEach(detail => {
        let columns: string[] = Object.keys(detail);
        let rowInfo = [];
        columns.forEach(colO => {
          let colInfo = {name: colO, label: colO};

          rowInfo[colO] = detail[colO];
          if(rowInfo[colO] instanceof Object) {
            //rowInfo[colO] = this.getNestedRowData(rowInfo[colO]);
            colInfo['isJsonColumn'] = 'true';
            this.detailCols.push(colInfo);
          } else {
            this.detailCols.push(colInfo);
          }
        });

        this.detailRows.push(rowInfo);
      });
      //this.detailRows = this.inputData.details;
      this.detectorChanges.detectChanges();
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
