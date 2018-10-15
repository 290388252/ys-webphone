import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {urlParse} from '../../utils/util';
declare var WeixinJSBridge: any;
declare var wx: any;

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
  public aliPay = false;
  public youshuiCompany = false;
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    this.flag = sessionStorage.getItem('flag');
    // this.flag = urlParse(window.location.search)['flag'];
    this.getToken();
    this.share();
    this.goodsList = [];
    this.appService.postData(this.appProperties.machineInfoGetCompanyIdUrl + urlParse(window.location.search)['vmCode'], '').subscribe(
      data2 => {
        console.log(data2);
        if (data2.returnObject === 76 || data2.returnObject === '76'
          || data2.returnObject === 114 || data2.returnObject === '114'
          || data2.returnObject === 115 || data2.returnObject === '115'
          || data2.returnObject === 116 || data2.returnObject === '116'
          || data2.returnObject === 117 || data2.returnObject === '117') {
          this.youshuiCompany = true;
        } else {
          this.youshuiCompany = false;
        }
      },
      error2 => {
        console.log(error2);
      });
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/AlipayClient/i)) {
      if (ua.match(/AlipayClient/i)[0] === 'alipayclient') {
        this.aliPay = true;
      }
    } else {
      this.aliPay = false;
    }
    this.isVisibleOpen = false;
    console.log(urlParse(window.location.search)['vmCode']);
    console.log(this.token);
    console.log(this.flag);
    this.oneGoodsOrMore();
  }
  turnText(num) {
    let text;
    if (num < 0) {
      text = `拿取数量${-num}`;
    } else if (num > 0 && (this.flag === '3' || this.flag === '4')) {
      text = `补货数量${num}`;
    }
    return text;
  }
  follow() {
    window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzQ4MTY0Mg==&scene=124#wechat_redirect';
  }
  share() {
    this.appService.postAliData(this.appProperties.wechatShareInfoUrl + '?url=http://sms.youshuidaojia.com/goodsShow?vmCode=' + urlParse(window.location.href)['vmCode'],
      '', this.token).subscribe(
      data => {
        console.log(data);
        wx.config({
          debug: false,
          appId: data.data.appId,
          timestamp: data.data.timestamp,
          nonceStr: data.data.nonceStr,
          signature: data.data.signature,
          jsApiList: ['checkJsApi',
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
            'onMenuShareQQ',
            'onMenuShareWeibo',
          ]
        });
        const link = 'http://sms.youshuidaojia.com/share?token=' + this.token;
        console.log(link);
        wx.ready(function () {
          console.log(123);
          // wx.ready(function () {   // 需在用户可能点击分享按钮前就先调用
          //   wx.updateAppMessageShareData({
          //     title: '优水到家', // 分享标题
          //     desc: '分享领取优惠', // 分享描述
          //     link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          //     imgUrl: '../../../assets/main/logo.png', // 分享图标
          //   }, function (res) {
          //     // 这里是回调函数
          //     console.log(res);
          //   });
          // });
          const shareData = {
            title: '优水到家',
            desc: '分享领取优惠', // 这里请特别注意是要去除html
            link: link,
            imgUrl: '../../../assets/main/logo.png',
            success: function () {
              // 用户确认分享后执行的回调函数
              console.log('success');
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
              console.log('cancel');
            }
          };
          wx.onMenuShareAppMessage(shareData);
          // wx.onMenuShareTimeline(shareData);
          // wx.onMenuShareQQ(shareData);
          // wx.onMenuShareWeibo(shareData);
        });
        wx.error(function (res) {
          console.log(res);
        });
      },
      error2 => {
        console.log(error2);
      }
    );
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
          if (this.flag === 1 || this.flag === '1'
            || this.flag === 4 || this.flag === '4') {
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
    if (this.flag === 1 || this.flag === '1'
    || this.flag === 4 || this.flag === '4') {
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
  getToken () {
    let token;
    if (this.flag === 1 || this.flag === '1'
      || this.flag === 2 || this.flag === '2') {
      token = 'token';
    } else {
      token = 'adminToken';
    }
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      const strCookie = document.cookie;
      const arrCookie = strCookie.split(';');
      for (let i = 0; i < arrCookie.length; i++) {
        const arr = arrCookie[i].split('=');
        if (arr[0].trim() === token) {
          this.token = arr[1];
        }
      }
    }
  }
}
