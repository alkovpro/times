import {Injectable} from '@angular/core';
// import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';

@Injectable()
export class LoginService {

  constructor(private _http: Http, private _router: Router) {
  }

  // ALL the WORK with HTTP
  logErrorAndCheckAuth(err): boolean {
    let res = true;
    console.log('Error: ', err);
    // if (err.status === 401) {
    //     localStorage.removeItem('jwt');
    //     this._router.navigateByUrl('/login');
    //     res = false;
    // }
    return res
  }

  sendAuthHttpRequest(url: string, params?: any, forceGet?: boolean) {
    if (forceGet == undefined) {
      if (params == undefined) {
        forceGet = true;
      } else {
        forceGet = false;
      }
    }
    if (params == undefined) params = forceGet ? '' : {};
    url = 'http://localhost:5000/api/account/' + url;
    if (forceGet) {
      if (params.length > 0) url = url + '?' + params;
      return this._http.get(url)
        .map((res: Response) => res.json());
    } else {
      let body = JSON.stringify(params);
      let headers = new Headers({
        'Content-Type': 'application/json',
        'access-control-allow-origin': '*'
      });
      let options = new RequestOptions({headers: headers});
      return this._http.post(url, body, options)
        .map((res: Response) => res.json());
    }
  }

  // LOGIN
  loginError(err) {
    if (this.logErrorAndCheckAuth(err)) {
      // process other errors
    }
  }

  login(params: any) {
    return this.sendAuthHttpRequest('login', params);
  }

  // REGISTER
  registerError(err) {
    if (this.logErrorAndCheckAuth(err)) {
      // process other errors
    }
  }

  register(params: any) {
    return this.sendAuthHttpRequest('register', params);
  }

  // RESET PASSWORD
  resetError(err) {
    if (this.logErrorAndCheckAuth(err)) {
      // process other errors
    }
  }

  reset(params: any) {
    return this.sendAuthHttpRequest('reset', params);
  }

}
