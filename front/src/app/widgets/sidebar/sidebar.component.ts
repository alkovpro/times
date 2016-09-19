import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {SidebarService} from './sidebar.service';
import {Router} from '@angular/router'
import {TimesComponent} from '../../pages/times/times.component';
import {ProfileComponent} from '../../pages/profile/profile.component';


@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
//  providers: [SidebarService],
  encapsulation: ViewEncapsulation.None
})
export class SidebarCmp implements OnInit {
  barData = {
    name: '',
    username: '',
    email: '',
    displayname: ''
  };
  showMenu: string = '';

  constructor(private _router: Router) { //}, private sidebarService: SidebarService) {
  }

  ngOnInit() {
    //   this.sidebarService.getInfo()
    //     .subscribe(
    //       res => {
    //         this.barData = res.data;
    //         this.barData['displayname'] = this.userName();
    //       },
    //       err => this.sidebarService.getInfoError(err)
    //     );
  }

  addExpandClass(element) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  userName() {
    var res = '';
    if (this.barData.name == undefined) this.barData.name = '';
    if (this.barData.username == undefined) this.barData.username = '';
    if (this.barData.email == undefined) this.barData.email = '';

    if (this.barData.name.length > 0) {
      res = this.barData.name;
    } else if (this.barData.username.length > 0) {
      res = this.barData.username;
    } else if (this.barData.email.length > 0) {
      res = this.barData.email;
    }
    return res;
  }

  gotoLogin() {
    localStorage.removeItem('jwt');
    this._router.navigateByUrl('/login');
  }
}
