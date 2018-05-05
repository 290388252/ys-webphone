import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class AppProperties {
    // WeChat
    public appUrl: string;
    public indexListUrl: string;
    public indexOpenDoor: string;
    public wechatOauth2Url: string;
    public smsSendUrl: string;
    public wechatRegisterUrl: string;
    // AliPay
    public aliAppUrl: string;
    public aliIndexListUrl: string;

    constructor() {
      // WeChat
      // this.appUrl = 'http://192.168.0.110:8092';
      this.appUrl = 'http://youshui.natapp1.cc'; // localtest
      // this.appUrl = 'http://127.0.0.1:8099'; // localtest
      this.indexListUrl = this.appUrl + '/index/listWay';
      this.indexOpenDoor = this.appUrl + '/index/openDoor';
      this.wechatOauth2Url = this.appUrl + '/wechat/oauth2';
      this.smsSendUrl = this.appUrl + '/sms/send';
      this.wechatRegisterUrl = this.appUrl + '/wechat/register';

      // AliPay
      this.aliAppUrl = 'http://youshuismallhe.natapp1.cc'; // localtest
      this.aliIndexListUrl = this.aliAppUrl + '/aliUser/queryItem';
    }
}
