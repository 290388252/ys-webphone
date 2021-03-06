import { Component , OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../app-service';
import {AppProperties} from '../app.properties';
import {getVmCodes, urlParse} from '../utils/util';

@Component({
  selector: 'app-middle',
  templateUrl: './middle.component.html',
  styleUrls: ['./middle.component.css']
})
export class MiddleComponent implements OnInit {
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {}
  ngOnInit() {
    this.IsWeixinOrAlipay();
  }
  /**
   * 2019-02-16
   * @author YanChao
   * 判断是微信登陆还是支付宝登陆
   */
  IsWeixinOrAlipay() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i)) {
      if (ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
        this.login();
        // this.router.navigate(['main'], {
        //   queryParams: {
        //     vmCode: this.urlParse(window.location.search)['vmCode']
        //   }
        // });
      }
    } else if (ua.match(/AlipayClient/i)) {
      if (ua.match(/AlipayClient/i)[0] === 'alipayclient') {
        this.appService.getData(this.appProperties.aliGetUserIdUrl + '?vmCode=' + urlParse(window.location.search)['vmCode'], '').subscribe(
          data2 => {
            console.log(data2);
            window.location.href = data2.returnObject;
          },
          error2 => {
            console.log(error2);
          }
        );
        // window.location.href = this.appProperties.aliGetUserIdUrl + this.urlParse(window.location.search)['vmCode'];
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
  /**
   * 2019-02-16
   * @author YanChao
   * 获取页面地址参数
   */
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
  /**
   * 2019-02-16
   * @author YanChao
   * 新用户登陆
   */
  login() {
    this.appService.getData(this.appProperties.wechatOauth2Url, {vmCode: urlParse(window.location.href)['vmCode']}).subscribe(
      data => {
        console.log(data);
        let newData;
        let wlhUrl;
        let newWlhUrl;
        if (getVmCodes().includes(urlParse(window.location.search)['vmCode'])) {
          wlhUrl = '/smain?vmCode=' + urlParse(window.location.href)['vmCode'];
          newWlhUrl = '/smain?vmCode=' + urlParse(window.location.href)['vmCode'];
        } else {
           wlhUrl = '/main?vmCode=' + urlParse(window.location.href)['vmCode'];
           newWlhUrl = '/main?vmCode=' + urlParse(window.location.href)['vmCode'];
        }
        // const newWlhUrl = '/register?vmCode=' + urlParse(window.location.href)['vmCode']; // old
        const state = urlParse(data.data)['state'];
        if (typeof(data.data) === 'string' && data.data.length > 0) {
          newData = data.data.replace(data.data.substring(data.data.indexOf('state=') + 6, data.data.length),
            newWlhUrl + '-' + wlhUrl + '-' + state);
          console.log(newData);
          window.location.href = newData;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
