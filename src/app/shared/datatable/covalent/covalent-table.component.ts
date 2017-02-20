import {Component, Input, Output, EventEmitter} from "@angular/core";
import {ITdDataTableColumn, TdDataTableService, IPageChangeEvent, TdDialogService} from "@covalent/core";

@Component({
  selector: 'my-cov-table',
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
</td-data-table>
<table td-data-table *ngIf="isInlineEdit">
  <th td-data-table-column
      *ngFor="let column of cols"
      [numeric]="column.numeric">
    {{column.label}}
  </th>
   <tr td-data-table-row *ngFor="let row of filteredData">
    <td td-data-table-cell *ngFor="let column of cols" (click)="inlineEdit(row, column.name)" [numeric]="column.numeric">
      {{row[column.name]}}
    </td>
   </tr>
</table>
<td-paging-bar *ngIf="showPageBar" [pageSizes]="[5, 10, 15, 20]" [total]="filteredTotal" (change)="page($event)"></td-paging-bar>
    `,
})

export class MyCovTable {
  @Input() rows: any;
  @Input() cols: any;
  @Input() isInlineEdit: boolean = false;
  @Input() isMultipleSelection: boolean = false;
  @Input() showPageBar: boolean = true;
  @Input() selectedRows: any[] = [];
  
  filteredData: any[] = [];
  filteredTotal: number = 0;
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;

  @Output() selectOutput = new EventEmitter();
  @Output() updatedRow = new EventEmitter();

  constructor(private _dataTableService: TdDataTableService,
              private _dialogService: TdDialogService) {}

  ngAfterViewInit(): void {
    this.filter();
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

  inlineEdit(row: any, name: string): void {
    this._dialogService.openPrompt({
      message: 'Edit',
      value: row[name],
    }).afterClosed().subscribe((value: any) => {
      if (value !== undefined) {
        row[name] = value;
        //console.log("Row ", row);
        this.updatedRow.emit(row);
      }
    });
  }

  selectEvent(data) {
    this.selectOutput.emit(data);
  }
}
