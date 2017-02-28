import {Component, Input, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";
import {Observable, Subject} from "rxjs/Rx";

@Component({
  selector: 'table-dialog',
  template:
    `
      <my-dialog [(visible)]="showDialog" (visibleChange)="close($event)">
        <span class="md-subhead">{{title}}</span>
        <div *ngIf="type == 'month'">
          <md-select flex placeholder="Select Month" [(ngModel)]="modelData" style="margin-top: 22px;">
            <md-option *ngFor="let mth of months" [value]="mth">
              {{mth}}
            </md-option>
          </md-select>
        </div>
        <div *ngIf="type == 'checkbox'">
          <md-slide-toggle [color]="primary" [(ngModel)]="modelData.on">
            {{modelData.name}}
          </md-slide-toggle>
        </div>
      </my-dialog>
    `,
  styles: [``]
})

export class TableDialog {
  @Input() type: any = 'default';
  showDialog: boolean = false;
  modelData: any;
  title: string = "";

  months: any[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  private _afterClosed;

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
    this._afterClosed = new Subject();
  }

  ngOnContentInit() {

  }

  ngAfterViewInit() {

  }

  close(data: any) {
    this.showDialog = false;
    if(data.action === "Cancel") {

    } else {
      if(this.type === 'checkbox') {
        this.modelData = String(this.modelData.on);
      }
      this._afterClosed.next(this.modelData);
    }
    this._afterClosed.complete();
  }

  showDialogCall(data: any, column: any): Observable<any> {
    this.showDialog = true;
    this._afterClosed = new Subject();
    this.type = column.type;
    this.title = column.label;
    if(this.type === 'checkbox') {
      let toggleData: any = {name: data, on: false};
      if(data === 'true') {
        toggleData.on = true;
      }
      this.modelData = toggleData;
    } else {
      this.modelData = data;
    }

    return this._afterClosed.asObservable();
  }
}
