import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'select-date',
  styles:
    [`.my-md-card {
        margin: 2px;
      }
    `],
  template:
    `
    <div layout="row" flex style="height: 100%;">
      <md-card class="my-md-card" flex="60" hide-xs>
        <md-card-content layout-align="center" style="padding: 0px">
          <div layout="column">
            <md-select flex placeholder="Select Month" [(ngModel)]="selectedMonth"  (ngModelChange)="onMonthChange($event)">
              <md-option *ngFor="let mth of months" [value]="mth">
                {{mth}}
              </md-option>
            </md-select>
            <md-select flex placeholder="Select Year" [(ngModel)]="selectedYear"  (ngModelChange)="onYearChange($event)">
              <md-option *ngFor="let year of years" [value]="year">
                {{year}}
              </md-option>
            </md-select>
          </div>
        </md-card-content>
      </md-card>
      <md-card class="my-md-card" flex="40" hide-xs>
        <md-card-content flex style="height: 100%; padding: 0px">
          <div layout="row" layout-align="center center" style="height: 100%;">
            <md-radio-group layout="column" name="group1"
                            (change)="onTypeChange()" [(ngModel)]="selectedType">
              <md-radio-button *ngFor="let t of types" [value]="t">
                {{t}}
              </md-radio-button>
            </md-radio-group>
          </div>
        </md-card-content>
      </md-card>
    </div>  
    `
})

export class SelectDate {
  months: any[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  types: string[] = ["Expense", "Income"];
  years: any[] = ["2016", "2017"];

  selectedType: string;
  selectedMonth: string;
  selectedYear: string;

  @Output() onSelection = new EventEmitter();

  onMonthChange() {
    this.onSelection.emit({month: this.selectedMonth});
  }

  onYearChange() {
    this.onSelection.emit({year: this.selectedYear});
  }

  onTypeChange() {
    this.onSelection.emit({type: this.selectedType});
  }
}
