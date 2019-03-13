import {Injectable} from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class AppProperties {
  // public
  public appUrl: string;
  public adminUrl: string;
  public imgUrl: string;
  public grouponImgUrl: string;
  public vmAdvertisingImg: string;
  public isClosedUrl: string;
  public adminOauth2Url: string;
  public gameGetGamePrize: string;
  public gameLottery: string;
  public machineControlUrl: string;
  public payFinishGrouponUrl: string;
  public machineControlGetReplenishInfoUrl: string;
  public machineInfoGetCompanyIdUrl: string;
  public adminCreateForeverStrQrUrl: string;
  public machineControlAdjustReplenish: string;
  public tblCustomerMyInviteRewards: string;
  public vdAdvertisingMachinesShowAdvertisingUrl: string;
  public vdAdvertisingMachinesFindShowAdvertisingUrl: string;
  public addressUrl: string;
  public choiceAddressUrl: string;
  public shopAddressUpdateUrl: string;
  public shopAddressCheckUrl: string;
  public shopAddressAddUrl: string;
  // WeChat
  public tblCustomerMyInfo: string;
  public indexListUrl: string;
  public cusOpenIsOpened: string;
  public indexOpenDoor: string;
  public wechatOauth2Url: string;
  public smsSendUrl: string;
  public followWechatSubscription: string;
  public wechatRegisterUrl: string;
  public findAllUserOrderUrl: string;
  public findAllOpenIdOrderUrl: string;
  public orderUnifiedOrderUrl: string;
  public nonePassWordPayUrl: string;
  public findMachineHistoryUrl: string;
  public wechatShareInfoUrl: string;
  public couponAvailable: string;
  public applyRefundUrl: string;
  public IfApplayRefundUrl: string;
  public openBeforeCanDo: string;
  public closedBeforePrecomputation: string;
  public wechatLoginCheckSend: string;
  public wechatCheckSend: string;
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

  public storeOrderFininshPayUrl: string;
  public useCouponUrl: string;
  public useWaterVouchersUrl: string;

  constructor() {
    // Public
    // this.appUrl = 'http://192.168.0.119:8769/ys_sms';
    // this.adminUrl = 'http://192.168.0.105:6662/ys_admin';
    this.appUrl = 'http://47.106.92.82:6662/ys_sms';
    this.adminUrl = 'http://119.23.233.123:6662/ys_admin';
    this.vmAdvertisingImg = this.adminUrl + '/vmAdvertisingImg/';
    this.imgUrl = this.adminUrl + '/files/';
    this.grouponImgUrl = this.adminUrl + '/shoppingGoodsImg/';
    this.isClosedUrl = this.appUrl + '/wechat/isClosed';
    this.adminOauth2Url = this.appUrl + '/admin/oauth2';
    this.gameGetGamePrize = this.appUrl + '/game/getAvailableGame';
    this.gameLottery = this.appUrl + '/game/lottery';
    this.machineControlUrl = this.appUrl + '/machineControl/getChangeInfo';
    this.payFinishGrouponUrl = this.appUrl + '/shoppingGoods/listPage';
    this.machineControlGetReplenishInfoUrl = this.appUrl + '/machineControl/getReplenishInfo?vmCode=';
    this.machineInfoGetCompanyIdUrl = this.appUrl + '/machineInfo/getCompanyId?vmCode=';
    this.adminCreateForeverStrQrUrl = this.appUrl + '/admin/createStrQr';
    this.machineControlAdjustReplenish = this.appUrl + '/machineControl/adjustReplenish?';
    this.tblCustomerMyInviteRewards  = this.appUrl + '/tblCustomer/myInviteRewards';
    this.vdAdvertisingMachinesShowAdvertisingUrl  = this.adminUrl + '/vendingMachinesAdvertising/showMachinesAdvertising';
    this.vdAdvertisingMachinesFindShowAdvertisingUrl = this.adminUrl + '/vendingMachinesAdvertising/findVendingSlideshow';
    this.addressUrl = this.appUrl + '/address/select';
    this.choiceAddressUrl = this.appUrl +　'/game/updateAddress';
    this.shopAddressUpdateUrl = this.appUrl + '/address/update';
    this.shopAddressCheckUrl = this.appUrl + '/address/selectById';
    this.shopAddressAddUrl = this.appUrl + '/address/add';
    // WeChat
    this.tblCustomerMyInfo  = this.appUrl + '/tblCustomer/myInfo';
    this.indexListUrl = this.appUrl + '/index/listWay';
    this.cusOpenIsOpened = this.appUrl + '/cusOpen/isOpened';
    // this.indexOpenDoor = this.appUrl + '/index/openDoor'; // old
    this.indexOpenDoor = this.appUrl + '/cusOpen/do';
    this.wechatOauth2Url = this.appUrl + '/wechat/oauth2';
    this.smsSendUrl = this.appUrl + '/sms/send';
    this.wechatRegisterUrl = this.appUrl + '/wechat/register';
    this.followWechatSubscription = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzQ4MTY0Mg==&scene=124#wechat_redirect';
    // this.findAllUserOrderUrl = this.appUrl + '/order/myOrderList';
    this.findAllUserOrderUrl = this.appUrl + '/alipayRecord/getCustomerOrder';
    this.findAllOpenIdOrderUrl = this.adminUrl + '/order/findOrderByOpenId?openId=';
    this.orderUnifiedOrderUrl = this.appUrl + '/order/unifiedOrder';
    this.nonePassWordPayUrl = this.appUrl + '/wechat/entrustweb';
    this.findMachineHistoryUrl = this.adminUrl + '/payRecord/findMachineHistory';
    this.wechatShareInfoUrl = this.appUrl + '/wechat/shareInfo';
    this.couponAvailable = this.appUrl + '/coupon/available';
    this.applyRefundUrl = this.appUrl + '/refundApplication/do';
    this.IfApplayRefundUrl = this.appUrl + '/refundApplication/get';
    this.openBeforeCanDo = this.appUrl + '/openBefore/canDo?vmCode=';
    this.closedBeforePrecomputation = this.appUrl + '/closedBefore/precomputation';
    this.wechatLoginCheckSend = this.appUrl + '/wechat/loginCheckSend';
    this.wechatCheckSend = this.appUrl + '/wechat/checkSend';

    // AliPay
    this.aliIndexListUrl = this.appUrl + '/aliUser/queryItem';
    this.aliGetUserIdUrl = this.appUrl + '/aliUser/getAuthorizationUrl';
    this.aliVmGetUserIdUrl = this.appUrl + '/aliUser/getAiInfoUrl';
    this.aliOpenDoorUrl = this.appUrl + '/aliBusiness/weightOpenDoor';
    this.aliRegisterUrl = this.appUrl + '/aliBusiness/register';
    this.aliSmsSendUrl = this.appUrl + '/alisms/send';
    // this.aliFindAllUserOrderUrl = this.appUrl + '/aliBusiness/findAllUserOrder';
    this.aliFindAllUserOrderUrl = this.appUrl + '/alipayRecord/getCustomerOrder';
    this.aliFindPayOrderUrl = this.appUrl + '/aliBusiness/findPayOrder';
    this.aliFindNotPayOrderUrl = this.appUrl + '/aliBusiness/findNotPayOrder';
    this.alipayWapPayUrl = this.appUrl + '/alipay/wapPay?payRecordId=';
    this.aliGetCreditWithheldUrl = this.appUrl + '/aliUser/getCreditWithheld?vmCode=';
    this.aliLoginVerifyOperateUrl = this.appUrl + '/aliLogin/verifyOperate';
    this.aliBusinessIsAttentionUrl = this.appUrl + '/aliBusiness/isAttention';

    this.storeOrderFininshPayUrl = this.appUrl + '/order/storeOrderFininshPay';
    this.useCouponUrl = this.appUrl + '/coupon/usedCouponId';
    this.useWaterVouchersUrl = this.appUrl + '/carryWaterVouchers/listPage';
  }
}
