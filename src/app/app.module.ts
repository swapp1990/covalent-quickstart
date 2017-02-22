import { NgModule, Type } from '@angular/core';
import { BrowserModule, Title }  from '@angular/platform-browser';

import {CovalentCoreModule, CovalentJsonFormatterModule} from '@covalent/core';
import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';
import {CovalentChartsModule, TdChartsComponent} from '@covalent/charts';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UsersFormComponent } from './users/+form/form.component';
import { LogsComponent } from './logs/logs.component';
import { FormComponent } from './form/form.component';
import { DetailComponent } from './detail/detail.component';
import { LoginComponent } from './login/login.component';
import { DashboardProductComponent } from './dashboard-product/dashboard-product.component';
import { ProductOverviewComponent } from './dashboard-product/overview/overview.component';
import { ProductStatsComponent } from './dashboard-product/stats/stats.component';
import { ProductFeaturesComponent } from './dashboard-product/features/features.component';
import { FeaturesFormComponent } from './dashboard-product/features/+form/form.component';
import { TemplatesComponent } from './templates/templates.component';
import { DashboardTemplateComponent } from './templates/dashboard/dashboard.component';
import { EmailTemplateComponent } from './templates/email/email.component';
import { EditorTemplateComponent } from './templates/editor/editor.component';
import { appRoutes, appRoutingProviders } from './app.routes';

import { ChartComponent } from '../components/chart/chart.component';

import { RequestInterceptor } from '../config/interceptors/request.interceptor';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {MyDashboardComponent, MyDialogContent} from "./my-dashboard/my-dashboard.component";
import {TransactionService} from "../services/transactions.service";
import {MyTable} from "./shared/datatable/my-table.component";
import {MyNGXTable} from "./shared/datatable/ngx/ngx-table.component";
import {MyCovTable} from "./shared/datatable/covalent/covalent-table.component";
import {MySideTabs} from "./shared/side-tabs/my-side-tabs.component";
import {MyCovSideNav} from "./shared/side-tabs/covalent/covalent-sidenav.component";
import {DetailView} from "./my-dashboard/detail-view/detail-view.component";
import {MyExpansionPanel} from "./shared/expansion-panel/expansion-panel.component";
import DynamicComponent from "./shared/dynamic-component/dynamic-component";
import {DetailViewTable} from "./my-dashboard/detail-view/detail-view-table.component";
import {MySearchView} from "./search-view/search-view.component";
import {EducationLoan} from "./my-dashboard/detail-view/special/education-loan.dyn.component";
import {CarLoan} from "./my-dashboard/detail-view/special/car-loan.dyn.component";
import {MyProgressBar} from "./shared/progress-bar/my-progress-bar.component";
import {MyChart} from "./shared/charts/my-chart.component";
import {MobileBill} from "./my-dashboard/detail-view/special/mobile-bill.dyn.component";
import {MyJsonViewer} from "./shared/json formatter/my-json-viewer.component";
import {MyJsonEditor} from "./shared/json formatter/my-json-editor.component";
import {ObjectViewComponent} from "./shared/json formatter/object-view.component";

const httpInterceptorProviders: Type<any>[] = [
  RequestInterceptor,
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    MyDashboardComponent,
    MySearchView,
    DynamicComponent,
    DetailView,
    DetailViewTable,
    EducationLoan,
    CarLoan,
    MobileBill,
    MyExpansionPanel,
    MyTable,
    MyNGXTable,
    MyCovTable,
    MySideTabs,
    MyCovSideNav,
    MyProgressBar,
    MyChart,
    MyDialogContent,
    MyJsonViewer,
    MyJsonEditor,
    ObjectViewComponent,
    DashboardProductComponent,
    ProductOverviewComponent,
    ProductStatsComponent,
    ProductFeaturesComponent,
    FeaturesFormComponent,
    UsersComponent,
    UsersFormComponent,
    LogsComponent,
    FormComponent,
    DetailComponent,
    LoginComponent,
    ChartComponent,
    TemplatesComponent,
    DashboardTemplateComponent,
    EmailTemplateComponent,
    EditorTemplateComponent
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    BrowserModule,
    CovalentCoreModule.forRoot(),
    CovalentChartsModule.forRoot(),
    CovalentHttpModule.forRoot({
      interceptors: [{
        interceptor: RequestInterceptor, paths: ['**'],
      }],
    }),
    CovalentHighlightModule.forRoot(),
    CovalentMarkdownModule.forRoot(),
    CovalentJsonFormatterModule.forRoot(),
    appRoutes,
    NgxChartsModule,
    NgxDatatableModule
  ], // modules needed to run this module
  providers: [
    appRoutingProviders,
    httpInterceptorProviders,
    Title,
    TransactionService
  ], // additional providers needed for this module
  entryComponents: [ ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
