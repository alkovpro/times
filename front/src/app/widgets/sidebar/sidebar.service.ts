import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
// import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import {Response} from '@angular/http';
// import 'rxjs/add/operator/map';
import {Router} from '@angular/router';

@Injectable()
export class SidebarService {

  constructor(private _http: Http, private _router: Router) {
  }

  getInfoError(err) {
    console.log('Error: ', err);
    if (err.status === 401) {
      localStorage.removeItem('jwt');
      this._router.navigateByUrl('/login');
    }
  }

  getInfo() {
    return this._http.get('http://localhost:5000/api/account/sidebar')
      .map((res: Response) => res.json());
  }

}