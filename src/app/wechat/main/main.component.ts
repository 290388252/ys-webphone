import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NzModalService} from 'ng-zorro-antd';
import {
  checkPhone,
  getActiveCompanyId,
  getActiveItemId,
  getCoupon,
  getMiVmCodes,
  getNewUser,
  getVmCode,
  getVmCodes,
  urlParse
} from '../../utils/util';
import {CarouselConfig} from 'ngx-bootstrap/carousel';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

declare var wx: any;
declare var WeixinJSBridge: any;

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
  public isVisibleCouponFour = false;
  public couponButtonHidden = true;
  public clickMore = false;
  // public img = 'http://lenvar-resource-products.oss-cn-shenzhen.aliyuncs.com/';
  public activeImg = '';
  public showActiveImg = '';
  public img = this.appProperties.imgUrl;
  public vmAdvertisingImg = this.appProperties.vmAdvertisingImg;
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
  public loginShow = false;
// ---------------------login
  validateForm: FormGroup;
  public validateValue = true;
  public phone: number;
  public buttonNoTouch = false;
  public truePhone = true;
  public times = 60;
  private openId: string;
  private id: string;
// ---------------------login
  public advertiseMentPic = '';
  public checkTimes = 20;
  public showPrepaid = false;
  public companyId;


  public isFocusA;
  public isFocusB;
  public isFocusD;
  public isFocusE;
  public isFocusF;
  public isFocusG;
  public errorSumit;
  public prepaidMoney;
  public errorNum;
  public endMoney;
  public endPhone;
  public prepaidPhone;
  public judgeFriend;
  public correct;
  public orderId;
  public kouzao;
  public mi;
  public beijixiong;
  public putong;
  private phoneValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (!/^1[23456789]\d{9}$/.test(control.value)) {
      return {error: true, phoneForm: true};
    }
  }

  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private fb: FormBuilder,
              private appService: AppService) {
  }

  ngOnInit() {
    document.getElementsByClassName('ant-modal-body')[4]['style'].cssText = 'padding: 0;';
    this.validateForm = this.fb.group({
      phoneForm: [null, [this.phoneValidator]],
      password: [null, [Validators.required]]
    });
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
      this.isVisibleCoupon = false;
    } else if (getCoupon() === '2') {
      this.isVisibleCouponTwo = true;
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

    // document.getElementsByClassName('carousel-control')[1]['style'].cssText = 'opacity: 0;';
  }
