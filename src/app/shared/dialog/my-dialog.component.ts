import { Component, OnInit, Input, Output, OnChanges, EventEmitter, trigger, state, style, animate, transition } from '@angular/core';

@Component({
  selector: 'my-dialog',
  template:
    `
    <div [@dialog] *ngIf="visible" class="dialog">
      <ng-content></ng-content>
      <div layout="row" class="td-dialog-actions">
        <span flex></span>
        <button md-button (click)="close()" color="primary"> ACCEPT </button>
        <button md-button (click)="cancel()"> CANCEL </button>
      </div>
    </div>
    <div *ngIf="visible" class="overlay" (click)="close()"></div>
    `,
  styleUrls: ['./my-dialog.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class MyDialog implements OnInit {
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  cancel() {
    this.visible = false;
    let changeData: any = {visible: this.visible, action: "Cancel"};
    this.visibleChange.emit(changeData);
  }
}
