import {Component, ViewEncapsulation, EventEmitter, OnInit} from '@angular/core';
// import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions} from 'ag-grid/main';
import {Router} from '@angular/router';
import {ProfileService} from './profile.service';
import {Profile} from "./profile";
import {AgGridNg2} from "ag-grid-ng2";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  //directives: [AgGridNg2],
  providers: [ProfileService]
})

export class ProfileComponent implements OnInit {
  /////////// DATA /////////////
  profileData: Profile = {
    email: '',
    firstname: '',
    lastname: '',
    username: '',
    orgname: '',
    superuser: false
  };
  superuser: boolean = false;
  passwordData = {
    oldpassword: '',
    password: '',
    password1: ''
  };
  changingPassword: boolean = false;
  userData = {
    email: '',
    username: '',
    role: '',
    firstname: '',
    lastname: ''
  };
  addingUser: boolean = false;
  parentComponent: any = this; // fake variable just for compiler happyness %)
  columnDefs = [
    {headerName: "id", field: "id", hide: true},
    {headerName: "Email", field: "email", editable: true, volatile: true}, //, onCellValueChanged: this.onValueChange },
    {headerName: "User Name", field: "username", editable: true, volatile: true},
    {
      headerName: "Role",
      field: "role",
      editable: true,
      volatile: true,
      cellEditor: "select",
      cellEditorParams: {values: ['User', 'Superuser']}
    }
    // { headerName: "Role", field: "role", suppressMovable: true, suppressResize: true, cellRenderer: this.buttonsCellRenderer }
  ];

  dataSource = {
    //parentComponent: this,
    rowCount: null,
    pageSize: 10,
    overflowSize: 10,
    maxConcurrentRequests: 2,
    maxPagesInCache: 3,
    getRows: function (params: any) {
      this.parentComponent.profileService.loadUsers({startRow: params.startRow, endRow: params.endRow})
        .subscribe(
          res => {
            let lastRow = res.total;
            if (res.data.length <= (params.startRow - params.endRow)) {
              lastRow = params.startRow + res.data.length;
            }
            // call the success callback
            params.successCallback(res.data, lastRow);
          }//,
          //err => this.parentComponent.profileService.loadUsersError(err)
        );
    }
  };

  gridOptions: GridOptions = {
    // had to edit 'node_modules/ag-grid/dist/lib/entities/gridOptions
    // string 19:
    //     parentComponent?: any;   // monkeypatch by alkov.pro for parent component interaction
    //parentComponent: this,
    columnDefs: this.columnDefs,
    enableColResize: true,
    rowSelection: 'single',
    rowDeselection: true,
    onCellFocused: (params: any) => {
      //this.parentComponent.addUserEnd();
    },
    onGridReady: function () {
      this.api.sizeColumnsToFit();
      //this.api.setDatasource(this.parentComponent.dataSource);
    },
    onGridSizeChanged: function () {
      this.api.sizeColumnsToFit();
    },
    onCellValueChanged: (params: any) => {
      //this.parentComponent.onValueChange(params);
    },
    rowData: null, // this.rowData,
    rowModelType: 'virtual', // this is important, if not set, normal paging will be done
    // enableServerSideSorting: true,
    // enableServerSideFilter: true,
    rowHeight: 40,
    headerHeight: 40
  };

  /////////// INIT /////////////
  constructor(private _router: Router, private profileService: ProfileService) {
  }

  ngOnInit() {
    this.refreshProfile();
  }

  /////////// PROFILE /////////////
  refreshProfile() {
    this.profileService.loadProfile()
      .subscribe(
        res => {
          this.profileData = res.data;
          this.superuser = res.superuser;
        },
        err => this.profileService.loadProfileError(err)
      );
  }

  saveProfile() {
    this.profileService.saveProfile(this.profileData)
      .subscribe(
        res => {
          this.profileData = res.data;
          this.superuser = res.superuser;
        },
        err => {
          this.profileService.saveProfileError(err);
        }
      )
  }

  changePassword() {
    this.changePasswordEnd(false);
    this.changingPassword = true;
  }

  changePasswordSave() {
    if (this.passwordData.password !== this.passwordData.password1) {
      // report about unmatched passwords
      console.log('passwords do not match!');
    } else if (this.passwordData.oldpassword.length === 0) {
      // report about missing current password
      console.log('you must provide current password to change it');
    } else {
      this.profileService.savePassword(this.passwordData)
        .subscribe(
          res => {
            this.changePasswordEnd();
          },
          err => {
            this.profileService.savePasswordError(err);
          }
        )
    }
  }

  changePasswordEnd(theEnd?: boolean) {
    if (theEnd == undefined) theEnd = true;
    if (theEnd) this.changingPassword = false;
    this.passwordData = {
      oldpassword: '',
      password: '',
      password1: ''
    }
  }

  /////////// USERS /////////////
  onValueChange(params: any) {
    if (params.newValue !== params.oldValue) {
      this.profileService.saveUser(params.data)
        .subscribe(
          res => {
            console.log(res);
            // TODO: find a proper refresh
            this.refreshUsers();
          },
          err => {
            // TODO: find a proper refresh
            this.refreshUsers();
            this.profileService.saveUserError(err);
          }
        );
    }
  }

  addUser() {
    this.addUserEnd(false);
    this.addingUser = true;
  }

  addUserSave() {
    if (this.userData.email.length === 0) {
      // report about missing email
      console.log('you must provide email for a new user');
    } else {
      this.profileService.saveUser(this.userData)
        .subscribe(
          res => {
            // check if all done right
            console.log(res);
            // TODO: find a proper refresh
            this.refreshUsers(true);
            this.addUserEnd();
          },
          err => {
            this.profileService.saveUserError(err);
          }
        )
    }
  }

  addUserEnd(theEnd?: boolean) {
    if (theEnd == undefined) theEnd = true;
    if (theEnd) this.addingUser = false;
    this.userData = {
      email: '',
      username: '',
      role: '',
      firstname: '',
      lastname: ''
    }
  }

  delUser() {
    let params = {id: this.rowSelected(true).id};
    this.profileService.deleteUser(params)
      .subscribe(
        res => {
          console.log(res);
          this.refreshUsers(true);
        },
        err => this.profileService.deleteUserError(err)
      );
  }

  refreshUsers(hardRefresh?: boolean) {
    if (hardRefresh == undefined) hardRefresh = false;
    // TODO: find a proper refresh
    if (hardRefresh) {
      this.gridOptions.api.setDatasource(this.dataSource);
    } else {
      this.gridOptions.api.refreshView();
    }

  }

  rowSelected(mode: boolean = false): any {
    var res = false;
    if (this.gridOptions != undefined) {
      if (this.gridOptions.api != undefined) {
        res = (this.gridOptions.api.getSelectedRows().length > 0);
        if (mode && res) {
          return this.gridOptions.api.getSelectedRows()[0];
        }
      }
    }
    return mode ? {data: {id: ''}} : res;
  }
}
