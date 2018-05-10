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
  public totalPrice: string;
  public list;
  public unList;
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
    if (this.title === '我的订单') {
      this.appService.getDataOpen(this.appProperties.findAllUserOrderUrl, {}, this.queryParamsToken).subscribe(
        data => {
          console.log(data);
          if (data.status === 1) {
            this.list = data.returnObject;
            this.list.forEach((item => {
              this.totalPrice += Number.parseInt(item.price);
              console.log(Number.parseInt(item.price));
            }));
          } else if (data.status !== 1) {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else if (this.title === '已付款订单') {
      this.appService.getDataOpen(this.appProperties.findAllUserOrderUrl, {}, this.queryParamsToken).subscribe(
        data => {
          console.log(data);
          if (data.status === 1) {
            data.returnObject.forEach((item => {
              this.totalPrice += Number.parseInt(item.price);
              if (item.state !== '10002') {
                this.list.push(item);
              }
            }));
          } else if (data.status !== 1) {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else if (this.title === '未付款订单') {
      this.appService.getDataOpen(this.appProperties.findAllUserOrderUrl, {}, this.queryParamsToken).subscribe(
        data => {
          console.log(data);
          if (data.status === 1) {
            data.returnObject.forEach((item => {
              this.totalPrice += Number.parseInt(item.price);
              if (item.state === '10002') {
                this.list.push(item);
              }
            }));
          } else if (data.status !== 1) {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
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
    this.appService.getDataOpen(this.appProperties.orderUnifiedOrderUrl, {orderId: item.id}, this.queryParamsToken).subscribe(
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
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            appId: data.appId,
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.prepayId,
            signType: 'MD5',
            paySign: data.sign
          }, function(res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              alert('支付成功');
              window.location.reload();
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              alert('取消支付');
              window.location.reload();
            }
          }
        );
      }, false);
    } else if (document['attachEvent']) {
      document['attachEvent']('WeixinJSBridgeReady', () => {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            appId: data.appId,
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.prepayId,
            signType: 'MD5',
            paySign: data.sign
          }, function(res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              alert('支付成功');
              window.location.reload();
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              alert('取消支付');
              window.location.reload();
            }
          }
        );
      });
      document['attachEvent']('onWeixinJSBridgeReady', () => {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            appId: data.appId,
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.prepayId,
            signType: 'MD5',
            paySign: data.sign
          }, function(res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              alert('支付成功');
              window.location.reload();
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              alert('取消支付');
              window.location.reload();
            }
          }
        );
      });
    }
  }
  onBridgeReady(data) {
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
}
