import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
// import { LoggedInRouterOutlet } from './shared/loggedin.directive';
import {LoginComponent, LoginConfirmedComponent, LoginResetComponent} from './pages/login/login.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {TimesComponent} from "./pages/times/times.component";
import {ProfileComponent} from "./pages/profile/profile.component";

import { loginRoutes,
         authProviders }      from './pages/login/login.routing';

import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';
import { AuthGuard }          from './shared/auth-guard.service';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'confirmed', component: LoginConfirmedComponent},
  {path: 'reset', component: LoginResetComponent},
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [AuthGuard],
    children: [
      {path: 'times', component: TimesComponent},
      {path: 'profile', component: ProfileComponent},
      {path: '', redirectTo: '/times'}
    ]
  },
  // { path: '', component: LoginComponent },
  //{path: '', redirectTo: 'dashboard', pathMatch: 'prefix'}
  // { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [
  authProviders,
  CanDeactivateGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
