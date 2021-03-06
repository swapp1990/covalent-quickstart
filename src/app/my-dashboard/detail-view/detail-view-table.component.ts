import {Component, OnInit, OnChanges, Input, Output, EventEmitter, Injector, ChangeDetectorRef} from "@angular/core";

@Component({
  selector: 'detail-view-table',
  template: `
    <button (click)="onEdit()" md-icon-button>
                    <md-icon>edit</md-icon>
    </button>
    <button *ngIf="!isNewColumn" (click)="onNewColumn()" md-icon-button>
                    <md-icon>add</md-icon>
    </button>
    <div *ngIf="isNewColumn" layout="row" layout-margin>
      <md-input-container flex>
          <input #newcolname md-input placeholder="Column Name">
      </md-input-container>
      <md-input-container flex>
          <input #newcolvalue md-input placeholder="Column Value">
      </md-input-container>
      <button (click)="onAddCol(newcolname.value, newcolvalue.value)" md-icon-button>  <md-icon>check</md-icon> </button>
    </div>
    <my-table [rows]="rowsI" [cols]="colsI" [isInlineEdit]="isInlineEdit" [showPageBar]="false"
                        (selectOutput)="onSelectTableRow($event)"
                        (updatedRow)="onUpdateRow($event)"
                        (isObjectEdit)="showJsonEditor($event)"></my-table>
    <my-json-editor *ngIf="isJsonEditor" [jsonObject]="jsonObject"></my-json-editor>
  `,
})

export class DetailViewTable implements OnInit, OnChanges {
  // rows = [
  //   { price: '453', date: '24', name: 'Swimlane', category: "Grocery" },
  //   { price: '76', date: '26', name: 'KFC' },
  //   { price: '25', date: '13', name: 'Burger King' },
  // ];

  cols = [];
  rows = [];

  @Input() colsI = [];
  @Input() rowsI = [];

  @Input() isInlineEdit: boolean = false;

  @Output() selectOutput = new EventEmitter();
  @Output() updatedRow = new EventEmitter();
  @Output() addRow = new EventEmitter();

  isNewColumn: boolean = false;

  isJsonEditor: boolean = false;
  jsonObject: any[] = [];

  constructor(private injector: Injector, private detectorChanges: ChangeDetectorRef) {
    //this.cols = this.injector.get('cols');
    //this.rows = this.injector.get('rows');
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes) {
    //console.log("Changes in input");
  }

  onSelectTableRow(data) {
    //this.selectOutput.emit(data);
  }

  onUpdateRow(rowData) {
    this.updatedRow.emit(rowData);
    console.log(rowData);
  }

  onNewColumn() {
    this.isNewColumn = true;
  }

  onEdit() {
    this.isInlineEdit = !this.isInlineEdit;
    if(!this.isInlineEdit) {
      this.isJsonEditor = false;
      this.jsonObject = [];
    }
  }

  onAddCol(newColName: string, newcolvalue: string) {
    this.isNewColumn = false;
    //console.log(newColName);
    let rowInfo = [];
    rowInfo[newColName] = newcolvalue;
    this.addRow.emit(rowInfo);
  }

  showJsonEditor(data: any) {
    this.isJsonEditor = true;
    this.jsonObject = [];
    this.jsonObject = data;
    this.detectorChanges.detectChanges();
  }
}
