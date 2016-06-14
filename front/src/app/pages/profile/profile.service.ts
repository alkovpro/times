import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { Headers, RequestOptions } from '@angular/http';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router-deprecated';

@Injectable()
export class ProfileService {

    constructor(private _http: AuthHttp, private _router: Router) { }
    
    // ALL the WORK with HTTP
    logErrorAndCheckAuth(err): boolean {
        let res = true;
        console.log('Error: ',err);
        if (err.status === 401) {
            localStorage.removeItem('jwt');
            this._router.navigateByUrl('/login');
            res = false;
        }
        return res
    }
    sendAuthHttpRequest(url:string,params?:any,forceGet?:boolean) {
        if (forceGet == undefined) {
            if (params == undefined) {
                forceGet = true;
            } else {
                forceGet = false;
            }
        }
        if (params == undefined) params = forceGet?'':{};
        url = 'http://localhost:5000/api/account/' + url;
        if (forceGet) {
            if (params.length > 0) url = url + '?' + params
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
    saveProfile(params:any) {
        return this.sendAuthHttpRequest('saveprofile', params);
    }
    
    // SAVE PASSWORD
    savePasswordError(err) {
        if (this.logErrorAndCheckAuth(err)) {
            // process other errors
        }
    }
    savePassword(params:any) {
        return this.sendAuthHttpRequest('savepassword', params);
    }
    
    // USERS
    
    // LOAD USERS by parts
    loadUsersError(err) {
        if (this.logErrorAndCheckAuth(err)) {
            // process other errors
        }
    }
    loadUsers(params:any) {
        return this.sendAuthHttpRequest('users', params);
    }
    
    // ADD or EDIT a USER
    saveUserError(err) {
        if (this.logErrorAndCheckAuth(err)) {
            // process other errors
        }
    }
    saveUser(params:any) {
        return this.sendAuthHttpRequest('saveuser', params);
    }
    
    // DELETE a USER
    deleteUserError(err) {
        if (this.logErrorAndCheckAuth(err)) {
            // process other errors
        }
    }
    deleteUser(params:any) {
        return this.sendAuthHttpRequest('deleteuser', params);
    }

}