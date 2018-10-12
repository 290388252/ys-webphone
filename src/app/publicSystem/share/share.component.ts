import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

import {urlParse} from '../../utils/util';
@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  private token: string;
  private img: string;
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }
  ngOnInit() {
    this.token = urlParse(window.location.href)['token'];
    this.token = 'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJ4bzY0eWIiLCJzdWIiOiJ7XCJpZFwiOlwiNzA5MFwiLFwib3BlbklkXCI6XCJvS2taeTA0eVlLODF4VGp6a3NOMW9KTHppZU4wXCIsXCJwYXlUeXBlXCI6XCIxXCIsXCJ0eXBlXCI6MX0iLCJleHAiOjE1Mzk1NzAzODAsImlhdCI6MTUzODk2NTU4MH0.u7pobc7sbOpaAyIEI0Sm9F19KaHhezFSsIx_dywSPKjeXtBLnEztnEPiRwCCc8ztqYqYbJ5ci0QmwhTCsI8TDg';
    this.appService.postAliData(this.appProperties.adminCreateForeverStrQrUrl, '', this.token).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          this.img = data.data;
        }
        },
      error2 => {
        console.log(error2);
      }
    );
  }
  register() {
    this.router.navigate(['register'], {
      queryParams: {
        token: this.token,
        vmCode: '1988000080',
        flag: 'share'
      }
    });
  }
  // 判断是微信登陆还是支付宝登陆
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
