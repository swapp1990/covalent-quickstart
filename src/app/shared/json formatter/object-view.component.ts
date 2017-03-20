import {Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild} from "@angular/core";
import {TableDialog} from "../datatable/covalent/table-dialogs.component";

@Component({
  selector: 'object-view',
  template: `
    <!--<button *ngIf="!creation" (click)="showCreateColumn($event)" md-icon-button><md-icon class="md-24">add circle</md-icon></button>-->
    <!--<div *ngIf="creation" style="padding-left: 40px">-->
      <!--<md-input-container flex="20">-->
         <!--<input #cname md-input style="background-color: #00e5ff">-->
      <!--</md-input-container>-->
      <!--<md-input-container flex="20">-->
         <!--<input #cvalue md-input style="background-color: #00e5ff">-->
      <!--</md-input-container>-->
      <!--<button (click)="addData(cname.value, cvalue.value)" md-icon-button><md-icon class="md-24">check</md-icon></button>-->
      <!--<button (click)="cancel()" md-icon-button><md-icon class="md-24">clear</md-icon></button>-->
    <!--</div>-->
    <table-dialog #td></table-dialog>
    <ul style="margin-top: 0px; padding-left: 10px;">
      <li *ngFor="let property of columns">
        <!--<md-input-container flex="30">-->
          <!--<input #ename md-input [(ngModel)]="property.name">-->
        <!--</md-input-container>-->
        <button (click)="onEdit(property)" md-icon-button>
          <md-icon class="md-12">edit</md-icon>
         </button>
        <button (click)="onCreate(property)" md-icon-button>
          <md-icon class="md-12">add circle</md-icon>
        </button>
        <button (click)="onRemove(property)" md-icon-button>
          <md-icon class="md-12">remove</md-icon>
        </button>
        {{property.name}}
        <span>: </span>
        <span *ngIf="!isObject(property.name)">
          <!--<value-view [objectValue]="object[property.name]" [objectName]="property.name" (updatedValue)="onValueToObject($event)"></value-view>-->
          {{object[property.name]}}
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

  @ViewChild('td') tableDialog: TableDialog;

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
    console.log("New ", returnObject.newObject, " Obj ", this.object);
    if(returnObject.type == "Create") {
      this.object[returnObject.columnName] = returnObject.newObject;
    } else {
      this.object[returnObject.columnName] = returnObject.columnValue;
    }

    this.refreshDetails();
  }

  onUpdate(details) {
    //this.object = details;
    this.refreshDetails();
  }

  onRemove(property) {
    console.log("Remove ", property);
    delete this.object[property.name];
    console.log("Obj ", this.object);
    this.refreshDetails();
    this.updatedDetails.emit(this.object);
  }

  onEdit(property) {
    let editData = {name: property.name, value: this.object[property.name]};

    this.tableDialog.showDialogCall(editData, {title: 'Edit',type:'jsonEdit'})
      .subscribe((returnValue: any) => {
        console.log("Show ", returnValue);
        delete this.object[property.name];
        this.object[returnValue.name] = returnValue.value;
        this.refreshDetails();
        this.updatedDetails.emit(this.object);
        //this.selectedType = value.selectedType;
        //this.actions.type(this.selectedType);
      });
  }

  onCreate(property) {
    let createData = {name: property.name, value: this.object[property.name]};

    this.tableDialog.showDialogCall(createData, {title: 'Create',type:'jsonEdit'})
      .subscribe((returnValue: any) => {
        console.log("Show ", returnValue);

        let newObject = {};
        if(this.isObject(property.name)) {
          newObject = this.object[property.name];
        }

        newObject[returnValue.name] = returnValue.value;

        delete this.object[property.name];
        this.object[property.name] = newObject;

        this.refreshDetails();
        this.updatedDetails.emit(this.object);
      });
  }
}
