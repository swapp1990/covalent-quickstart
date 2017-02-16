import {Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";

@Component({
  selector: 'my-chart',
  template: `
             <div *ngIf="mode=='Gauge'"style="height:250px;">
              <ngx-charts-gauge
                [scheme]="colorScheme"
                [results]="single"
                [min]="0"
                [max]="100"
                [units]="'usage'"
                [bigSegments]="10"
                [smallSegments]="5">
              </ngx-charts-gauge>
             </div> 
             <div *ngIf="mode=='Pie'"style="height:250px;">
              <ngx-charts-pie-chart
                [view]="view"
                [scheme]="colorScheme"
                [results]="single"
                [legend]="false"
                [explodeSlices]="true"
                [labels]="true"
                [doughnut]="false"
                [gradient]="true"
                (select)="onSelect($event)">
              </ngx-charts-pie-chart>
             </div>
             <div *ngIf="mode=='Bar-V'"style="height:250px;">
              <ngx-charts-bar-vertical
                [view]="view"
                [scheme]="colorScheme"
                [results]="single"
                [gradient]="true"
                [xAxis]="true"
                [yAxis]="true"
                [legend]="false"
                [showXAxisLabel]="false"
                [showYAxisLabel]="false"
                [xAxisLabel]="xAxisLabel"
                [yAxisLabel]="yAxisLabel"
                (select)="onSelect($event)">
              </ngx-charts-bar-vertical>
             </div>
             <div *ngIf="mode=='Bar-H'"style="height:250px;">
              <ngx-charts-bar-horizontal
                [view]="view"
                [scheme]="colorScheme"
                [results]="single"
                [gradient]="true"
                [xAxis]="true"
                [yAxis]="true"
                [legend]="false"
                [showXAxisLabel]="false"
                [showYAxisLabel]="false"
                [xAxisLabel]="xAxisLabel"
                [yAxisLabel]="yAxisLabel"
                (select)="onSelect($event)">
              </ngx-charts-bar-horizontal>
             </div>
             <div *ngIf="mode=='Line'"style="height:250px;">
              <ngx-charts-line-chart
                [view]="view"
                [scheme]="colorScheme"
                [results]="single"
                [gradient]="true"
                [xAxis]="true"
                [yAxis]="true"
                [legend]="false"
                [showXAxisLabel]="false"
                [showYAxisLabel]="false"
                [xAxisLabel]="xAxisLabel"
                [yAxisLabel]="yAxisLabel"
                [autoScale]="true"
                (select)="onSelect($event)">
              </ngx-charts-line-chart>
             </div>
             
             
  `,
})

export class MyChart implements OnInit, OnChanges {
  colorScheme: any = {
    domain: ['#1565C0', '#03A9F4', '#FFA726', '#FFCC80'],
  };

  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];

  @Input() mode: string = 'Gauge';

  //@Output() selected = new EventEmitter();

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.changeDetector.detectChanges();
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnChanges(changes) {
    this.changeDetector.detectChanges();
  }

  onSelected(event) {
    //this.selected.emit(event);
  }
}
