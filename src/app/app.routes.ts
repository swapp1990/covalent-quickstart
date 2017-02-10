import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { UsersComponent } from './users/users.component';
import { UsersFormComponent } from './users/+form/form.component';
import { LogsComponent } from './logs/logs.component';
import { DetailComponent } from './detail/detail.component';
import { LoginComponent } from './login/login.component';
import { FormComponent } from './form/form.component';
import { TemplatesComponent } from './templates/templates.component';
import { DashboardTemplateComponent } from './templates/dashboard/dashboard.component';
import { EmailTemplateComponent } from './templates/email/email.component';
import { EditorTemplateComponent } from './templates/editor/editor.component';
import {MyDashboardComponent} from "./my-dashboard/my-dashboard.component";
import {MySearchView} from "./search-view/search-view.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: MainComponent, children: [{
      component: MyDashboardComponent,
      path: '',
    },
    {path: 'search', component: MySearchView, children: [
    ]},
    {path: 'item/:id', component: DetailComponent},
    {path: 'logs', component: LogsComponent},
    {path: 'form', component: FormComponent},
    {path: 'users', children: [
      {path: '', component: UsersComponent},
      {path: 'add', component: UsersFormComponent},
      {path: ':id/delete', component: UsersFormComponent},
      {path: ':id/edit', component: UsersFormComponent},
    ]},
    {path: 'templates', children: [
      {path: '', component: TemplatesComponent},
      {path: 'dashboard', component: DashboardTemplateComponent},
      {path: 'email', component: EmailTemplateComponent},
      {path: 'editor', component: EditorTemplateComponent},
    ]},
  ]},
];

export const appRoutingProviders: any[] = [

];

export const appRoutes: any = RouterModule.forRoot(routes, { useHash: true });
