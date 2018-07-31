import { Component , OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

@Component({
  selector: 'app-NotPage',
  templateUrl: './notPage.component.html',
  styleUrls: ['./notPage.component.css']
})
export class NotPageComponent implements OnInit {
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {}
  ngOnInit() {
    this.IsWeixinOrAlipay();
  }
  // 判断是微信登陆还是支付宝登陆
  IsWeixinOrAlipay() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i)) {
      if (ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
        this.router.navigate(['main'], {
          queryParams: {
            vmCode: this.urlParse(window.location.search)['vmCode']
          }
        });
      }
    } else if (ua.match(/AlipayClient/i)) {
      if (ua.match(/AlipayClient/i)[0] === 'alipayclient') {
        window.location.href = this.appProperties.aliGetUserIdUrl + this.urlParse(window.location.search)['vmCode'];
        // this.text = 'apiTest';
        // // {vmCode: this.urlParse(window.location.href)['vmCode']
        // this.appService.getData(this.appProperties.aliGetUserIdUrl).subscribe(
        //   data => {
        //     console.log(data.returnObject);
        //     this.text = data.returnObject;
        //     window.location.href = data.returnObject;
        //   },
        //   error2 => {
        //     console.log(error2);
        //     this.text = 'apiError';
        //   }
        // );
      }
    } else {
      // this.appService.getAliData(this.appProperties.aliGetUserIdUrl, {vmCode: this.urlParse(window.location.href)['vmCode']}).subscribe(
      //   data => {
      //     console.log(data.returnObject);
      //     window.location.href = data.returnObject;
      //   },
      //   error2 => {
      //     console.log(error2);
      //   }
      // );
    }
  }
  // 获取页面地址参数
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
