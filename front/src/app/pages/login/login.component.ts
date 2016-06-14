import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { LoginService } from './login.service';

@Component({
    moduleId: module.id,
	selector : 'login',
	templateUrl : 'login.component.html',
	styleUrls: ['login.component.css'],
	providers: [LoginService],
    encapsulation: ViewEncapsulation.None
})

export class LoginComponent {
    msg = {
        text: [],
        class: ''
    };
    formdata = {
        email: '',
        password: '',
        password1:''
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
    showRegister(mode,wait_ms=500) {
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
	constructor( public _router: Router, public loginService: LoginService) {
        this.request = false;
        this.forgot = false;
        this.showForgot(false,0);
        this.showRegister(false,0);
    }
    authenticate() {
        if (this.request) return;
        if (!this.register) {
            this.request = true;
            this.loginService.login(this.formdata)
                .subscribe(
                    res => {
                        this.request = false;
                        this.saveToken(res);
                    },
                    err => {
                        this.request = false;
                        this.msg = {text:['Error sending request to server. Try again later'],class:'msg-error'};
                        this.loginService.loginError(err);
                    }
                )
        } else {
            this.request = false;
            this.showRegister(false);
        }

    }
    loginSuccess() {
		this._router.parent.navigateByUrl('/dashboard');
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
                this.msg.class = 'msg-error';
                //console.log('Error: '+data.message);
            }
        }
    }
    afterRegister(data) {
        if (data !== undefined) {
            if (data.success) {
                this.msg.class = 'msg-info';
            } else {
                this.msg.class = 'msg-error';
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
            this.loginService.register(this.formdata)
                .subscribe(
                    res => {
                        this.request = false;
                        this.afterRegister(res);
                    },
                    err => {
                        this.request = false;
                        this.msg = {text:['Error sending request to server. Try again later'],class:'msg-error'};
                        this.loginService.registerError(err);
                    }
                )
        } else {
            this.request = false;
            this.showRegister(true);
        }
    }
    showForgot(mode,wait_ms=300) {
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
    doForgot(mode=true) {
        if (mode) {
            if (this.request) return;
            if (this.forgot) {
                this.request = true;
                this.loginService.reset({email:this.formdata.email})
                    .subscribe(
                        res => {
                            this.request = false;
                            if (res !== undefined) if (res.success) this.showForgot(false);
                            this.afterRegister(res);
                        },
                        err => {
                            this.request = false;
                            this.msg = {text:['Error sending request to server. Try again later'],class:'msg-error'};
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
    focusing(elem, mode=false) {
        this.focused[elem] = mode;
    }
    getVal(cond, iftrue, ifnot) {
        return(cond?iftrue:ifnot);
    }
    isEmpty(v) {
        return(!((v !== undefined) && (v !== '') && (v !== 0)));
    }
}

export class LoginConfirmedComponent extends LoginComponent {
    msg = {
        text: ['Thank you for confirming email. You can now login.'],
        class: 'msg-info'
    };
    loginSuccess() {
		this._router.parent.navigateByUrl('/dashboard/profile');
    }
}

export class LoginResetComponent extends LoginComponent {
    msg = {
        text: ['Your password has been reset. You can now login.'],
        class: 'msg-info'
    };
    loginSuccess() {
		this._router.parent.navigateByUrl('/dashboard/profile');
    }
}
