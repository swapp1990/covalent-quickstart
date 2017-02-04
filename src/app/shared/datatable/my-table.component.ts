import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'my-table',
  template: `
    <!--<my-ngx-table [rows]="rows" [cols]="cols"></my-ngx-table>-->
    <my-cov-table [rows]="rows" [cols]="cols" (selectOutput)="selectEvent($event)"></my-cov-table>
  `,
})

export class MyTable implements OnInit, OnChanges {
  @Input() rows: any;
  @Input() cols: any;

  @Output() selectOutput = new EventEmitter();
  ngOnInit(): void {

  }

  ngOnChanges(changes) {

  }

  selectEvent(data) {
    this.selectOutput.emit(data);
  }
}
