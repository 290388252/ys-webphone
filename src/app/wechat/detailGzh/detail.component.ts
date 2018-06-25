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
  public totalPrice = 0;
  public list;
  public token;
  public openId;
  public detailVisible = false;
  public detailList;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appProperties: AppProperties,
  private appService: AppService) {
    this.list = [];
  }

  ngOnInit() {
    this.getCookies();
    this.openId = urlParse(window.location.search)['openId'];
    console.log(this.openId);
    this.getData(this.appProperties.findAllOpenIdOrderUrl  + this.openId);
  }
  // 获取订单列表
  getData(url) {
    this.appService.getDataGzh(url, '').subscribe(
      data => {
        console.log(data);
        // if (data.status === 1) {
            data.forEach((item => {
                  this.totalPrice += item.price;
                  this.totalPrice = Math.floor(this.totalPrice * 100) / 100;
                  this.list.push(item);
              }));
        // } else if (data.status !== 1) {
        //   alert(data.message);
        // }
      },
      error => {
        console.log(error);
      }
    );
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
        orderId: item.id
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
          this.detailList = data.returnObject;
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
}