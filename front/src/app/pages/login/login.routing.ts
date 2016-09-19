import {Routes}         from '@angular/router';
import {AuthGuard}      from '../../shared/auth-guard.service';
import {AuthService}    from '../../shared/auth.service';
import {LoginComponent} from './login.component';

export const loginRoutes: Routes = [
  {path: 'login', component: LoginComponent}
];

export const authProviders = [
  AuthGuard,
  AuthService
];

