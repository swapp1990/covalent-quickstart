import {Component, Input,Output,EventEmitter, ChangeDetectorRef} from "@angular/core";

@Component({
  selector: 'object-view',
  template: `
    <button *ngIf="!creation" (click)="showCreateColumn($event)" md-icon-button><md-icon class="md-24">add circle</md-icon></button>
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

    <ul style="margin-top: 0px">
      <li *ngFor="let property of columns">
        <md-input-container flex="20">
          <input #ename md-input [(ngModel)]="property.name">
        </md-input-container>
        <span>: </span>
        <span *ngIf="!isObject(property.name)">
          <value-view [objectValue]="object[property.name]" [objectName]="property.name" (updatedValue)="onValueToObject($event)"></value-view>
        </span>
        <span *ngIf="isObject(property.name)">
          <object-view [object]="getValue(property.name)" (updatedDetails)="onUpdate($event)"></object-view>
        </span>
      </li>
    </ul>
  `
})
export class ObjectViewComponent {
  @Input() object: any;
  columns: any[] = [];
  creation: boolean = false;
  newColumn: any;

  @Output() updatedDetails = new EventEmitter();

  constructor(private detectorChanges: ChangeDetectorRef) {}

  ngOnInit() {

  }

  ngOnChanges() {
    this.refreshDetails();
  }

  refreshDetails() {
    this.columns = [];
    let colAsStringArray = Object.keys(this.object);
    colAsStringArray.forEach(col => {
      let newCol = {name: col};
      this.columns.push(newCol);
    });
  }

  private getValue(property: string): any {
    return this.object[property];
  }

  private isObject(property: string): boolean {
    const value = this.getValue(property);
    return !Array.isArray(value) && typeof value === 'object';
  }

  showCreateColumn() {
    //console.log(this.object);
    this.creation = true;
  }

  cancel() {
    this.creation = false;
  }

  addData(colName, colValue) {
    console.log("B: ", this.object);
    this.object[colName] = colValue;
    console.log("A: ", this.object);
    this.creation = false;
    this.detectorChanges.detectChanges();
    this.updatedDetails.emit(this.object);
  }

  onValueToObject(returnObject: any) {
    console.log("New ", returnObject.newObject);
    this.object[returnObject.columnName] = returnObject.newObject;
    this.refreshDetails();
  }

  onUpdate(details) {
    //this.object = details;
    this.refreshDetails();
  }
}
