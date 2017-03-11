import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import {NgRedux} from "@angular-redux/store/lib/components/ng-redux";
import {AppState, rootReducer, INITIAL_STATE} from "./store";
import {DevToolsExtension} from "@angular-redux/store/lib/components/dev-tools";
import {CounterActions} from "./actions";

@Component({
  selector: 'qs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private _iconRegistry: MdIconRegistry,
              private _domSanitizer: DomSanitizer,
              ngRedux: NgRedux<AppState>,
              devTools: DevToolsExtension,
              private actions: CounterActions) {
    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'github',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent-mark',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent-mark.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata-ux',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata-ux.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'appcenter',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/appcenter.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'listener',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/listener.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'querygrid',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/querygrid.svg'));

    ngRedux.configureStore(
      rootReducer,
      INITIAL_STATE,
      null,
      devTools.isEnabled() ? [ devTools.enhancer() ] : []);
  }

}
