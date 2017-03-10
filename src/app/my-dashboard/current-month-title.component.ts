import {Component, Input, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";
import {Month} from "../../data/enums/months";

@Component({
    selector: 'current-month-bar',
    template: `
     <div layout="row" flex hide-gt-lg hide-gt-md>
      <md-card class="my-md-card" flex="10">
        <md-card-content layout="row" layout-align="center center">
          <a md-icon-button (click)="onMonthDecrement()"><md-icon>fast_rewind</md-icon> </a>
        </md-card-content>
      </md-card>
      <md-card class="my-md-card" flex="80">
        <md-card-title layout="row" layout-align="center center">
          Title
        </md-card-title>
        <md-card-subtitle layout="row" layout-align="center center">
          {{selectedMonth}}, {{selectedYear}}
        </md-card-subtitle>
      </md-card>
      <md-card class="my-md-card" flex="10">
        <md-card-content layout="row" layout-align="center center">
          <a md-icon-button (click)="onMonthIncrement()"><md-icon>fast_forward</md-icon> </a>
        </md-card-content>
      </md-card>
    </div>
    `,
    styles: [``]
})

export class CurrentMonthTitle
{
  selectedMonth: string = "February";
  selectedYear: string = "2017";

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit()
  {

  }

  ngOnContentInit()
  {

  }

  ngAfterViewInit()
  {

  }

  onMonthIncrement() {
    let monthNumber = Month[this.selectedMonth];
    monthNumber = monthNumber + 1;
    if(monthNumber == 12) {
      this.selectedYear = "2017";
      monthNumber = 0;
    }
    this.selectedMonth = Month[monthNumber];
    //this.updateRendering();
  }

  onMonthDecrement() {
    let monthNumber = Month[this.selectedMonth];
    monthNumber = monthNumber - 1;
    if(monthNumber == -1) {
      this.selectedYear = "2016";
      monthNumber = 11;
    }
    this.selectedMonth = Month[monthNumber];
    //this.updateRendering();
  }
}
