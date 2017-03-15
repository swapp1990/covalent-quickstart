import {Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild} from "@angular/core";
import {MdSnackBar, MdSnackBarRef} from "@angular/material";
import {ObjectViewComponent} from "./object-view.component";

@Component({
  selector: 'my-json-editor',
  template: `
      <md-card>
        <md-card-content>
          <div>
            <md-divider></md-divider>
            <button md-button (click)="update()" color="primary"> UPDATE </button>
            <button md-button (click)="close()" color="primary"> CANCEL </button>
            <md-divider></md-divider>
          </div>
          <object-view #ov [object]="jsonObject" (updatedDetails)="onUpdate($event)"></object-view>
        </md-card-content>
      </md-card>
    `
})

export class MyJsonEditor {

  @Input() jsonObject = {};
  @Input() objectName = "";

  @ViewChild('ov') objectView: any;

  @Output() updatedJson = new EventEmitter();

  constructor(private detectorChanges: ChangeDetectorRef) {
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

  onUpdate(details) {
    console.log("Details ", details);
    this.jsonObject = details;
    this.detectorChanges.detectChanges();
    this.objectView.refreshDetails();
  }

  update() {
    console.log("Json ", this.jsonObject);
    this.updatedJson.emit({object: this.jsonObject, name: this.objectName});
  }

  cancel() {

  }
}
