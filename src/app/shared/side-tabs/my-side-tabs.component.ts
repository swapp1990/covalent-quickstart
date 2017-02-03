import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'my-side-tabs',
  template: `
    <my-cov-sidenav [rows]="rows" (selected)="onSelected($event)"></my-cov-sidenav>
  `,
})

export class MySideTabs implements OnInit, OnChanges {
  @Input() rows: any;
  @Output() selected = new EventEmitter();

  ngOnInit(): void {

  }

  ngOnChanges(changes) {

  }

  onSelected(event) {
    this.selected.emit(event);
  }
}
