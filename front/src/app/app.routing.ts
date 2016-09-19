import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
// import { LoggedInRouterOutlet } from './shared/loggedin.directive';
import {LoginComponent, LoginConfirmedComponent, LoginResetComponent} from './pages/login/login.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {TimesComponent} from "./pages/times/times.component";
import {ProfileComponent} from "./pages/profile/profile.component";


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'confirmed', component: LoginConfirmedComponent},
  {path: 'reset', component: LoginResetComponent},
  {
    path: '',
    component: DashboardComponent,
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

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
