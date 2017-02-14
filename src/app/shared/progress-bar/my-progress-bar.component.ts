import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector: 'my-progress-bar',
  template: `
              <md-progress-bar
                style="margin: 0 70px 0 10px;"
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

  ngOnInit(): void {

  }

  ngOnChanges(changes) {

  }

  onSelected(event) {
    this.selected.emit(event);
  }
}
