import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MdSnackBar, MdSnackBarRef} from "@angular/material";

@Component({
  selector: 'my-toast',
  template: `
    `,
})

export class MyToast {
  
  constructor(private _snackBarService: MdSnackBar) {
    
  }

  showSnackBar(): void {
    let snackBarRef: MdSnackBarRef<any> = this._snackBarService.open('Message', 'Action', { duration: 3000 });
  }
}
