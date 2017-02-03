import {Component, Input, Output, EventEmitter} from "@angular/core";
import {ITdDataTableColumn, TdDataTableService, IPageChangeEvent} from "@covalent/core";

@Component({
  selector: 'my-cov-sidenav',
  template:
    `
      <a *ngFor="let row of rows" md-list-item 
        md-ripple class="block relative"
        (click)="onClick(row)">
        <md-icon md-list-icon>{{row.icon}}</md-icon>
        {{row.name}}
      </a>
    `,
})

export class MyCovSideNav {
  @Input() rows: any;

  @Output() selected = new EventEmitter();

  constructor() {}

  ngAfterViewInit(): void {
    console.log(this.rows);
  }

  ngOnChanges(): void {

  }

  onClick(event) {
    //console.log(event);
    this.selected.emit(event);
  }
}
