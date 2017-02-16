import {Component, Input, Output, EventEmitter} from "@angular/core";
import {ITdDataTableColumn, TdDataTableService, IPageChangeEvent} from "@covalent/core";

@Component({
  selector: 'my-cov-sidenav',
  template:
    `
      <md-list class="will-load alert-list">
        <template tdLoading="alerts.load">
          <template let-item let-last="last" ngFor [ngForOf]="rows">
            <md-list-item layout-align="row" (click)="onClick(item)">
              <md-icon *ngIf="isSelected(item)" md-list-avatar class="bgc-amber-800">{{item.icon}}</md-icon>
              <md-icon *ngIf="!isSelected(item)" md-list-avatar>{{item.icon}}</md-icon>
              <h3 md-line> {{item.name}} </h3>
              <p md-line> {{item.monthlyAmount.total}} ({{item.monthlyAmount.once}}) </p>
              
              <my-progress-bar></my-progress-bar>
            </md-list-item>
            <md-divider *ngIf="!last" md-inset></md-divider>
          </template>
        </template>
      </md-list>
    `,
})

export class MyCovSideNav {
  @Input() rows: any;

  @Output() selected = new EventEmitter();

  selectedTab: any;

  constructor() {}

  ngAfterViewInit(): void {
    //console.log(this.rows);
  }

  ngOnChanges(): void {

  }

  isSelected(item) {
    if(item === this.selectedTab) return true;
    return false;
  }

  onClick(event) {
    console.log("Se ", event);
    this.selected.emit(event);
    this.selectedTab = event;
  }
}
