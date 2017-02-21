import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MdSnackBar, MdSnackBarRef} from "@angular/material";

@Component({
  selector: 'my-json-editor',
  template: `
      <md-card>
        <md-card-content>
          <div *ngFor="let obj of jsonData">
            <div layout="row" layout-margin>
              <md-input-container flex="20">
                <input #ename md-input [(ngModel)]="obj.name">
              </md-input-container>
              <md-input-container *ngIf="obj.value" flex="20">
                <input #evalue md-input [(ngModel)]="obj.value">
              </md-input-container>
              <div *ngIf="obj.nestedValue"> 
                <div *ngFor="let obj2 of obj.nestedValue">
                <div layout="row">
                  <md-input-container flex="20">
                    <input #ename md-input [(ngModel)]="obj2.name">
                  </md-input-container>
                  <md-input-container *ngIf="obj2.value" flex="20">
                    <input #evalue md-input [(ngModel)]="obj2.value">
                  </md-input-container>
                </div>
                </div> 
              </div>
            </div> 
          </div>       
        </md-card-content>
      </md-card>
    `,
})

export class MyJsonEditor {

  //@Input() jsonObject = {};

  jsonObject: any = {
    "stringProperty": "This is a string",
    "dateProperty": "2017-02-20T23:13:05.219Z",
    "numberProperty": 10000,
    "booleanProperty": {
      "Col1": "Value1",
      "Col2": "Value2",
    },
  };

  jsonData: any[] = [];

  constructor() {

  }

  ngOnInit() {
   this.jsonData = this.getJsonData(this.jsonObject);
    console.log("Json ", this.jsonData);
  }

  getJsonData(mongoData) {
    let jsonData = [];
    let columns = Object.keys(mongoData);
    columns.forEach(col => {
      let rowInfo = {name: "", value:"", nestedValue:[]};
      rowInfo.name = col;
      if(mongoData[col] instanceof Object) {
        rowInfo.nestedValue = this.getJsonData(mongoData[col]);
      } else {
        rowInfo.value = mongoData[col];
      }
      jsonData.push(rowInfo);
    });
    return jsonData;
  }

  onClick() {
    //console.log("Json ", this.jsonObject);
  }
}
