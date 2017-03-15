import {Component, Input,Output,EventEmitter, ChangeDetectorRef} from "@angular/core";

@Component({
  selector: 'value-view',
  template: `
    <md-input-container flex="20">
      <input #evalue md-input [(ngModel)]="objectValue" (blur)="onBlur()">
    </md-input-container>
    <button *ngIf="!creation" (click)="showCreateColumn($event)" md-icon-button><md-icon class="md-24">add circle</md-icon></button>
    <button *ngIf="!creation" (click)="deleteColumn($event)" md-icon-button><md-icon class="md-24">remove</md-icon></button>
    <div *ngIf="creation" style="padding-left: 40px">
      <md-input-container flex="20">
         <input #cname md-input style="background-color: #00e5ff">
      </md-input-container>
      <md-input-container flex="20">
         <input #cvalue md-input style="background-color: #00e5ff">
      </md-input-container>
      <button (click)="addData(cname.value, cvalue.value)" md-icon-button><md-icon class="md-24">check</md-icon></button>
      <button (click)="cancel()" md-icon-button><md-icon class="md-24">clear</md-icon></button>
    </div>
  `
})
export class ValueViewComponent {
  @Input() objectValue: string;
  @Input() objectName: string;
  columns: any[] = [];
  creation: boolean = false;

  @Output() updatedValue = new EventEmitter();

  constructor(private detectorChanges: ChangeDetectorRef) {}

  ngOnInit() {

  }

  ngOnChanges() {
    //this.refreshDetails();
  }

  refreshDetails() {

  }

  private getValue(property: string): any {
    //return this.object[property];
  }

  private isObject(property: string): boolean {
    const value = this.getValue(property);
    return !Array.isArray(value) && typeof value === 'object';
  }

  showCreateColumn() {
    //console.log(this.object);
    this.creation = true;
  }

  addData(colName, colValue) {
    let newObject = {};
    newObject[colName] = colValue;
    let returnObject = {newObject: newObject, columnName: this.objectName, type: 'Create'};
    this.updatedValue.emit(returnObject);
    this.creation = false;
  }

  cancel() {
    this.creation = false;
  }

  deleteColumn() {

  }

  onBlur() {
    let newObject = {};
    newObject[this.objectName] = this.objectValue;
    let returnObject = {columnValue: this.objectValue, columnName: this.objectName, type: 'Update'};
    this.updatedValue.emit(returnObject);
    this.creation = false;
  }

  onUpdate(details) {
    //this.object = details;
    //this.refreshDetails();
  }
}
