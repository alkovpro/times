// import { Component, ViewEncapsulation } from '@angular/core';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from './login.service';
import {AuthService}    from '../../shared/auth.service';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [LoginService],
  // encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  msg = {
    text: [],
    class_name: ''
  };
  form_data = {
    email: '',
    password: '',
    password1: ''
  };

  visible: string;
  register: boolean;
  forgot: boolean;
  forgot_visible: boolean;
  request: boolean;
  focused = {
    email: false,
    password: false,
    password1: false
  };

  showRegister(mode, wait_ms = 500) {
    if (mode) {
      this.visible = 'block';
      setTimeout(() => {
        this.register = true;
      }, 50);
    } else {
      this.register = false;
      setTimeout(() => {
        this.visible = 'none';
      }, wait_ms);
    }
  }

  constructor(public _router: Router, public loginService: LoginService) {
    this.request = false;
    this.forgot = false;
    this.showForgot(false, 0);
    this.showRegister(false, 0);
  }

  authenticate() {
    if (this.request) return;
    if (!this.register) {
      this.request = true;
      this.loginService.login(this.form_data)
        .subscribe(
          res => {
            this.request = false;
            this.saveToken(res);
          },
          err => {
            this.request = false;
            this.msg = {text: ['Error sending request to server. Try again later'], class_name: 'msg-error'};
            this.loginService.loginError(err);
          }
        )
    } else {
      this.request = false;
      this.showRegister(false);
    }

  }

  loginSuccess() {
    this._router.navigateByUrl('/dashboard');
  }

  getMessages(msg) {
    if (typeof msg === 'string') {
      return [msg];
    } else {
      return msg;
    }
  }

  saveToken(data) {
    if (data !== undefined) {
      //console.log(data);
      if (data.success) {
        localStorage.setItem('jwt', data.token);
        this.loginSuccess();
      } else {
        this.msg.text = this.getMessages(data.message);
        this.msg.class_name = 'msg-error';
        //console.log('Error: '+data.message);
      }
    }
  }

  afterRegister(data) {
    if (data !== undefined) {
      if (data.success) {
        this.msg.class_name = 'msg-info';
      } else {
        this.msg.class_name = 'msg-error';
      }
      this.msg.text = this.getMessages(data.message);
    }
  }

  logError(err) {
    this.request = false;
    console.log('Error: ' + err);
  }

  doRegister() {
    if (this.request) return;
    if (this.register) {
      this.request = true;
      this.loginService.register(this.form_data)
        .subscribe(
          res => {
            this.request = false;
            this.afterRegister(res);
          },
          err => {
            this.request = false;
            this.msg = {text: ['Error sending request to server. Try again later'], class_name: 'msg-error'};
            this.loginService.registerError(err);
          }
        )
    } else {
      this.request = false;
      this.showRegister(true);
    }
  }

  showForgot(mode, wait_ms = 300) {
    if (mode) {
      this.forgot_visible = true;
      setTimeout(() => {
        this.forgot = true;
      }, 50);
    } else {
      this.forgot = false;
      setTimeout(() => {
        this.forgot_visible = false;
      }, wait_ms);
    }
  }

  doForgot(mode = true) {
    if (mode) {
      if (this.request) return;
      if (this.forgot) {
        this.request = true;
        this.loginService.reset({email: this.form_data.email})
          .subscribe(
            res => {
              this.request = false;
              if (res !== undefined) if (res.success) this.showForgot(false);
              this.afterRegister(res);
            },
            err => {
              this.request = false;
              this.msg = {text: ['Error sending request to server. Try again later'], class_name: 'msg-error'};
              this.loginService.resetError(err);
            }
          )
      } else {
        this.request = false;
        this.showForgot(true);
      }
    } else {
      this.showForgot(false);
    }
  }

  focusing(elem, mode = false) {
    this.focused[elem] = mode;
  }

  getVal(cond, iftrue, ifnot) {
    return (cond ? iftrue : ifnot);
  }

  isEmpty(v) {
    return (!((v !== undefined) && (v !== '') && (v !== 0)));
  }
}

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [LoginService],
  // encapsulation: ViewEncapsulation.None
})
export class LoginConfirmedComponent extends LoginComponent {
  msg = {
    text: ['Thank you for confirming email. You can now login.'],
    class_name: 'msg-info'
  };

  loginSuccess() {
    this._router.navigateByUrl('/dashboard/profile');
  }
}

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  providers: [LoginService],
  // encapsulation: ViewEncapsulation.None
})
export class LoginResetComponent extends LoginComponent {
  msg = {
    text: ['Your password has been reset. You can now login.'],
    class_name: 'msg-info'
  };

  loginSuccess() {
    this._router.navigateByUrl('/dashboard/profile');
  }
}
