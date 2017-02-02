import {Component, OnInit, OnChanges, Input} from "@angular/core";

@Component({
  selector: 'my-table',
  template: `
    <my-ngx-table [rows]="rows" [cols]="cols"></my-ngx-table>
  `,
})

export class MyTable implements OnInit, OnChanges {
  @Input() rows: any;
  @Input() cols: any;

  ngOnInit(): void {

  }

  ngOnChanges(changes) {

  }
}
