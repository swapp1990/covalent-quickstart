import {Component, Input} from "@angular/core";
import {ITdDataTableColumn, TdDataTableService, IPageChangeEvent} from "@covalent/core";

@Component({
  selector: 'my-cov-table',
  template:
    `
<td-data-table
  [data]="filteredData"
  [columns]="cols"
  [sortable]="true"
  [sortBy]="sortBy"
  [sortOrder]="sortOrder"
  (sortChange)="sort($event)">
</td-data-table>
<td-paging-bar [pageSizes]="[5, 10, 15, 20]" [total]="filteredTotal" (change)="page($event)"></td-paging-bar>
    `,
})

export class MyCovTable {
  @Input() rows: any;
  @Input() cols: any;

  filteredData: any[] = [];
  filteredTotal: number = 0;
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(private _dataTableService: TdDataTableService) {}

  ngAfterViewInit(): void {
    this.filter();
  }

  ngOnChanges(): void {
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    let newData: any[] = this.rows;
    this.filteredTotal = newData.length;
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }
  // data: any[] = [
  //   { sku: '1452-2', item: 'Pork Chops', price: 32.11 },
  //   { sku: '1421-0', item: 'Prime Rib', price: 41.15 },
  // ];
  // columns: ITdDataTableColumn[] = [
  //   { name: 'sku', label: 'SKU #', tooltip: 'Stock Keeping Unit' },
  //   { name: 'item', label: 'Item name' },
  //   { name: 'price', label: 'Price (US$)', numeric: true, format: v => v.toFixed(2) },
  // ];

}
