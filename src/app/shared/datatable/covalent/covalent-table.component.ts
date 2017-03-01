import {Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild} from "@angular/core";
import {ITdDataTableColumn, TdDataTableService, IPageChangeEvent, TdDialogService} from "@covalent/core";
import {TableDialog} from "./table-dialogs.component";

@Component({
  selector: 'my-cov-table',
  styleUrls: ['./covalent-table.component.css'],
  template:
    `
      <td-data-table
        *ngIf="!isInlineEdit"
        [data]="filteredData"
        [columns]="cols"
        [selectable]="true"
        [multiple]="isMultipleSelection"
        [sortable]="true"
        [sortBy]="sortBy"
        [sortOrder]="sortOrder"
        (sortChange)="sort($event)"
        [(ngModel)]="selectedRows"
        (rowSelect)="selectEvent($event)">
        
        <div *ngFor="let col of jsonCols"> 
          <template let-column="column" tdDataTableTemplate="{{col}}" let-value="value" let-row="row">
            <div layout="row">
              <my-json-viewer [jsonObject]="value"></my-json-viewer>
            </div>
          </template>
        </div>
      </td-data-table>
            
      <div class="mat-table-container">  
        <table td-data-table *ngIf="isInlineEdit" style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
          <th td-data-table-column
              *ngFor="let column of cols"
              [numeric]="column.numeric">
            {{column.label}}
          </th>
           <tr td-data-table-row *ngFor="let row of filteredData">
            <td td-data-table-cell *ngFor="let column of cols" (click)="inlineEdit(row, column)" [numeric]="column.numeric">
              {{row[column.name]}}
            </td>
           </tr>
        </table>
      </div>
      <table-dialog #td></table-dialog>

      <my-paging-bar *ngIf="showPageBar" [pageSizes]="[5, 10, 15, 20]" [total]="filteredTotal" (change)="page($event)"></my-paging-bar>
    `,
})

export class MyCovTable {
  @Input() rows: any;
  @Input() cols: any;
  @Input() isInlineEdit: boolean = false;
  @Input() isMultipleSelection: boolean = false;
  @Input() showPageBar: boolean = true;
  @Input() selectedRows: any[] = [];

  @ViewChild('td') tableDialog: TableDialog;

  showDialog: boolean = false;

  jsonCols = [];

  filteredData: any[] = [];
  filteredTotal: number = 0;
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;

  @Output() selectOutput = new EventEmitter();
  @Output() updatedRow = new EventEmitter();
  @Output() isObjectEdit = new EventEmitter();

  constructor(private _dataTableService: TdDataTableService,
              private _dialogService: TdDialogService,
              private detectorChanges: ChangeDetectorRef) {}

  ngOnInit() {
    let jsonColsT = [];
    this.cols.forEach(col => {
      if(col.isJsonColumn) {
        jsonColsT.push(col.name);
      }
    });
    this.jsonCols = jsonColsT;
    //console.log("Col json", this.jsonCols);
    this.detectorChanges.detectChanges();
  }

  ngAfterViewInit(): void {
    this.filter();
    //console.log("Col ", this.cols);

  }

  ngOnChanges(): void {
    this.filter();
  }

  reset() {
    this.currentPage = 1;
    this.fromRow = 1;
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    //console.log("Filter");
    let newData: any[] = this.rows;
    this.filteredTotal = newData.length;
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  inlineEdit(row: any, column: any): void {
    if(row[column.name] instanceof Object) {
      this.isObjectEdit.emit(row[column.name]);
    } else if(column.type && (column.type == 'month' || column.type == 'checkbox')) {
      this.tableDialog.showDialogCall(row[column.name], column)
        .subscribe((value: any) => {
          if (value !== undefined) {
            row[column.name] = value;
            this.updatedRow.emit(row);
          }
        });
    } else {
      this._dialogService.openPrompt({
        message: 'Edit',
        value: row[column.name],
      }).afterClosed().subscribe((value: any) => {
        if (value !== undefined) {
          row[column.name] = value;
          //console.log("Row ", row);
          this.updatedRow.emit(row);
        }
      });
    }
  }

  selectEvent(data) {
    this.selectOutput.emit(data);
  }
}
