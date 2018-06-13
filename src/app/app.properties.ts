import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class AppProperties {
    // public
    public appUrl: string;
    public isClosedUrl: string;
    public adminLoginUrl: string;
    public adminOauth2Url: string;
    public addOpendoorUrl: string;
    public orderResetWaysNumUrl: string;
    public aliMachineQueryVMListUrl: string;
    public aliMachineQueryDetailUrl: string;
    public aliMachineQueryTradeDetailUrl: string;
    public reviseUrl: string;
    // WeChat
    public indexListUrl: string;
    public indexOpenDoor: string;
    public wechatOauth2Url: string;
    public smsSendUrl: string;
    public followWechatSubscription: string;
    public wechatRegisterUrl: string;
    public findAllUserOrderUrl: string;
    public orderUnifiedOrderUrl: string;
    public nonePassWordPayUrl: string;
    public findMachineHistoryUrl: string;
    // AliPay
    public aliIndexListUrl: string;
    public aliGetUserIdUrl: string;
    public aliVmGetUserIdUrl: string;
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

    constructor() {
      // Public
      this.appUrl = 'http://47.106.92.82:6662/ys_sms'; // localtest
      // this.appUrl = 'http://youshuismallhe.natapp1.cc'; // localtest
      this.isClosedUrl = this.appUrl + '/wechat/isClosed';
      this.adminLoginUrl = this.appUrl + '/admin/login';
      this.addOpendoorUrl = this.appUrl + '/index/yunWeiOpenDoor';
      this.orderResetWaysNumUrl = this.appUrl + '/order/resetWaysNum/';
      this.aliMachineQueryVMListUrl = this.appUrl + '/aliMachine/queryVMList';
      this.aliMachineQueryDetailUrl = this.appUrl + '/aliMachine/queryDetail';
      this.aliMachineQueryTradeDetailUrl = this.appUrl + '/aliMachine/queryTradeDetail';
      this.adminOauth2Url = this.appUrl + '/admin/oauth2';
      this.reviseUrl = this.appUrl + '/index/revise';

      // WeChat
      this.indexListUrl = this.appUrl + '/index/listWay';
      this.indexOpenDoor = this.appUrl + '/index/openDoor';
      this.wechatOauth2Url = this.appUrl + '/wechat/oauth2';
      this.smsSendUrl = this.appUrl + '/sms/send';
      this.wechatRegisterUrl = this.appUrl + '/wechat/register';
      this.followWechatSubscription = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzQ4MTY0Mg==&scene=124#wechat_redirect';
      this.findAllUserOrderUrl = this.appUrl + '/order/myOrderList';
      this.orderUnifiedOrderUrl = this.appUrl + '/order/unifiedOrder';
      this.nonePassWordPayUrl = this.appUrl + '/wechat/entrustweb';
      this.findMachineHistoryUrl = 'http://47.106.92.82:6662/ys_admin/payRecord/findMachineHistory';

      // AliPay
      this.aliIndexListUrl = this.appUrl + '/aliUser/queryItem';
      this.aliGetUserIdUrl = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm' +
        '?app_id=2017120900470709&scope=auth_user&redirect_uri=http://yms.youshuidaojia.com/aliUser/';
      this.aliVmGetUserIdUrl = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm' +
        '?app_id=2017120900470709&scope=auth_user&redirect_uri=http://yms.youshuidaojia.com/aliUser/getAliInfo';
      this.aliOpenDoorUrl = this.appUrl + '/aliBusiness/weightOpenDoor';
      this.aliRegisterUrl = this.appUrl + '/aliBusiness/register';
      this.aliSmsSendUrl = this.appUrl + '/alisms/send';
      this.aliFindAllUserOrderUrl = this.appUrl + '/aliBusiness/findAllUserOrder';
      this.aliFindPayOrderUrl = this.appUrl + '/aliBusiness/findPayOrder';
      this.aliFindNotPayOrderUrl = this.appUrl + '/aliBusiness/findNotPayOrder';
      this.alipayWapPayUrl = this.appUrl + '/alipay/wapPay?payRecordId=';
      this.aliGetCreditWithheldUrl = this.appUrl + '/aliUser/getCreditWithheld?vmCode=';
      this.aliLoginVerifyOperateUrl = this.appUrl + '/aliLogin/verifyOperate';
      this.aliBusinessIsAttentionUrl = this.appUrl + '/aliBusiness/isAttention';

    }
}
