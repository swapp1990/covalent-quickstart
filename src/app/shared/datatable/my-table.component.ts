import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'my-table',
  template: `
    <!--<my-ngx-table [rows]="rows" [cols]="cols"></my-ngx-table>-->
    <my-cov-table [rows]="rows" [cols]="cols" [isInlineEdit]="isInlineEdit" [showPageBar]="showPageBar"
                  (selectOutput)="selectEvent($event)"
                  (updatedRow)="updateRow($event)"></my-cov-table>
  `,
})

export class MyTable implements OnInit, OnChanges {
  @Input() rows: any;
  @Input() cols: any;
  @Input() isInlineEdit: boolean = false;
  @Input() showPageBar: boolean = true;
  
  @Output() selectOutput = new EventEmitter();
  @Output() updatedRow = new EventEmitter();

  ngOnInit(): void {

  }

  ngOnChanges(changes) {

  }

  selectEvent(data) {
    this.selectOutput.emit(data);
  }

  updateRow(rowData) {
    this.updatedRow.emit(rowData);
  }
}
