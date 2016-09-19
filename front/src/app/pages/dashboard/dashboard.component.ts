import {Component, ViewEncapsulation} from '@angular/core';
import {TimesComponent} from '../times/times.component';
import {ProfileComponent} from '../profile/profile.component';
// import {SidebarCmp} from '../../widgets/sidebar/sidebar.component';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  // encapsulation: ViewEncapsulation.None,
  // directives: [SidebarCmp]
})
//@CanActivate(() => tokenNotExpired())

export class DashboardComponent {
}