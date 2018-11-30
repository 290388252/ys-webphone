import {Component, AfterViewChecked, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {urlParse} from '../../utils/util';
declare var wx: any;
declare var WeixinJSBridge: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit , AfterViewChecked {
  public title: string;
  public id: any;
  public totalPrice = 0;
  public list;
  public vmCode;
  public token;
  public detailVisible = false;
  public doorNO = '无';
  public num = '无';
  public openedTime = '无';
  public closedTime = '无';
  public couponEffectiveList;
  public imgUrl;
  public orderItemList;
  public payCode;
  public refundPrice;
  public refundReason;
  public maxPrice;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appProperties: AppProperties,
  private appService: AppService) {
    this.list = [];
  }

  ngOnInit() {
    this.id = urlParse(window.location.search)['flag'];
    this.imgUrl = this.appProperties.imgUrl;
    if (urlParse(window.location.search)['token'] === undefined) {
      this.getCookies();
    } else {
      this.token = urlParse(window.location.search)['token'];
    }
    console.log(this.id);
    console.log(this.token);
    this.getData(this.appProperties.findAllUserOrderUrl);
  }
  // 获取订单列表
  getData(url) {
    this.appService.getDataOpen(url, {}, this.token).subscribe(
      data => {
        console.log(data);
        if (data) {
            data.forEach((item => {
                  this.totalPrice += item.price;
                  this.totalPrice = Math.floor(this.totalPrice * 100) / 100;
                  this.list.push(item);
              }));
        } else if (data) {
          alert(data.message);
        }
      },
      error => {
        console.log(error);
      }
    );
    this.appService.postAliData(this.appProperties.couponAvailable + '?vmCode=' + urlParse(window.location.search)['vmCode'],
      '', this.token).subscribe(
      data => {
        console.log('123');
        console.log(data);
        // if (data.status === 1) {
          this.couponEffectiveList = data.returnObject;
        // } else if (data.status !== 1) {
        // }
      },
      error => {
        console.log(error);
      }
    );
  }
  getItem(list, name) {
    if (list.length > 1) {
      return list[1][name];
    }
  }
  // 适配背景px
  ngAfterViewChecked(): void {
    if (document.documentElement.offsetHeight > document.getElementById('content').clientHeight) {
      document.getElementById('containers').style.height = document.documentElement.offsetHeight + 'px';
    } else if (document.documentElement.offsetHeight < document.getElementById('content').clientHeight) {
      document.getElementById('containers').style.height = document.getElementById('content').clientHeight + 50 + 'px';
    }
  }
  nzSpan(flag) {
    return flag !== '10002' ? 24 : 20;
  }
  // 支付
  pay(item) {
    this.appService.getDataOpen(this.appProperties.orderUnifiedOrderUrl,
      {
        orderId: item.orderId,
        url: window.location.href.split('#')[0]
      }, this.token).subscribe(
      data => {
        console.log(data);
        if (typeof(WeixinJSBridge) === 'undefined') {
          this.onBridgeUndefindeReady(data, item);
        } else {
          this.onBridgeReady(data, item);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  applyRefund(item) {
    this.payCode = item.payCode;
    this.orderItemList = item.itemList;
    this.maxPrice = item.totalPrice;
    this.refundPrice = this.maxPrice;
    this.appService.postFormData(this.appProperties.IfApplayRefundUrl, {
        payCode: this.payCode,
      }, this.token).subscribe(
      data => {
        console.log(data);
        if (data.status === 0) {
          this.id = '3';
        } else {
          alert(data.returnObject[0].stateName);
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  /*提交*/
  applySubmit() {
    if (this.refundReason === null || this.refundReason === undefined || this.refundReason === '') {
      alert('请输入退款原因!');
      return;
    } else if (this.refundPrice === null || this.refundPrice === undefined || this.refundPrice === '') {
      alert('请输入退款金额！');
      return;
    } else if (this.refundPrice > this.totalPrice) {
      alert('退款金额不能大于最大金额，请重新输入！');
      return;
    } else {
      this.appService.postAliData(this.appProperties.applyRefundUrl, {
        payCode: this.payCode,
        orderType: 1,
        reason: this.refundReason,
        refundPrice: this.refundPrice
      }, this.token).subscribe(
        data => {
          if (data.status === 1) {
            alert(data.message);
            this.id = '1';
          } else {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  // 调用微信支付接口
  onBridgeUndefindeReady(data, item) {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', () => {
        this.test(data, item);
      }, false);
    } else if (document['attachEvent']) {
      document['attachEvent']('WeixinJSBridgeReady', () => {
        this.test(data, item);
      });
      document['attachEvent']('onWeixinJSBridgeReady', () => {
        this.test(data, item);
      });
    }
  }
  // 调用微信支付接口
  onBridgeReady(data, item) {
   this.test(data, item);
  }
  weixinJSBridge(data) {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId: data.appId,
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.prepayId,
        signType: 'SHA1',
        paySign: data.signature
      },
      function(res) {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          alert('支付成功');
          // window.location.reload();
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
          alert('取消支付');
          // window.location.reload();
        } else {
          alert(res.err_msg);
        }
      }
    );
  }
  // 调用微信支付接口测试
  test(data, item) {
    wx.config({
      debug: false,
      appId: data.config.appId,
      timestamp: data.config.timestamp,
      nonceStr: data.config.nonceStr,
      signature: data.config.signature,
      jsApiList: ['checkJsApi',
        'chooseWXPay',
        ]
    });
    wx.ready(() => {
      wx.chooseWXPay({
        debug: false,
        timestamp: data.payInfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: data.payInfo.nonceStr, // 支付签名随机串，不长于 32 位
        package: data.payInfo.package,
        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: data.payInfo.sign, // 支付签名
        success: (res) => {
          if (res.errMsg === 'chooseWXPay:ok') {
            this.getData(this.appProperties.findAllUserOrderUrl);
            item.state = '10002';
            alert('支付成功');
          } else {
            alert('支付失败');
          }
        },
        cancel: (res) => {
          alert('您取消了支付');
          // 支付取消
        },
        error: (res) => {
          alert('出错了，请联系优水到家管理员');
        }
      });
    });
  }
  // 订单详情
  detail(ptCode) {
    this.detailVisible = true;
    this.appService.postDetailData(this.appProperties.findMachineHistoryUrl,
      {
        ptCode: ptCode
      }).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          console.log(data.returnObject);
          this.doorNO = data.returnObject.doorNO;
          this.num = data.returnObject.num;
          this.openedTime = data.returnObject.openedTime;
          this.closedTime = data.returnObject.closedTime;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  // 关闭详情
  closeDetail() {
    this.detailVisible = false;
  }
  // 获取token
  getCookies () {
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      const strCookie = document.cookie;
      const arrCookie = strCookie.split(';');
      for (let i = 0; i < arrCookie.length; i++) {
        const arr = arrCookie[i].split('=');
        if (arr[0].trim() === 'token') {
          this.token = arr[1];
        }
      }
    }
  }
  toDate(date) {
    return new Date(date.substring(0, 10)).getFullYear() + '-' + (new Date(date.substring(0, 10)).getMonth() + 1) + '-' + new Date(date.substring(0, 10)).getDate();
  }
}
