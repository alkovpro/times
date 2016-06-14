import { Directive, Attribute, ViewContainerRef, DynamicComponentLoader } from '@angular/core';
import { Router, RouterOutlet, ComponentInstruction } from '@angular/router-deprecated';
import { LoginComponent } from './pages/login/login.component';
import { tokenNotExpired } from 'angular2-jwt/angular2-jwt';

@Directive({
  selector: 'router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  publicRoutes: any;
  private parentRouter: Router;

  constructor(_viewContainerRef: ViewContainerRef, _loader: DynamicComponentLoader,
              _parentRouter: Router, @Attribute('name') nameAttr: string) {
    super(_viewContainerRef, _loader, _parentRouter, nameAttr);

    this.parentRouter = _parentRouter;
    // The Boolean following each route below 
    // denotes whether the route requires authentication to view
    this.publicRoutes = {
      'login': true,
      'confirmed': true,
      'reset': true
    };
  }

  activate(instruction: ComponentInstruction) {
    let url = instruction.urlPath;
    if (!this.publicRoutes[url]) {
      if (!localStorage.getItem('jwt')) {
        this.parentRouter.navigateByUrl('/login');
      } else if (!tokenNotExpired('jwt')) {
        this.parentRouter.navigateByUrl('/login');        
      }
    }
    return super.activate(instruction);
  }
}
