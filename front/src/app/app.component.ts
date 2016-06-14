import { Component, ViewEncapsulation } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { OnInit } from '@angular/core';
import { LoggedInRouterOutlet } from './loggedin.directive';
import { LoginComponent, LoginConfirmedComponent, LoginResetComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@Component({
  moduleId: module.id,
  selector: 'times-app',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  directives: [LoggedInRouterOutlet],
  styleUrls: ['app.component.css'],
})
@RouteConfig([
  { path: '/', redirectTo: ['Dashboard','Times'], useAsDefault: true },
  { path: '/login', as: 'Login', component: LoginComponent },
  { path: '/confirmed', as: 'Confirmed', component: LoginConfirmedComponent },
  { path: '/reset', as: 'Reset', component: LoginResetComponent },
  { path: '/dashboard/...', as: 'Dashboard', component: DashboardComponent }
])
export class TimesAppComponent {
  constructor(private router: Router) {}

  // ngOnInit() {
  //   // var token = localStorage.getItem('id_token');
  //   // if (token !== null) {
  //   //   this.router.navigate(['Dashboard']);
  //   // } else {
  //   //   this.router.navigate(['Login']);
  //   // }
  // }
}