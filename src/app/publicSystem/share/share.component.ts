import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

declare const WeixinJSBridge: any;
declare const wx: any;

import * as $ from 'jquery';
@Component({
  selector: 'app-Share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  private token: string;
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }
  ngOnInit() {
    this.token = 'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJ4bzY0eWIiLCJzdWIiOiJ7XCJpZFwiOlwiNzA5MFwiLFwib3BlbklkXCI6XCJvS2taeTA0eVlLODF4VGp6a3NOMW9KTHppZU4wXCIsXCJwYXlUeXBlXCI6XCIxXCIsXCJ0eXBlXCI6MX0iLCJleHAiOjE1Mzk1NzAzODAsImlhdCI6MTUzODk2NTU4MH0.u7pobc7sbOpaAyIEI0Sm9F19KaHhezFSsIx_dywSPKjeXtBLnEztnEPiRwCCc8ztqYqYbJ5ci0QmwhTCsI8TDg';
    this.share();
  }

  share() {
    this.appService.postAliData(this.appProperties.wechatShareInfoUrl + '?url=' + window.location.href,
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
            link: window.location.href,
            imgUrl: 'http://119.23.233.123:6662/ys_admin/companyLogo/20181008_142714.png',
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

  close() {
    WeixinJSBridge.call('closeWindow');
  }
}
