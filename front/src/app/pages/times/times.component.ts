import {Component, ViewEncapsulation} from '@angular/core';
// import { LoggedInRouterOutlet } from '../../loggedin.directive';
// import {Headers, RequestOptions, Response} from '@angular/http';
// import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import 'rxjs/add/operator/map';

@Component({
  selector: 'times',
  templateUrl: './times.component.html',
  styleUrls: ['./times.component.scss']
  // directives: [LoggedInRouterOutlet],
  // encapsulation: ViewEncapsulation.None
})

export class TimesComponent {
  // constructor(private http: AuthHttp) {
  // http.get('http://localhost:5000/api/account/accounts')
  // 	.map((res: Response) => res.json())
  // 	.subscribe(
  // 		data => {
  // 			console.log(data);
  // 		},
  // 		err => {
  // 			console.log(err);
  // 		},
  // 		() => {
  // 			console.log('success');
  // 		}
  // 	);

  // }
}
