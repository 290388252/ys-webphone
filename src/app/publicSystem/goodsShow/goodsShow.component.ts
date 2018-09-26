import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {urlParse} from '../../utils/util';
declare var WeixinJSBridge: any;

@Component({
  selector: 'app-detail',
  templateUrl: './goodsShow.component.html',
  styleUrls: ['./goodsShow.component.css']
})
export class GoodsShowComponent implements OnInit {
  public more: boolean;
  public single: boolean;
  public close: boolean;
  public isVisibleOpen: boolean;
  public token: string;
  public goodsList = [];
  public totalPrice = 0;
  public count = 0;
  private timeInterval;
  public flag;
  public img = this.appProperties.imgUrl;
  public replenishList;
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    this.goodsList = [];
    this.isVisibleOpen = false;
    this.getCookies();
    console.log(urlParse(window.location.search)['vmCode']);
    this.flag = urlParse(window.location.search)['flag'];
    console.log(this.token);
    console.log(this.flag);
    this.oneGoodsOrMore();
  }
  turnText(num) {
    let text;
    if (num < 0) {
      text = `拿取数量${-num}`;
    } else if (num > 0) {
      text = `补货数量${num}`;
    }
    return text;
  }
  follow() {
    window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzQ4MTY0Mg==&scene=124#wechat_redirect';
  }
  exit() {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i)) {
        if (ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
          if (this.flag === 3 || this.flag === '3'
            || this.flag === 4 || this.flag === '4') {
            this.router.navigate(['addMain'], {
              queryParams: {
                vmCode: urlParse(window.location.search)['vmCode'],
                payType: 1
              }});
          } else {
            WeixinJSBridge.call('closeWindow');
          }
        }
      } else if (ua.match(/AlipayClient/i)) {
        if (ua.match(/AlipayClient/i)[0] === 'alipayclient') {
          if (this.flag === 3 || this.flag === '3'
            || this.flag === 4 || this.flag === '4') {
            this.router.navigate(['addMain'], {
              queryParams: {
                vmCode: urlParse(window.location.search)['vmCode'],
                payType: 2
              }});
          } else {
            window['AlipayJSBridge'].call('closeWebview');
          }
        }
      }
  }
  getData() {
    this.appService.getAliData(this.appProperties.machineControlUrl,
      {vmCode:  urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data => {
        console.log(data);
        console.log(this.token);
        this.goodsList = data.data.itemList;
        this.totalPrice = data.data.totalPrice;
        this.isClosed();
        // this.goodsList.forEach(item => {
        //   if (item.changeNum < 0) {
        //     this.totolPrice += item.price;
        //   }
        // });
        // console.log(this.totolPrice);
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  // 检测是否关门
  isClosed() {
    this.appService.getDataOpen(this.appProperties.isClosedUrl,
      {vmCode: urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data2 => {
        this.count++;
        if (this.count === 20) {
          this.isVisibleOpen = true;
          clearInterval(this.timeInterval);
        }
        console.log(data2);
        if (data2.data === false) {
          // alert('您的门还未关闭！优水到家提醒您,为了您账号资金安全,提水后请随手关门');
          if (urlParse(window.location.search)['flag'] === 1 || urlParse(window.location.search)['flag'] === '1'
            || urlParse(window.location.search)['flag'] === 4 || urlParse(window.location.search)['flag'] === '4') {
            this.more = true;
            this.close = true;
            this.single = false;
          } else {
            this.more = false;
            this.close = true;
            this.single = true;
          }
        } else if (data2.data === true) {
          this.close = false;
          this.more = true;
          this.single = true;
          clearInterval(this.timeInterval);
          this.appService.getAliData(this.appProperties.machineControlGetReplenishInfoUrl + urlParse(window.location.search)['vmCode'], '',
            this.token).subscribe(
            data3 => {
              console.log(data3);
              this.replenishList = data3.data;
            },
            error3 => {
              console.log(error3);
            }
          );
          // alert('广州优水到家工程感谢你的惠顾,系统将从零钱或者银行卡中自动扣取本次购买费用。');
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  openOk() {
    this.isVisibleOpen = false;
    this.count = 0;
    this.oneGoodsOrMore();
  }
  oneGoodsOrMore() {
    const _this = this;
    if (urlParse(window.location.search)['flag'] === 1 || urlParse(window.location.search)['flag'] === '1'
    || urlParse(window.location.search)['flag'] === 4 || urlParse(window.location.search)['flag'] === '4') {
      this.timeInterval = setInterval(() => {
        _this.isClosed();
      }, 800);
      this.more = true;
      this.close = true;
      this.single = false;
    } else {
      this.timeInterval = setInterval(() => {
        _this.getData();
        // _this.isClosed();
      }, 800);
      this.more = false;
      this.close = true;
      this.single = true;
    }
  }
  getCookies () {
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      const strCookie = document.cookie;
      const arrCookie = strCookie.split(';');
      for (let i = 0; i < arrCookie.length; i++) {
        const arr = arrCookie[i].split('=');
        if (arr[0].trim() === 'adminToken') {
          this.token = arr[1];
        }
      }
    }
  }
}
