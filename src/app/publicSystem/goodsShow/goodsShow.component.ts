import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {getActiveCompanyId, getZhuHaiCompanyId, urlParse} from '../../utils/util';
import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';

declare var WeixinJSBridge: any;
declare var wx: any;

@Component({
  selector: 'app-detail',
  templateUrl: './goodsShow.component.html',
  styleUrls: ['./goodsShow.component.css']
})
export class GoodsShowComponent implements OnInit {
  public more: boolean;
  public single: boolean;
  public close: boolean;
  public isVisibleOpen: boolean;
  public isVisibleFixed: boolean;
  public isVisibleWarn: boolean;
  public token: string;
  public wayNum: string;
  public basicItemId: string;
  public index: string;
  public num: number;
  public goodsList = [];
  public totalPrice = 0;
  public count = 0;
  private timeInterval;
  public flag;
  public img = this.appProperties.imgUrl;
  public grouponImg = this.appProperties.grouponImgUrl;
  public replenishList = [];
  public aliPay = false;
  public youshuiCompany = false;
  public zhuHaiCompany = false;
  public visible = false;
  public placement = 'left';
  public wechatVisible;
  public getpriceVisible = false;

  public couponName;
  public carryWaterCouponName;
  public orderId;
  public price: number;
  public priceTwo: number;
  public couponId: string;
  public type: string;
  public isFollow: number;
  public checkOrderText = '订单正在支付...';
  public sumDeductionMoney: number;
  public couponList;
  public waterVoucherList = [];
  public payType;
  public grouponList;
  public grouponShow;
  public showPrize;
  public prizeMessage;
  public sm;
  public companyId;
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    this.sm = urlParse(window.location.search)['sm'];
    console.log(this.sm)
    this.wechatVisible = false;
    this.couponList = [];
    this.waterVoucherList = [];
    this.flag = sessionStorage.getItem('flag');
    this.getToken();
    this.getInit();
    this.share();
    this.goodsList = [];
    this.appService.postData(this.appProperties.machineInfoGetCompanyIdUrl + urlParse(window.location.search)['vmCode'], '').subscribe(
      data2 => {
        console.log(data2);
        this.companyId = data2.returnObject.toString();
        if (getActiveCompanyId().includes(data2.returnObject.toString())) {
          this.youshuiCompany = true;
          this.zhuHaiCompany = false;
        } else if (getZhuHaiCompanyId().includes(data2.returnObject.toString())) {
          this.youshuiCompany = false;
          this.zhuHaiCompany = true;
        } else {
          this.youshuiCompany = false;
          this.zhuHaiCompany = false;
        }
      },
      error2 => {
        console.log(error2);
      });
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/AlipayClient/i)) {
      if (ua.match(/AlipayClient/i)[0] === 'alipayclient') {
        this.aliPay = true;
      }
    } else {
      this.aliPay = false;
    }
    document.getElementsByClassName('ant-modal-body')[0]['style'].cssText = 'padding: 0;';
    this.isVisibleOpen = false;
    this.isVisibleFixed = false;
    this.oneGoodsOrMore();
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 数据初始化
   */
  getInit() {
    this.appService.postFormData(this.appProperties.payFinishGrouponUrl, '', this.token).subscribe(
      data => {
        this.grouponList = data.returnObject;
        console.log(this.grouponList.length > 0);
        if (this.grouponList.length > 0) {
          this.grouponShow = true;
        } else {
          this.grouponShow = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 文字转换
   */
  turnText(item) {
    let text;
    if (item.changeNum < 0) {
      text = item.changeNewNum === undefined ? `拿取数量${-item.changeNum}` : `拿取数量${-item.changeNum},修正后数量${item.changeNewNum}`;
    } else if (item.changeNum > 0 && (this.flag === '3' || this.flag === '4')) {
      text = item.changeNewNum === undefined ? `补货数量${item.changeNum}` : `补货数量${item.changeNum},修正后数量${item.changeNewNum}`;
    }
    return text;
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 关注公众号
   */
  follow() {
    window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzQ4MTY0Mg==&scene=124#wechat_redirect';
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 分享连接
   */
  share() {
    this.appService.postAliData(this.appProperties.wechatShareInfoUrl
      + '?url=http://sms.youshuidaojia.com/goodsShow?vmCode=' + urlParse(window.location.href)['vmCode'],
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
        const link = 'http://sms.youshuidaojia.com/share?token=' + this.token;
        console.log(link);
        wx.ready(function () {
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
            link: link,
            imgUrl: 'http://119.23.233.123:6662/ys_admin/companyLogo/20181008_142714.png',
            // imgUrl: '../../../assets/main/logo.png',
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

  fixedNum(item, index) {
    this.isVisibleFixed = true;
    this.wayNum = item.wayNum;
    this.basicItemId = item.basicItemId;
    this.index = index;
  }

  yes() {
    this.isVisibleWarn = false;
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 补货人员修改补货数据
   */
  fixedYes() {
    this.appService.postAliData(this.appProperties.machineControlAdjustReplenish +
      `vmCode=${urlParse(window.location.search)['vmCode']}&wayNum=${this.wayNum}&basicItemId=${this.basicItemId}&adjustNum=${this.num}`,
      '', this.token).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          this.replenishList[this.index].changeNewNum = this.num;
          alert('修改成功');
        } else {
          alert(data.msg);
        }
        this.isVisibleFixed = false;
      },
      error2 => {
        console.log(error2);
      }
    );
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 返回首页，判断微信or支付宝
   */
  exit() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i)) {
      if (ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
        if (this.flag === 3 || this.flag === '3'
          || this.flag === 4 || this.flag === '4') {
          this.router.navigate(['addMain'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              token: sessionStorage.getItem('token'),
              payType: 1
            }
          });
        } else {
          WeixinJSBridge.call('closeWindow');
          // if (urlParse(window.location.search)['sm'] === '1') {
          //   this.router.navigate(['smain'], {
          //     queryParams: {
          //       vmCode: urlParse(window.location.search)['vmCode'],
          //       token: sessionStorage.getItem('token'),
          //       close: '1'
          //     }
          //   });
          // } else {
          //   this.router.navigate(['main'], {
          //     queryParams: {
          //       vmCode: urlParse(window.location.search)['vmCode'],
          //       token: sessionStorage.getItem('token'),
          //       close: '1'
          //     }
          //   });
          // }
        }
      }
    } else if (ua.match(/AlipayClient/i)) {
      if (ua.match(/AlipayClient/i)[0] === 'alipayclient') {
        if (this.flag === 3 || this.flag === '3'
          || this.flag === 4 || this.flag === '4') {
          this.router.navigate(['addMain'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              token: sessionStorage.getItem('token'),
              payType: 2
            }
          });
        } else {
          window['AlipayJSBridge'].call('closeWebview');
          // if (urlParse(window.location.search)['sm'] === '1') {
          //   this.router.navigate(['aliSMain'], {
          //     queryParams: {
          //       vmCode: urlParse(window.location.search)['vmCode'],
          //       token: sessionStorage.getItem('token'),
          //       close: '1'
          //     }
          //   });
          // } else {
          //   this.router.navigate(['aliMain'], {
          //     queryParams: {
          //       vmCode: urlParse(window.location.search)['vmCode'],
          //       token: sessionStorage.getItem('token'),
          //       close: '1'
          //     }
          //   });
          // }
        }
      }
    }
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 获取机器数据
   */
  getData() {
    this.appService.getAliData(this.appProperties.machineControlUrl,
      {vmCode: urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data => {
        console.log(data);
        if (data.data.itemList !== '') {
          this.goodsList = data.data.itemList;
        }
        console.log(this.goodsList);
        this.totalPrice = data.data.totalPrice;
        this.isClosed();
      },
      error2 => {
        console.log(error2);
      }
    );
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 检测是否关门
   */
  isClosed() {
    this.appService.getDataOpen(this.appProperties.isClosedUrl,
      {vmCode: urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data2 => {
        this.count++;
        if (this.count === 10) {
          document.getElementsByClassName('ant-modal-body')[0]['style'].cssText = 'padding: 0;';
          this.isVisibleOpen = true;
          clearInterval(this.timeInterval);
        }
        console.log(data2);
        if (data2.data === false) {
          // alert('您的门还未关闭！优水到家提醒您,为了您账号资金安全,提水后请随手关门');
          if (this.flag === 1 || this.flag === '1'
            || this.flag === 4 || this.flag === '4') {
            this.more = true;
            this.close = true;
            this.single = false;
          } else {
            this.more = false;
            this.close = true;
            this.single = true;
          }
        } else if (data2.data === true) {
          this.isPrize();
          this.isVisibleOpen = false;
          this.close = false;
          this.more = true;
          this.single = true;
          clearInterval(this.timeInterval);
          this.appService.getAliData(this.appProperties.machineControlGetReplenishInfoUrl + urlParse(window.location.search)['vmCode'], '',
            this.token).subscribe(
            data3 => {
              console.log(data3);
              if (data3.data === '') {
                this.replenishList = [];
              } else {
                this.replenishList = data3.data;
              }
              if (this.flag === 3 || this.flag === '3' || this.flag === 4 || this.flag === '4') {
                this.isVisibleWarn = true;
              }
            },
            error3 => {
              console.log(error3);
            }
          );
          // alert('广州优水到家工程感谢你的惠顾,系统将从零钱或者银行卡中自动扣取本次购买费用。');
          // 支付完成后拿到要显示的数据
          this.checkEndData();
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 支付完成后拿到要显示的数据
   */
  checkEndData() {
    let time;
    this.appService.getAliData(this.appProperties.storeOrderFininshPayUrl, {vmCode: urlParse(window.location.search)['vmCode']},
      this.token).subscribe(
      data4 => {
        console.log(data4);
        if (data4 !== null) {
          clearTimeout(time);
          this.payType = data4.payType;
          this.couponName = data4.couponName;
          this.carryWaterCouponName = data4.carryWaterCouponName;
          this.orderId = data4.orderId;
          this.price = parseFloat(data4.price);
          this.priceTwo = parseFloat(data4.memberMoney);
          this.couponId = data4.couponId;
          this.type = data4.type;
          this.isFollow = data4.follow;
          this.sumDeductionMoney = parseFloat(data4.sumDeductionMoney);
          // this.companyId === '171' ? this.wechatVisible = false : this.wechatVisible = true;
          if (this.wechatVisible) {
            setTimeout(() => {
              this.wechatVisible = false;
            }, 5000);
          }
          if (data4.payState === '0') {
            alert('订单异常请点击查看订单或咨询客服');
          }
          setTimeout(() => {
            this.checkOrderText = '点击查看订单';
          }, 3000);
        } else {
          time = setTimeout(() => {
            this.checkEndData();
          }, 1000);
        }
      },
      error4 => {
        console.log(error4);
      }
    );
  }

  openOk() {
    this.isVisibleOpen = false;
    this.count = 0;
    this.oneGoodsOrMore();
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 判断单商品还是多商品机器
   */
  oneGoodsOrMore() {
    const _this = this;
    if (this.flag === 1 || this.flag === '1'
      || this.flag === 4 || this.flag === '4') {
      this.timeInterval = setInterval(() => {
        _this.isClosed();
      }, 800);
      this.more = true;
      this.close = true;
      this.single = false;
    } else {
      this.timeInterval = setInterval(() => {
        _this.getData();
        // _this.isClosed();
      }, 800);
      this.more = false;
      this.close = true;
      this.single = true;
    }
  }

  /**
   * 2019-04-04
   * @author YanChao
   * 获取token
   */
  getToken() {
    let token;
    if (this.flag === 1 || this.flag === '1'
      || this.flag === 2 || this.flag === '2') {
      token = 'token';
    } else {
      token = 'adminToken';
    }
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      const strCookie = document.cookie;
      const arrCookie = strCookie.split(';');
      for (let i = 0; i < arrCookie.length; i++) {
        const arr = arrCookie[i].split('=');
        if (arr[0].trim() === token) {
          this.token = arr[1];
        }
      }
    }
  }

  /**
   * 2019-02-16
   * @author YanChao
   * // 查看优惠券
   */
  openDrawer() {

    const model = document.getElementById('myModel');
    const closed = document.getElementById('closed');
    model.style.display = 'block';
    document.body.style.overflow = 'hidden';
    window.addEventListener('click', function (event) {
      if (event.target === closed || event.target === model) {
        model.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });

    /**
     * 2019-02-16
     * @author YanChao
     * 判断是使用优惠券还是提水券type为1是优惠券，type=2为提水券
     * 使用优惠券
     */
    if (this.type === '1') {
      this.appService.postAliData(this.appProperties.useCouponUrl, this.couponId, this.token).subscribe(
        data => {
          if (data) {
            this.couponList = data.returnObject;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
    /**
     * 2019-02-16
     * @author YanChao
     * 使用提水券
     */
    if (this.type === '2') {
      this.appService.postAliData(this.appProperties.useWaterVouchersUrl, {orderId: this.orderId}, this.token).subscribe(
        data => {
          this.waterVoucherList = data.returnObject;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  sureModel() {
    const model = document.getElementById('myModel');
    model.style.display = 'none';
  }

  openShowModel() {
    // this.wechatVisible = true;
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 取消弹框
   */
  showCancel() {
    this.wechatVisible = false;
    this.getpriceVisible = false;
  }
  s() {
    window.location.href = `http://webapp.youshuidaojia.com:8080/cMain/prepaid`;
  }
  /**
   * 2019-02-16
   * @author YanChao
   * 跳转去订单详情支付
   */
  seeOrder() {
    window.location.href = `http://sms.youshuidaojia.com:9800/orderDetails?token=${this.token}&payType=1&vmCode=${urlParse(window.location.search)['vmCode']}`;
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 跳转去订单详情
   */
  goTo(id, pic, spellgroupId) {
    window.location.href = `http://webapp.youshuidaojia.com/cMain/detail?id=${id}&spellgroupId=${spellgroupId}&pic=${pic}&type=1`;
  }

  showMore() {
    window.location.href = 'http://webapp.youshuidaojia.com/cMain/recommendB?itemType=0';
  }

  /**
   * 2019-03-06
   * @author mzy
   * 判断是否显示抽奖按钮
   */
  isPrize() {
    this.appService.postAliData(this.appProperties.judgeGame + '?vmCode=' + urlParse(window.location.search)['vmCode'], '', this.token).subscribe(
      data => {
        console.log(data);
        if (toNumber(data.status) === 0) {
          this.showPrize = false;
          this.getpriceVisible = false;
        } else if (toNumber(data.status) === 82) {
          this.showPrize = true;
          this.getpriceVisible = false;
          // this.getpriceVisible = true;
          this.prizeMessage = data.message;
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }

  /**
   * 2019-03-06
   * @author mzy
   * 跳转到抽奖页面
   */
  toPrize() {
    if (this.flag === 1 || this.flag === '1'
      || this.flag === 2 || this.flag === '2') {
      clearInterval(this.timeInterval);
      this.router.navigate(['rotate'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode'],
          token: this.token,
          flag: this.flag
        }
      });
    }
  }
}
