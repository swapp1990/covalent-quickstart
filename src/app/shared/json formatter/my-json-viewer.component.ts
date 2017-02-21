import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MdSnackBar, MdSnackBarRef} from "@angular/material";

@Component({
  selector: 'my-json-viewer',
  template: `
      <td-json-formatter [data]="jsonObject" [levelsOpen]="1" (click)="onClick()">
      </td-json-formatter>
    `,
})

export class MyJsonViewer {

  @Input() jsonObject = {};

  object: any = {
    "stringProperty": "This is a string",
    "dateProperty": "2017-02-20T23:13:05.219Z",
    "numberProperty": 10000,
    "booleanProperty": true,
  };

  constructor() {

  }

  onClick() {
    //console.log("Json ", this.jsonObject);
  }
}
