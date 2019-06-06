import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

declare const WeixinJSBridge: any;
declare const gbTurntable: any;

import * as $ from 'jquery';
@Component({
  selector: 'app-NotPage',
  templateUrl: './notPage.component.html',
  styleUrls: ['./notPage.component.css']
})
export class NotPageComponent implements OnInit {
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }
  ngOnInit() {}

  /**
   * 2019-02-16
   * @author YanChao
   * 判断是微信登陆还是支付宝登陆
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

  close() {
    // WeixinJSBridge.call('closeWindow');
    window['AlipayJSBridge'].call('closeWebview');
  }
}
