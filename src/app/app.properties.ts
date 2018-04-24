import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class AppProperties {
    public appUrl: string;
    public indexListUrl: string;
    public indexOpenDoor: string;
    public wechatOauth2Url: string;
    public smsSend: string;

    constructor() {
        // this.appUrl = 'http://192.168.0.110:8092';
      this.appUrl = 'http://127.0.0.1:8099'; // localtest
      this.indexListUrl = this.appUrl + '/index/listWay';
      this.indexOpenDoor = this.appUrl + '/index/openDoor';
      this.wechatOauth2Url = this.appUrl + '/wechat/oauth2';
      this.smsSend = this.appUrl + '/sms/send';
    }
}
