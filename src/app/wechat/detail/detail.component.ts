import {Component, AfterViewChecked, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
declare var wx: any;
declare var WeixinJSBridge: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit , AfterViewChecked {
  public queryParamsTitle: string;
  public queryParamsToken: string;
  public title: string;
  public totalPrice = 0;
  public list;
  public list1;
  public list2;
  public unList;
  public token;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appProperties: AppProperties,
  private appService: AppService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParamsTitle = queryParams.title;
      this.queryParamsToken = queryParams.token;
      if (this.queryParamsTitle === '1') {
        this.title = '我的订单';
      } else if (this.queryParamsTitle === '2') {
        this.title = '已付款订单';
      } else if (this.queryParamsTitle === '3') {
        this.title = '未付款订单';
      }
    });
    this.list = [];
    this.unList = [];
  }

  ngOnInit() {
    this.getCookies();
    if (this.title === '我的订单') {
      this.getData(this.appProperties.findAllUserOrderUrl, '我的订单');
    } else if (this.title === '已付款订单') {
      this.getData(this.appProperties.findAllUserOrderUrl, '已付款订单');
    } else if (this.title === '未付款订单') {
      this.getData(this.appProperties.findAllUserOrderUrl, '未付款订单');
    }
  }
  getData(url, title) {
    this.appService.getDataOpen(url, {}, this.token).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          if (title === '我的订单') {
            data.returnObject.forEach((item => {
                  this.totalPrice += item.price;
                  this.totalPrice = Math.floor(this.totalPrice * 100) / 100;
                  this.list.push(item);
              }));
          } else if (title === '已付款订单') {
            data.returnObject.forEach((item => {
              if (item.state !== '10002') {
              this.totalPrice += item.price;
              this.totalPrice = Math.floor(this.totalPrice * 100) / 100;
              this.list.push(item);
            }}));
          } else if (title === '未付款订单') {
            data.returnObject.forEach((item => {
              if (item.state === '10002') {
                this.totalPrice += item.price;
                this.totalPrice = Math.floor(this.totalPrice * 100) / 100;
                this.list.push(item);
              }}));
          }
        } else if (data.status !== 1) {
          alert(data.message);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
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
  pay(item) {
    this.appService.getDataOpen(this.appProperties.orderUnifiedOrderUrl, {orderId: item.id}, this.token).subscribe(
      data => {
        console.log(data);
        if (typeof(WeixinJSBridge) === 'undefined') {
          this.onBridgeUndefindeReady(data);
        } else {
          this.onBridgeReady(data);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  onBridgeUndefindeReady(data) {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', () => {
        this.test(data);
      }, false);
    } else if (document['attachEvent']) {
      document['attachEvent']('WeixinJSBridgeReady', () => {
        this.test(data);
      });
      document['attachEvent']('onWeixinJSBridgeReady', () => {
        this.test(data);
      });
    }
  }
  onBridgeReady(data) {
   this.test(data);
  }
  weixinJSBridge(data) {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId: data.appId,
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.prepayId,
        signType: 'MD5',
        paySign: data.sign
      },
      function(res) {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          alert('支付成功');
          window.location.reload();
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
          alert('取消支付');
          window.location.reload();
        }
      }
    );
  }
  test(data) {
    wx.config({
      debug: false,
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.prepayId,
      signature: data.sign,
      jsApiList: ['chooseWXPay']
    });
  }
  getCookies() {
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
