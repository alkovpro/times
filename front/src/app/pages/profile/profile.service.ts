import {Injectable} from '@angular/core';
// import {AuthHttp} from 'angular2-jwt/angular2-jwt';
import {Http} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import {Router} from '@angular/router';

@Injectable()
export class ProfileService {

  // constructor(private _http: AuthHttp, private _router: Router) { }
  constructor(private _http: Http, private _router: Router) {
  }

  // ALL the WORK with HTTP
  logErrorAndCheckAuth(err): boolean {
    let res = true;
    console.log('Error: ', err);
    if (err.status === 401) {
      localStorage.removeItem('jwt');
      this._router.navigateByUrl('/login');
      res = false;
    }
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
      if (params.length > 0) url = url + '?' + params
      return this._http.get(url)
        .map((res: Response) => res.json());
      // .catch(this.handleError);
    } else {
      let body = JSON.stringify(params);
      let headers = new Headers({
        'Content-Type': 'application/json',
        'access-control-allow-origin': '*'
      });
      let options = new RequestOptions({headers: headers});
      return this._http.post(url, body, options)
        .map((res: Response) => res.json());
      // .catch(this.handleError);
    }
  }

  // private handleError (error: any) {
  //   // In a real world app, we might use a remote logging infrastructure
  //   // We'd also dig deeper into the error to get a better message
  //   let errMsg = (error.message) ? error.message :
  //     error.status ? `${error.status} - ${error.statusText}` : 'Server error';
  //   console.error(errMsg); // log to console instead
  //   return Observable.throw(errMsg);
  // }
  // PROFILE

  // LOAD PROFILE DATA
  loadProfileError(err) {
    if (this.logErrorAndCheckAuth(err)) {
      // process other errors
    }
  }

  loadProfile() {
    return this.sendAuthHttpRequest('profile');
  }

  // SAVE PROFILE DATA
  saveProfileError(err) {
    if (this.logErrorAndCheckAuth(err)) {
      // process other errors
    }
  }

  saveProfile(params: any) {
    return this.sendAuthHttpRequest('saveprofile', params);
  }

  // SAVE PASSWORD
  savePasswordError(err) {
    if (this.logErrorAndCheckAuth(err)) {
      // process other errors
    }
  }

  savePassword(params: any) {
    return this.sendAuthHttpRequest('savepassword', params);
  }

  // USERS

  // LOAD USERS by parts
  loadUsersError(err) {
    if (this.logErrorAndCheckAuth(err)) {
      // process other errors
    }
  }

  loadUsers(params: any) {
    return this.sendAuthHttpRequest('users', params);
  }

  // ADD or EDIT a USER
  saveUserError(err) {
    if (this.logErrorAndCheckAuth(err)) {
      // process other errors
    }
  }

  saveUser(params: any) {
    return this.sendAuthHttpRequest('saveuser', params);
  }

  // DELETE a USER
  deleteUserError(err) {
    if (this.logErrorAndCheckAuth(err)) {
      // process other errors
    }
  }

  deleteUser(params: any) {
    return this.sendAuthHttpRequest('deleteuser', params);
  }

}
