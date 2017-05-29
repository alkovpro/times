import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';

import {AppComponent} from './app.component';
import {routing, appRoutingProviders}  from './app.routing';

import {LoginComponent, LoginConfirmedComponent, LoginResetComponent} from './pages/login/login.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {TimesComponent} from "./pages/times/times.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {AgGridModule} from 'ag-grid-ng2/main';

import {SidebarCmp} from "./widgets/sidebar/sidebar.component";
import {provideAuth} from "angular2-jwt/angular2-jwt";
import {DialogService} from "./shared/dialog.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, LoginConfirmedComponent, LoginResetComponent,
    DashboardComponent,
    TimesComponent,
    ProfileComponent,
    SidebarCmp
  ],
  imports: [
    BrowserModule,
    AgGridModule.forRoot(),
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    appRoutingProviders,
    DialogService,
    provideAuth({
      tokenName: 'jwt',
      globalHeaders: [{
        'Content-Type': 'application/json',
        'access-control-allow-origin': '*'
      }],
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
