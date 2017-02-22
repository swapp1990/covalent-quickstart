import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MdSnackBar, MdSnackBarRef} from "@angular/material";
import {ObjectViewComponent} from "./object-view.component";

@Component({
  selector: 'my-json-editor',
  template: `
      <md-card>
        <md-card-content>
          <object-view [object]="jsonObject"></object-view>
        </md-card-content>
      </md-card>
    `
})

export class MyJsonEditor {

  @Input() jsonObject = {};

  constructor() {
    //Sampel
    this.jsonObject = {
      "stringProperty": "This is a string",
      "dateProperty": "2017-02-20T23:13:05.219Z",
      "numberProperty": 10000,
      "booleanProperty": {
        "Col1": {
          "NCol1": "NVal1",
          "NCol2": "NVal2"
        },
        "Col2": "Value2",
      },
    };
  }

  ngOnInit() {

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
