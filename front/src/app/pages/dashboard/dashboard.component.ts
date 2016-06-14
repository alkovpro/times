import {Component, ViewEncapsulation} from '@angular/core';
import { RouteConfig, Router, CanActivate } from '@angular/router-deprecated';
import { LoggedInRouterOutlet } from '../../loggedin.directive';
import { OnInit } from '@angular/core';
import {TimesComponent} from '../times/times.component';
import {ProfileComponent} from '../profile/profile.component';
import {SidebarCmp} from '../../widgets/sidebar/sidebar.component';

@Component({
  moduleId: module.id,
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  directives: [LoggedInRouterOutlet, SidebarCmp]
})
@RouteConfig([
    { path: '/', redirectTo: ['Times'], useAsDefault: true },
    { path: '/times', as: 'Times', component: TimesComponent },
    { path: '/profile', as: 'Profile', component: ProfileComponent }
])
//@CanActivate(() => tokenNotExpired())

export class DashboardComponent  {
  constructor(private router: Router) {}

  // ngOnInit() {
  //   //this.router.navigate(['/dashboard/times']);
  // }
}