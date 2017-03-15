import {Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";

@Component({
  selector: 'my-progress-bar',
  template: `
              <md-progress-bar
                style="margin: 0 70px 0 0;"
                [attr.color]="color"
                [mode]="mode"
                [value]="percent">
              </md-progress-bar>
  `,
})

export class MyProgressBar implements OnInit, OnChanges {
  @Input() color: string = 'primary';
  @Input() mode: string = 'determinate';
  @Input() percent: number = 40;

  @Output() selected = new EventEmitter();

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes) {
    if(this.percent >70) {
      this.color = "warn";
    } else if(this.percent > 90) {
      this.color = "accent";
    }
    //console.log("Color Change");
    this.changeDetector.detectChanges();
  }

  onSelected(event) {
    this.selected.emit(event);
  }
}
