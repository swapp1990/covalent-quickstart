

import {Component, Input} from "@angular/core";

@Component({
  selector: 'object-view',
  template: `
    <ul>
      <li *ngFor="let property of columns">
        <md-input-container flex="20">
          <input #ename md-input [(ngModel)]="property.name">
        </md-input-container>
        <span>: </span>
        <span *ngIf="!isObject(property.name)">
          <md-input-container flex="20">
            <input #evalue md-input [(ngModel)]="object[property.name]">
          </md-input-container>
        </span>
        <span *ngIf="isObject(property.name)">
          <object-view [object]="getValue(property.name)"></object-view>
        </span>
      </li>
    </ul>
  `
})
export class ObjectViewComponent {
  @Input() object: any;
  columns: any[] = [];

  ngOnInit() {

  }

  ngOnChanges() {
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
}