// 关闭注册弹框
  handleCancel (e) {
    console.log(e);
    this.loginShow = false;
    this.isVisibleNoMoney = false;
  }

  closeAdvertiseWechat() {
    this.advertiseMentShow = false;
  }
  s() {
    window.location.href = `http://webapp.youshuidaojia.com:8080/cMain/prepaid`;
  }

  focusCode() {
    document.getElementById('ag-bk').style.height = (document.documentElement.offsetWidth + 100) + 'px';
  }

  prepaid() {
    window.location.href = 'http://sms.youshuidaojia.com:9800/prepaid?vmCode=' + urlParse(window.location.href)['vmCode'];
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 数据初始化
   */
  getInitData() {
    /**
     * 2019-02-16
     * @author YanChao
     * 判断公司id
     */

    this.appService.postData(this.appProperties.machineInfoGetCompanyIdUrl + urlParse(window.location.search)['vmCode'], '').subscribe(
      data2 => {
        console.log(data2);
        this.companyId = data2.returnObject.toString();
        this.getKouZhao();
        if (getActiveCompanyId().includes(data2.returnObject.toString())) {
          this.youshuiCompany = false;
          this.otherCompany = true;
          this.baoliCompany = false;
          // this.appService.getAliData(this.appProperties.wechatLoginCheckSend
          //   + '?openId=' + urlParse(window.location.search)['openId'], '').subscribe(
          //   data => {
          //     console.log(data);
          //     if (data.code === 3) {
          //       document.getElementsByClassName('ant-modal-body')[4]['style'].cssText = 'padding: 0;';
          //       this.isVisibleCouponThree = true;
          //     } else {
          //       // this.isVisibleCouponFour = true;
          //       // document.getElementsByClassName('ant-modal-body')[1]['style'].cssText = 'padding: 0;';
          //       // setTimeout(() => {
          //       //   this.isVisibleCouponFour = false;
          //       // }, 100000);
          //     }
          //   },
          //   error => {
          //     console.log(error);
          //   });
        } else if (data2.returnObject === 104) {
          this.youshuiCompany = true;
          this.otherCompany = false;
          this.baoliCompany = true;
        }else {
          this.youshuiCompany = true;
          this.otherCompany = false;
          this.baoliCompany = false;
        }
      },
      error2 => {
        console.log(error2);
      });
    /**
     * 2019-02-16
     * @author YanChao
     * 获取机器数据
     */
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
            this.indexList = data.data;
            // data.data.forEach((item, index) => {
            //   if (index > 1) {
            //     this.indexList.push(item);
            //   } else {
            //     this.fiveIndexList.push(item);
            //   }
            // });
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
    /**
     * 2019-02-16
     * @author YanChao
     * 广告弹窗
     */
    this.appService.postFormDataNone(this.appProperties.vdAdvertisingMachinesFindShowAdvertisingUrl,
      {vmCode: urlParse(window.location.search)['vmCode']}).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          this.advertiseMentShow = true;
          this.showPrepaid = true;
          document.getElementsByClassName('ant-modal-body')[2]['style'].cssText = 'padding: 0;';
          document.getElementsByClassName('ant-modal-body')[4]['style'].cssText = 'padding: 0;';
          this.advertiseMentPic = this.appProperties.vmAdvertisingImg + data.returnObject;
          setTimeout(() => {
            this.advertiseMentShow = false;
          }, 3000);
        } else {
          this.appService.postFormDataNone(this.appProperties.vdAdvertisingMachinesShowAdvertisingUrl,
            {vmCode: urlParse(window.location.search)['vmCode']}).subscribe(
            data1 => {
              console.log(data1);
              if (data1.status === 1 && data1.returnObject.length > 0) {
                this.advertiseMentShow = true;
                this.showPrepaid = false;
                document.getElementsByClassName('ant-modal-body')[2]['style'].cssText = 'padding: 0;';
                document.getElementsByClassName('ant-modal-body')[4]['style'].cssText = 'padding: 0;';
                this.advertiseMentPic = this.appProperties.vmAdvertisingImg + data1.returnObject[0].homeImg;
                setTimeout(() => {
                  this.advertiseMentShow = false;
                }, 3000);
              }
            }, error => {
              console.log(error);
            }
          );
        }
      }, error => {
        console.log(error);
      }
    );

  }

  getKouZhao() {
    if (this.companyId === '171') {
      this.beijixiong = true;
      this.putong = false;
      this.kouzao = false;
      this.mi = false;
    } else {
      this.beijixiong = false;
      this.putong = true;
      if (getMiVmCodes().includes(urlParse(window.location.search)['vmCode'])) {
        this.kouzao = false;
        this.mi = true;
      } else {
        this.kouzao = true;
        this.mi = false;
      }
    }
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 买一送一活动图片
   */
  showActiveItem(item, baoliCompany) {
    let flag;
    const list = getActiveItemId();
    if (baoliCompany) {
      flag = true;
    } else {
      if (item.length > 1) {
        if (list.includes(item[0].basicItemId) || list.includes(item[1].basicItemId)) {
          if (item[0].basicItemId === '2194' || item[1].basicItemId === '2194') {
            // this.showActiveImg = '../../../assets/main/send.png';
            this.showActiveImg = '';
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
            // this.showActiveImg = '../../../assets/main/send.png';
            this.showActiveImg = '';
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

  /**
   * 2019-02-16
   * @author YanChao
   * 开门
   */
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
              if (data.returnObject.isAll !== 1) {
                this.openDoorMsgKey = '活动商品:' + data.returnObject.partakeItemList[0].key;
                this.activeImg = this.appProperties.imgUrl + data.returnObject.partakeItemList[0].value;
              }
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
  /**
   * 2019-02-16
   * @author YanChao
   * 关注公众号
   */
  follow() {
    window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzQ4MTY0Mg==&scene=124#wechat_redirect';
  }

  closeCouponWechat() {
    this.isVisibleCoupon = false;
    this.isVisibleCouponTwo = false;
    this.isVisibleCouponThree = false;
    this.isVisibleCouponFour = false;
    document.cookie = 'coupon=' + 1;
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 运维登陆
   */
  vmLogin(flag, e) {
    e.preventDefault();
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
            this.isVisibleCouponThree = false;
          }
        },
        error2 => {
          console.log(error2);
        });
    }
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 订单详情
   */
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

  /**
   * 2019-02-16
   * @author YanChao
   * 新用户登陆
   */
  login() {
    this.loginShow = true;
    this.openId = urlParse(window.location.search)['openId'];
  }
  logins() {
    this.openId = urlParse(window.location.search)['openId'];
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
          window.location.href = newData;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  _submitForm() {
    for (const i in this.validateForm.controls) {
      if (true) {
        this.validateForm.controls[i].markAsDirty();
      }
    }
    if (this.validateForm.controls.phoneForm.value !== null && this.validateForm.controls.password.value !== null) {
      this.appService.getData(this.appProperties.wechatRegisterUrl,
        {
          openId: this.openId,
          phone: this.validateForm.controls.phoneForm.value,
          smsCode: this.validateForm.controls.password.value,
          vmCode: getVmCode(),
          inviteId: ''
        }).subscribe(
        data => {
          if (data.code !== 0) {
            alert('登陆失败');
          } else if (data.code === 0) {
            console.log(data);
            const exp = new Date();
            // exp.setTime(exp.getTime() + 1000 * 60 * 60);
            exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
            document.cookie = 'token=' + data.data.token + ';expires=' + exp.toUTCString();
            if (data.data.registerCoupon === 1 || data.data.registerCoupon === '1') {
              document.cookie = 'coupon=' + 0;
            } else if (data.data.registerCoupon === 2 || data.data.registerCoupon === '2') {
              document.cookie = 'coupon=' + 2;
            }
            document.cookie = 'newUser=' + 1;
            if (sessionStorage.getItem('flag') === '' || sessionStorage.getItem('flag') === undefined
              || sessionStorage.getItem('flag') === null) {
              this.token = data.data.token;
              this.loginShow = false;
              this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl,
                {vmCode: urlParse(window.location.href)['vmCode']}).subscribe(
                data11 => {
                  window.location.href = data11;
                },
                error11 => {
                  console.log(error11);
                }
              );
            } else {
              window.location.href = `http://sms.youshuidaojia.com:9800/main?vmCode=${urlParse(window.location.search)['vmCode']}`;
            }
            // this.router.navigate(['main'], {queryParams: {'token': data.data.token}});
          }
        },
        error => {
          console.log(error);
        }
      );
      console.log(this.validateForm.controls.phoneForm.value);
      console.log(this.validateForm.controls.password.value);
    } else {
      alert('请输入手机号码');
    }
  }

  // 发送验证码
  sendCode(e: TouchEvent) {
    e.preventDefault();
    if (checkPhone(this.phone)) {
      this.appService.postData(this.appProperties.smsSendUrl, {phone: this.phone}).subscribe(
        data => {
          if (data.code !== 0) {
            alert('发送失败');
          } else {
            this.times = 60;
            this.buttonNoTouch = true;
            this.truePhone = true;
            const timer = setInterval(() => {
              this.times--;
              if (this.times <= 0) {
                this.buttonNoTouch = false;
                clearInterval(timer);
              }
            }, 1000);
            setTimeout(() => {
              this.buttonNoTouch = false;
            }, 60100);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.truePhone = false;
    }
  }

  handleOk($event) {
    window.location.href = this.appProperties.followWechatSubscription;
    this.currentModal.destroy('onOk');
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 确定开门
   */
  yesOpenDoor() {
    this.isConfirmLoading = true;
    this.openDoorMsg = '正在开门请稍等！';
    setTimeout(() => {
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
          this.appService.postFormData(this.appProperties.indexOpenDoor,
            {vmCode: urlParse(window.location.search)['vmCode'], way: this.item.wayNumber}, this.token).subscribe(
            data => {
              console.log(data);
              this.clickMore = false;
              if (data.status === 1) {
                // alert('优水到家提醒您,为了您账号资金安全,提水后请随手关门');
                // this.isVisibleOpen = true;
                this.checkIsOpen(1);
              } else if (data.status === 4000) {
                this.checkIsOpen(2);
              } else if (data.status === 3) {
                this.isVisibleOpenDoor = false;
                this.isConfirmLoading = false;
                alert('网络延时，请重试！');
              } else if (data.status === -1) {
                this.isVisibleOpenDoor = false;
                this.isConfirmLoading = false;
                this.login();
              } else if (data.status === -87) {
                this.isVisibleOpenDoor = false;
                this.isConfirmLoading = false;
                window.location.href = this.appProperties.followWechatSubscription;
              } else if (data.status === 4003) {
                this.isVisibleOpenDoor = false;
                this.isConfirmLoading = false;
                alert('您有未支付订单请点击确定进行支付！感谢您的光临！');
                window.location.href = `http://sms.youshuidaojia.com:9800/orderDetails?vmCode=${urlParse(window.location.search)['vmCode']}&token=${this.token}&pays=1`;
                // this.router.navigate(['detail'], {
                //   queryParams: {
                //     vmCode: urlParse(window.location.search)['vmCode'],
                //     flag: 1
                //   }
                // });
              } else if (data.status === 0) {
                this.isVisibleOpenDoor = false;
                this.isConfirmLoading = false;
                alert('因当前网络信号弱，机器未能收到您的开门请求，请网络恢复后再进行购买，给您带来不便我们深感抱歉！感谢您的光临！');
              } else if (data.status === 91) {
                this.isVisibleOpenDoor = false;
                this.isConfirmLoading = false;
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
                this.isVisibleOpenDoor = false;
                this.isConfirmLoading = false;
                alert(data.message);
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    }, 100);
  }
  /**
   * 2019-02-16
   * @author YanChao
   * 检测是否开门
   */
  checkIsOpen(flag) {
    this.checkTimes--;
    let time;
    this.appService.postFormData(this.appProperties.cusOpenIsOpened,
      {vmCode: urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          clearTimeout(time);
          const u = navigator.userAgent;
          const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
          if (isiOS) {
            this.isVisibleOpenDoor = false;
            this.isConfirmLoading = false;
            sessionStorage.setItem('flag', flag);
            window.location.href = 'http://sms.youshuidaojia.com/goodsShow?vmCode=' + urlParse(window.location.search)['vmCode'];
          } else {
            this.isVisibleOpenDoor = false;
            this.isConfirmLoading = false;
            sessionStorage.setItem('flag', flag);
            this.router.navigate(['goodsShow'], {
              queryParams: {
                vmCode: urlParse(window.location.search)['vmCode'],
                // sm: 1,
              }
            });
          }
        } else if (data.status === 0) {
          if (this.checkTimes === 0) {
            alert('网络延迟，请重试开门');
            this.isVisibleOpenDoor = false;
            this.isConfirmLoading = false;
            clearTimeout(time);
            this.checkTimes = 10;
          } else {
            time = setTimeout(() => {
              this.checkIsOpen(flag);
            }, 500);
          }
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
   * 确定关门
   */
  noOpenDoor() {
    this.isVisibleOpenDoor = false;
    this.isVisibleNoMoney = false;
    this.activeImg = '';
    this.openDoorMsg = '是否要开门?';
    this.openDoorMsgKey = '';
  }
  /**
   * 2019-02-16
   * @author YanChao
   * 免密支付
   */
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
  /**
   * 2019-02-16
   * @author YanChao
   * 判断是否为优水用户
   */
  gotoSendMoney() {
    this.appService.postAliData(this.appProperties.tblCustomerMyInfo, {}, urlParse(window.location.search)['token']).subscribe(
      data => {
        if (data.status === -66) {
          alert(data.message);
          return;
        } else {
          window.location.href = 'http://sms.youshuidaojia.com:9800/prepaid?vmCode=' + urlParse(window.location.href)['vmCode'];
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
   * 扫码
   */
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

  /**
   * 2019-02-16
   * @author YanChao
   * 获取token
   */
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
  /**
   * 2019-02-16
   * @author YanChao
   * 图片转换和判空
   */
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

  /**
   * 2018-01-01
   * @author Yanchao
   * 轮播图
   */
  bannerTo(val) {
    if (val === '1') {
      window.location.href = 'http://webapp.youshuidaojia.com/cMain/recommendB?itemType=0';
    } else if (val === '2') {
      window.location.href = 'http://sms.youshuidaojia.com:9800/prepaid?vmCode=' + urlParse(window.location.href)['vmCode'];
      // window.location.href = 'http://sms.youshuidaojia.com:9800/user?vmCode=' + urlParse(window.location.href)['vmCode'] + '&flag=3';
    } else if (val === '4') {
      // window.location.href = 'http://webapp.youshuidaojia.com/cMain/detail?id=63&spellgroupId=0&pic=6d4d5864-7cf9-40a1-82df-a6acea58da10.jpg&type=1';
    }
  }
  /**
   * 2019-02-16
   * @author YanChao
   * 菜单选择
   */
  circleBtn(flag) {
    if (flag === 1) {
      this.appService.postAliData(this.appProperties.shopUserMoneyUrl, {}, this.token).subscribe(
        data => {
          if (data.status === -66) {
            alert(data.message);
            return;
          } else {
            window.location.href
              = `http://sms.youshuidaojia.com:9800/prepaid?vmCode=${urlParse(window.location.search)['vmCode']}&token=${this.token}`;
          }
        },
        error => {
          console.log(error);
        }
      );
    } else if (flag === 2) {
      window.location.href = `http://sms.youshuidaojia.com:9800/shopGuide?vmCode=${urlParse(window.location.search)['vmCode']}&flag=2`;
    } else if (flag === 3) {
      // this.router.navigate(['shareGzh'], {
      //   queryParams: {
      //     vmCode: urlParse(window.location.search)['vmCode'],
      //     token: this.token
      //   }
      // });
    } else if (flag === 4) {
      document.getElementsByClassName('ant-modal-body')[4]['style'].cssText = 'padding: 0;';
      this.isVisibleCouponThree = true;
    } else if (flag === 5) {
      document.getElementsByClassName('ant-modal-body')[4]['style'].cssText = 'padding: 0;';
      this.isVisibleCouponThree = true;
    }
  }

}
