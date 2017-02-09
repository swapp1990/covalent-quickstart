import {Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";
import {DetailViewTable} from "../../my-dashboard/detail-view/detail-view-table.component";

@Component({
  selector: 'my-expansion-panel',
  template: `
    <td-expansion-panel label="{{label}}" sublabel="{{sublabel}}" expand="true">
      <td-expansion-summary>
          ... add summary that will be shown when expansion-panel is "collapsed".
      </td-expansion-summary>
      <dynamic-component [componentData]="renderedComponent"></dynamic-component>
    </td-expansion-panel>
  `,
})

export class MyExpansionPanel implements OnInit, OnChanges {
  @Input() label: string;
  @Input() sublabel;
  renderedComponent: any = null;
  @Input() componentData = null;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.renderedComponent = this.componentData;
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes) {
    this.changeDetector.detectChanges();
  }
}
