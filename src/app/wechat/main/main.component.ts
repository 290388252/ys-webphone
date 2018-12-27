import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NzModalService} from 'ng-zorro-antd';
import {getActiveCompanyId, getActiveItemId, getCoupon, getNewUser, urlParse} from '../../utils/util';
import {CarouselConfig} from 'ngx-bootstrap/carousel';

declare var wx: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [
    {provide: CarouselConfig, useValue: {interval: 1500, noPause: true, showIndicators: true}}
  ]
})
export class MainComponent implements OnInit {
  public indexList = [];
  public eightIndexList = [];
  public fiveIndexList = [];
  public eightDoorFlag = 0;
  private token: string;
  private wayNumber: number;
  public isVisibleOpenDoor = false;
  public isVisibleNoMoney = false;
  public isVisibleCoupon = false;
  public isVisibleCouponTwo = false;
  public isVisibleCouponThree = false;
  public couponButtonHidden = true;
  public clickMore = false;
  // public img = 'http://lenvar-resource-products.oss-cn-shenzhen.aliyuncs.com/';
  public activeImg = '';
  public showActiveImg = '';
  public img = this.appProperties.imgUrl;
  public item;
  currentModal;
  public isFourDoor = false;
  public isFiveDoor = false;
  public isEightDoor = false; // 八门
  public youshuiCompany = true;
  public otherCompany = true;
  public baoliCompany = false;
  public vmCode;
  public openDoorMsg = '点击‘是’开门，祝你购物愉快！';
  public openDoorMsgKey = '';
  public isConfirmLoading = false;
  public isScanImg = false;
  public advertiseMentShow = false;
  public advertiseMentPic = '';

  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    if (urlParse(window.location.search)['token'] === undefined) {
      this.getCookies();
    } else {
      this.token = urlParse(window.location.search)['token'];
      const exp = new Date();
      exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
      document.cookie = 'token=' + this.token + ';expires=' + exp.toUTCString();
      // window.localStorage.setItem('token', urlParse(window.location.search)['token']);
    }
    if (getCoupon() === '0') {
      this.isVisibleCoupon = true;
    } else if (getCoupon() === '2') {
      this.isVisibleCouponTwo = true;
    }
    // // 新用户进入界面
    if (getNewUser() === '1') {
      document.cookie = 'newUser=' + 0;
      this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl,
        {vmCode: urlParse(window.location.href)['vmCode']}).subscribe(
        data1 => {
          window.location.href = data1;
        },
        error1 => {
          console.log(error1);
        }
      );
    }
    this.vmCode = urlParse(window.location.search)['vmCode'];
    if (urlParse(window.location.search)['vmCode'] !== undefined) {
      this.isScanImg = false;
      this.getInitData();
    } else {
      this.youshuiCompany = false;
      this.otherCompany = false;
      this.baoliCompany = false;
      this.isScanImg = true;
    }
  }
  closeAdvertise() {this.advertiseMentShow = false; }
  // 数据初始化
  getInitData() {
    this.appService.postData(this.appProperties.machineInfoGetCompanyIdUrl + urlParse(window.location.search)['vmCode'], '').subscribe(
      data2 => {
        console.log(data2);
        if (getActiveCompanyId().includes(data2.returnObject.toString())) {
          this.youshuiCompany = false;
          this.otherCompany = true;
          this.baoliCompany = false;
          this.appService.getAliData(this.appProperties.wechatLoginCheckSend
            + '?openId=' + urlParse(window.location.search)['openId'], '').subscribe(
            data => {
              console.log(data);
              if (data.code === 3) {
                document.getElementsByClassName('ant-modal-body')[4]['style'].cssText = 'padding: 0;';
                this.isVisibleCouponThree = true;
              }
            },
            error => {
              console.log(error);
            });
        } else if (data2.returnObject === 104) {
          this.youshuiCompany = true;
          this.otherCompany = false;
          this.baoliCompany = true;
        } else {
          this.youshuiCompany = true;
          this.otherCompany = false;
          this.baoliCompany = false;
        }
      },
      error2 => {
        console.log(error2);
      });
    this.appService.getData(this.appProperties.indexListUrl, {vmCode: urlParse(window.location.search)['vmCode'], type: 1}).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          if (data.data.length <= 4) {
            this.isFourDoor = true;
            this.isFiveDoor = false;
            this.isEightDoor = false;
            this.indexList = data.data;
            for (let i = 0; i < 2; i++) {
              this.indexList.unshift(this.indexList.pop());
            }
          } else if (data.data.length === 5) {
            this.isFourDoor = false;
            this.isFiveDoor = true;
            this.isEightDoor = false;
            data.data.forEach((item, index) => {
              if (index > 1) {
                this.indexList.push(item);
              } else {
                this.fiveIndexList.push(item);
              }
            });
          } else if (data.data.length === 8) {
            this.isFourDoor = false;
            this.isFiveDoor = false;
            this.isEightDoor = true;
            this.indexList = data.data;
            this.eightIndexList = data.data.slice(0, 4);
          }
          console.log(this.indexList);
        }
      },
      error => {
        console.log(error);
      }
    );
    this.appService.postFormData(this.appProperties.vdAdvertisingMachinesShowAdvertisingUrl,
      {vmCode: urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data => {
        console.log(data);
        if (data.status === 1 && data.returnObject.length > 0) {
          this.advertiseMentShow = true;
          this.advertiseMentPic = this.appProperties.vmAdvertisingImg + data.returnObject[0].homeImg;
          setTimeout(() => {
            this.advertiseMentShow = false;
          }, 3000);
        }
      }, error => {
        console.log(error);
      }
    );
  }

  showActiveItem(item, baoliCompany) {
    let flag;
    const list = getActiveItemId();
    if (baoliCompany) {
      flag = true;
    } else {
      if (item.length > 1) {
        if (list.includes(item[0].basicItemId) || list.includes(item[1].basicItemId)) {
          if (item[0].basicItemId === '2194' || item[1].basicItemId === '2194') {
            this.showActiveImg = '../../../assets/main/send.png';
          } else if (item[0].basicItemId === '2975' || item[1].basicItemId === '2975') {
            this.showActiveImg = '../../../assets/main/send2.png';
          }
          flag = false;
        } else {
          flag = true;
        }
      } else {
        if (list.includes(item[0].basicItemId)) {
          if (item[0].basicItemId === '2194') {
            this.showActiveImg = '../../../assets/main/send.png';
          } else if (item[0].basicItemId === '2975') {
            this.showActiveImg = '../../../assets/main/send2.png';
          }
          flag = false;
        } else {
          flag = true;
        }
      }
    }
    return flag;
  }

  // 开门
  openDoor(item) {
    this.item = item;
    if (item.num <= 0) {
      alert('水已经卖完无法开门');
    } else {
        this.appService.postAliData(this.appProperties.openBeforeCanDo + urlParse(window.location.href)['vmCode']
          + '&wayNum=' + this.item.wayNumber, '', this.token).subscribe(
          data => {
            console.log(data);
            if (data.status === 1) {
              if (data.returnObject !== '') {
                this.openDoorMsg = '活动:' + data.returnObject.activityName + ',是否开门';
                this.openDoorMsgKey = '活动商品:' + data.returnObject.partakeItemList[0].key;
                this.activeImg = this.appProperties.imgUrl + data.returnObject.partakeItemList[0].value;
              }
              this.isVisibleOpenDoor = true;
            } else if (data.status === 91) {
              this.isVisibleNoMoney = true;
              this.openDoorMsg = '您的余额不足是否要开通免密支付或者是充值！';
            } else if (data.status === -1 || data.code === -1) {
              this.login();
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  eigthDoorChoose(flag) {
    this.eightDoorFlag = flag;
    if (flag === 0) {
      this.eightIndexList = this.indexList.slice(0, 4);
    } else if (flag === 1) {
      this.eightIndexList = this.indexList.slice(4, 8);
    }
  }

  follow() {
    window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzQ4MTY0Mg==&scene=124#wechat_redirect';
  }

  closeCoupon() {
    this.isVisibleCoupon = false;
    this.isVisibleCouponTwo = false;
    this.isVisibleCouponThree = false;
    document.cookie = 'coupon=' + 1;
  }

  // 运维登陆
  vmLogin(flag) {
    if (flag === 1) {
      // 微信授权登陆验证
      this.appService.getData(this.appProperties.adminOauth2Url, '').subscribe(
        data => {
          console.log(data);
          let newData;
          const newWlhUrl = '/vmLogin?vmCode=' + urlParse(window.location.search)['vmCode'] + '-/addMain?vmCode='
            + urlParse(window.location.search)['vmCode'];
          if (typeof(data.data) === 'string' && data.data.length > 0) {
            newData = data.data.replace(data.data.substring(data.data.indexOf('state=') + 6, data.data.length),
              newWlhUrl);
            console.log(newData);
            window.location.href = newData;
          }
        },
        error => {
          console.log(error);
        }
      );
      // this.router.navigate(['addMain'], {
      //   queryParams: {
      //     vmCode: urlParse(window.location.search)['vmCode'],
      //     payType: 1
      //   }
      // });
    } else if (flag === 2 && !this.youshuiCompany) {
      document.getElementsByClassName('ant-modal-body')[4]['style'].cssText = 'padding: 0;';
      this.appService.getAliData(this.appProperties.wechatCheckSend
        + '?openId=' + urlParse(window.location.search)['openId'], '').subscribe(
        data2 => {
          console.log(data2);
          if (data2.code !== 3) {
            alert(data2.msg);
          } else {
            this.isVisibleCouponThree = true;
          }
        },
        error2 => {
          console.log(error2);
        });
    }
  }

  // 订单详情
  product(flag) {
    // this.router.navigate(['product'], {
    //   queryParams: {
    //     token: this.token
    //   }});
    console.log('12');
    this.router.navigate(['detail'], {
      queryParams: {
        vmCode: urlParse(window.location.search)['vmCode'],
        flag: flag
      }
    });
    // TODO;
  }

  show() {
    this.couponButtonHidden = !this.couponButtonHidden;
  }

  // 新用户登陆
  login() {
    this.appService.getData(this.appProperties.wechatOauth2Url, {vmCode: urlParse(window.location.href)['vmCode']}).subscribe(
      data => {
        console.log(data);
        let newData;
        // const wlhUrl = 'http://youshui.natapp1.cc/main';
        // const wlhUrl = window.location.href;
        // const newWlhUrl = window.location.href.replace('main', 'register');
        // const newWlhUrl = wlhUrl.replace(wlhUrl.substring(wlhUrl.indexOf('main'), wlhUrl.length), 'register');
        const wlhUrl = '/main?vmCode=' + urlParse(window.location.href)['vmCode'];
        const newWlhUrl = '/register?vmCode=' + urlParse(window.location.href)['vmCode'];
        const state = urlParse(data.data)['state'];
        if (typeof(data.data) === 'string' && data.data.length > 0) {
          newData = data.data.replace(data.data.substring(data.data.indexOf('state=') + 6, data.data.length),
            newWlhUrl + '-' + wlhUrl + '-' + state);
          console.log(newData);
          window.location.href = newData;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  handleOk($event) {
    window.location.href = this.appProperties.followWechatSubscription;
    this.currentModal.destroy('onOk');
  }

  // 确定开门
  yesOpenDoor() {
    this.isConfirmLoading = true;
    this.openDoorMsg = '正在开门请稍等！';
    setTimeout(() => {
      this.isVisibleOpenDoor = false;
      this.isConfirmLoading = false;
      if (this.clickMore) {
        alert('亲,服务器还没反应过来,请勿再点击');
      } else {
        this.clickMore = true;
        if (this.token === null || this.token === undefined || this.token === 'undefined') {
          this.clickMore = false;
          sessionStorage.setItem('wayNumber', this.item.wayNumber);
          // alert('请点击确认，注册登陆');
          this.login();
        } else {
          this.appService.getDataOpen(this.appProperties.indexOpenDoor,
            {vmCode: urlParse(window.location.search)['vmCode'], way: this.item.wayNumber}, this.token).subscribe(
            data => {
              console.log(data);
              this.clickMore = false;
              if (data.code === 0) {
                // alert('优水到家提醒您,为了您账号资金安全,提水后请随手关门');
                // this.isVisibleOpen = true;
                const u = navigator.userAgent;
                const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
                if (isiOS) {
                  sessionStorage.setItem('flag', '1');
                  window.location.href = 'http://sms.youshuidaojia.com/goodsShow?vmCode=' + urlParse(window.location.search)['vmCode'];
                } else {
                  sessionStorage.setItem('flag', '1');
                  this.router.navigate(['goodsShow'], {
                    queryParams: {
                      vmCode: urlParse(window.location.search)['vmCode'],
                      // flag: 1,
                    }
                  });
                }
              } else if (data.code === 4) {
                const u = navigator.userAgent;
                const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
                if (isiOS) {
                  sessionStorage.setItem('flag', '2');
                  window.location.href = 'http://sms.youshuidaojia.com/goodsShow?vmCode=' + urlParse(window.location.search)['vmCode'];
                } else {
                  sessionStorage.setItem('flag', '2');
                  this.router.navigate(['goodsShow'], {
                    queryParams: {
                      vmCode: urlParse(window.location.search)['vmCode'],
                      // flag: 2,
                    }
                  });
                }
              } else if (data.code === 3) {
                alert('网络延时，请重试！');
              } else if (data.code === -1) {
                this.login();
              } else if (data.code === -87) {
                window.location.href = this.appProperties.followWechatSubscription;
              } else if (data.code === -88) {
                alert('您有未支付订单请点击我的订单支付完毕再进行购水！');
                this.router.navigate(['detail'], {
                  queryParams: {
                    vmCode: urlParse(window.location.search)['vmCode'],
                    flag: 1
                  }
                });
              } else if (data.code === -89) {
                alert('他人在买水，请稍后扫码,文明购买，请勿争抢');
              } else if (data.code === -90) {
                this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl,
                  {vmCode: urlParse(window.location.href)['vmCode']}).subscribe(
                  data1 => {
                    window.location.href = data1;
                    // sessionStorage.setItem('open', '1');
                    sessionStorage.setItem('wayNumber', this.item.wayNumber);
                  },
                  error1 => {
                    console.log(error1);
                  }
                );
              } else {
                alert(data.msg);
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    }, 1000);
  }

  // 确定关门
  noOpenDoor() {
    this.isVisibleOpenDoor = false;
    this.isVisibleNoMoney = false;
    this.activeImg = '';
    this.openDoorMsg = '是否要开门?';
    this.openDoorMsgKey = '';
  }

  openNoPassMoney() {
    this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl,
      {vmCode: urlParse(window.location.href)['vmCode']}).subscribe(
      data1 => {
        window.location.href = data1;
        sessionStorage.setItem('wayNumber', this.item.wayNumber);
      },
      error1 => {
        console.log(error1);
      }
    );
  }
  gotoSendMoney() {
    window.location.href = 'http://sms.youshuidaojia.com:9800/prepaid?vmCode=' + urlParse(window.location.href)['vmCode'];
  }
  scan() {
    const u = navigator.userAgent, app = navigator.appVersion;
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isIOS) {
      window.location.href = 'http://sms.youshuidaojia.com/scan';
    } else {
      this.appService.postScanData(this.appProperties.wechatShareInfoUrl,
        {url: window.location.href}).subscribe(
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
              'scanQRCode'
            ]
          });
          wx.ready(function () {
            console.log(123);
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
              success: function (res) {
                console.log(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
                window.location.href = res.resultStr;
              }
            });
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
  }

  // 获取token
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

  turnImg(item) {
    let img;
    if (item.length > 1) {
      img = this.img + item[1].pic;
    } else {
      img = '';
    }
    return img;
  }

  turn(item, name) {
    let variable;
    if (item.length > 1) {
      variable = item[1][name];
    } else {
      variable = '';
    }
    return variable;
  }
}
