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
    public followWechatSubscription: string;
    public wechatRegisterUrl: string;
    public findAllUserOrderUrl: string;
    public orderUnifiedOrderUrl: string;
    public nonePassWordPayUrl: string;
    // AliPay
    public aliAppUrl: string;
    public aliIndexListUrl: string;
    public aliGetUserIdUrl: string;
    public aliOpenDoorUrl: string;
    public aliGetCreditWithheldUrl: string;
    public aliRegisterUrl: string;
    public aliSmsSendUrl: string;
    public aliFindAllUserOrderUrl: string;
    public aliFindPayOrderUrl: string;
    public aliFindNotPayOrderUrl: string;
    public alipayWapPayUrl: string;
    public aliLoginVerifyOperateUrl: string;
    public aliBusinessIsAttentionUrl: string;
    // public
    public isClosedUrl: string;
    public adminLoginUrl: string;
    public addOpendoorUrl: string;
    public orderResetWaysNumUrl: string;

    constructor() {
      // WeChat
      // this.appUrl = 'http://192.168.0.110:8092';
      // this.appUrl = 'http://112.74.173.67';
      this.appUrl = 'http://youshuicmp.natapp1.cc'; // localtest
      // this.appUrl = 'http://127.0.0.1:8099'; // localtest
      this.indexListUrl = this.appUrl + '/index/listWay';
      this.indexOpenDoor = this.appUrl + '/index/openDoor';
      this.wechatOauth2Url = this.appUrl + '/wechat/oauth2';
      this.smsSendUrl = this.appUrl + '/sms/send';
      this.wechatRegisterUrl = this.appUrl + '/wechat/register';
      this.followWechatSubscription = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzQ4MTY0Mg==&scene=124#wechat_redirect';
      this.findAllUserOrderUrl = this.appUrl + '/order/myOrderList';
      this.orderUnifiedOrderUrl = this.appUrl + '/order/unifiedOrder';
      this.nonePassWordPayUrl = this.appUrl + '/wechat/entrustweb';

      // AliPay
      this.aliAppUrl = 'http://youshuismallhe.natapp1.cc'; // localtest
      this.aliIndexListUrl = this.aliAppUrl + '/aliUser/queryItem';
      this.aliGetUserIdUrl = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm' +
        '?app_id=2017120900470709&scope=auth_user&redirect_uri=' + this.aliAppUrl + '/aliUser/';
      this.aliOpenDoorUrl = this.aliAppUrl + '/aliBusiness/weightOpenDoor';
      this.aliRegisterUrl = this.aliAppUrl + '/aliBusiness/register';
      this.aliSmsSendUrl = this.aliAppUrl + '/alisms/send';
      this.aliFindAllUserOrderUrl = this.aliAppUrl + '/aliBusiness/findAllUserOrder';
      this.aliFindPayOrderUrl = this.aliAppUrl + '/aliBusiness/findPayOrder';
      this.aliFindNotPayOrderUrl = this.aliAppUrl + '/aliBusiness/findNotPayOrder';
      this.alipayWapPayUrl = this.aliAppUrl + '/alipay/wapPay?payRecordId=';
      this.aliGetCreditWithheldUrl = this.aliAppUrl + '/aliUser/getCreditWithheld?vmCode=';
      this.aliLoginVerifyOperateUrl = this.aliAppUrl + '/aliLogin/verifyOperate';
      this.aliBusinessIsAttentionUrl = this.aliAppUrl + '/aliBusiness/isAttention';

      // public
      this.isClosedUrl = this.appUrl + '/wechat/isClosed';
      this.adminLoginUrl = this.appUrl + '/admin/login';
      this.addOpendoorUrl = this.appUrl + '/index/yunWeiOpenDoor';
      this.orderResetWaysNumUrl = this.appUrl + '/order/resetWaysNum/';
    }
}
