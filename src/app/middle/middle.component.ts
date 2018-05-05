import { Component , OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-middle',
  templateUrl: './middle.component.html',
  styleUrls: ['./middle.component.css']
})
export class MiddleComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    this.IsWeixinOrAlipay();
  }
  IsWeixinOrAlipay() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i)[0] === 'micromessenger' ) {
      this.router.navigate(['main'], {
        queryParams: {
          vmCode: this.urlParse(window.location.search)['vmCode']
        }});
    }
    if (ua.match(/AlipayClient/i)[0] === 'alipayclient') {
      this.router.navigate(['main'], {
        queryParams: {
          vmCode: this.urlParse(window.location.search)['vmCode']
        }});
    }
    return false;
  }
  urlParse(url): object {
    const obj = {};
    const reg = /[?&][^?&]+=[^?&]+/g;
    const arr = url.match(reg);
    if (arr) {
      arr.forEach(function (item) {
        const tempArr = item.substring(1).split('=');
        const key = decodeURIComponent(tempArr[0]);
        const val = decodeURIComponent(tempArr[1]);
        obj[key] = val;
      });
    }
    return obj;
  }
}
