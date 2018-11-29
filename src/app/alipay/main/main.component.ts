import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {getActiveCompanyId, getActiveItemId, urlParse} from '../../utils/util';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: true, showIndicators: true } }
  ]
})
export class MainComponent implements OnInit {
  public indexList = [];
  public eightIndexList = [];
  public eightDoorFlag = 0;
  public fiveIndexList = [];
  private token: string;
  // public img = 'http://lenvar-resource-products.oss-cn-shenzhen.aliyuncs.com/';
  public img = this.appProperties.imgUrl; // 图片地址
  // public img = 'http://119.23.233.123:6662/ys_admin/files/'; // 图片地址
  public isVisibleOpen = false;
  public isVisibleOpenDoor = false;
  public clickMore = false;
  public item;
  public isFourDoor = false; // 四门
  public isFiveDoor = false; // 五门
  public isEightDoor = false; // 八门
  public isVisibleCouponThree = false;
  public isVisiblePromotions = false;
  public couponButtonHidden = true;
  public youshuiCompany = true;
  public otherCompany = true;
  public baoliCompany = false;
  public openDoorMsg = '是否要开门？';
  public isConfirmLoading = false;
  public isVisibleCouponFour = false;
  public userSuggestion: string;
  public showSuggestion;
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {}
  ngOnInit() {
    this.IsWeixinOrAlipay();
    // this.activatedRoute.queryParams.subscribe(queryParams => {
    //   this.token = queryParams.token;
    // });
    // 初始化数据
    this.getInitData();
    // 获取token值
    if (urlParse(window.location.search)['token'] === undefined) {
      this.getCookies();
    } else {
      this.token = urlParse(window.location.search)['token'];
      const exp = new Date();
      exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
      document.cookie = 'token=' + this.token + ';expires=' + exp.toUTCString();
    }
    console.log(this.token);
    console.log(urlParse(window.location.search)['vmCode']);
    sessionStorage.setItem('vmCode', urlParse(window.location.search)['vmCode']);
  }
  IsWeixinOrAlipay() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i)) {
      if (ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
        this.router.navigate(['notPage']);
      }
    }
  }
  // 初始化数据
  getInitData() {
    // 选水界面接口
    this.appService.postData(this.appProperties.machineInfoGetCompanyIdUrl + urlParse(window.location.search)['vmCode'], '').subscribe(
      data2 => {
        console.log(data2);
        if (getActiveCompanyId().includes(data2.returnObject.toString())) {
          this.youshuiCompany = false;
          this.otherCompany = true;
          this.baoliCompany = false;
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
    this.appService.getAliData(this.appProperties.aliIndexListUrl,
      {vmCode: urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          if (!data.willGo) {
            if (data.returnObject.length <= 4) {
              this.isFourDoor = true;
              this.isFiveDoor = false;
              this.isEightDoor = false;
              this.indexList = data.returnObject;
              for (let i = 0; i < 2; i++) {
                this.indexList.unshift(this.indexList.pop());
              }
            } else if (data.returnObject.length === 5) {
              this.isFourDoor = false;
              this.isFiveDoor = true;
              this.isEightDoor = false;
              data.returnObject.forEach((item, index) => {
                if (index > 1) {
                  this.indexList.push(item);
                } else {
                  this.fiveIndexList.push(item);
                }
              });
            } else if (data.returnObject.length === 8) {
              this.isFourDoor = false;
              this.isFiveDoor = false;
              this.isEightDoor = true;
              this.indexList = data.returnObject;
              this.eightIndexList = data.returnObject.slice(0, 4);
            }
          }
          console.log(this.indexList);
        } else {
          alert(data.message);
        }
      },
      error => {
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
          flag = false;
        } else {
          flag = true;
        }
      } else {
        if (list.includes(item[0].basicItemId)) {
          flag = false;
        } else {
          flag = true;
        }
      }
    }
    return flag;
  }
  // 开门接口
  openDoor(item) {
    this.item = item;
    if (item.num <= 0) {
      alert('水已经卖完无法开门');
    } else {
      this.isVisibleOpenDoor = true;
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
  openOk() {
    this.isClosed(urlParse(window.location.search)['vmCode']);
  }
  // 是否开门（是）
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
        this.appService.postAliData(this.appProperties.aliOpenDoorUrl,
          {vmCode: urlParse(window.location.search)['vmCode'], openType: 1, doorNO: this.item.wayNumber}, this.token).subscribe(
          data => {
            console.log(data);
            this.clickMore = false;
            if (data.status === 1) {
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
            } else if (data.status === 4000) {
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
            } else if (data.status === -1) {
             this.noTokenOath();
            } else {
             if (data.code === -1) {
               this.noTokenOath();
              } else {
                 alert(data.message);
                 if (data.willGo) {
                   window.location.href = data.returnObject;
                 }
             }
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    }, 1000);
  }
  noTokenOath() {
    this.appService.getData(this.appProperties.aliGetUserIdUrl + '?vmCode=' + urlParse(window.location.search)['vmCode'], '').subscribe(
      data2 => {
        console.log(data2);
        window.location.href = data2.returnObject;
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  // 是否开门（否）
  noOpenDoor() {
    this.isVisibleOpenDoor = false;
  }
  // 检测是否关门
  isClosed(vmCode) {
    this.appService.getDataOpen(this.appProperties.isClosedUrl, {vmCode: vmCode}, this.token).subscribe(
      data2 => {
        if (data2.data === false) {
          this.isVisibleOpen = true;
          // this.isClosed(urlParse(window.location.search)['vmCode']);
        } else if (data2.data === true) {
          this.getInitData();
          this.isVisibleOpen = false;
          this.isAttention();
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  // 关注支付宝生活号接口
  isAttention() {
    this.appService.getAliData(this.appProperties.aliBusinessIsAttentionUrl, '' , this.token).subscribe(
      data2 => {
        if (data2.status === 1) {
          // stop
        } else if (data2.status !== 1) {
          if (data2.willGo) {
            alert('点击确定前往关注我们生活号有惊喜');
            window.location.href = data2.returnObject;
          }
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  follow() {
    window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NzQ4MTY0Mg==&scene=124#wechat_redirect';
  }
  closeCoupon() {
    this.isVisibleCouponThree = false;
  }
  // 补货人员登陆界面入口
  vmLogin(flag) {
    if (flag === 1) {
      // 支付宝授权登陆验证
      const newWlhUrl = '?state=/vmLogin?vmCode=' + urlParse(window.location.search)['vmCode'] + '-/addMain?vmCode='
        + urlParse(window.location.search)['vmCode'];
      this.appService.getData(this.appProperties.aliVmGetUserIdUrl + '?vmCode=' + urlParse(window.location.search)['vmCode'], '').subscribe(
        data2 => {
          console.log(data2);
          window.location.href = data2.returnObject + newWlhUrl;
        },
        error2 => {
          console.log(error2);
        }
      );
      // this.router.navigate(['addMain'], {
      //   queryParams: {
      //     vmCode: urlParse(window.location.search)['vmCode'],
      //     payType: 2
      //   }
      // });
    } else if (flag === 2) {
      document.getElementsByClassName('ant-modal-body')[2]['style'].cssText = 'padding: 0;';
      this.isVisibleCouponThree = true;
    }
  }
  // 双十一
  openPromotions() {
    document.getElementsByClassName('ant-modal-body')[3]['style'].cssText = 'padding: 0;';
    this.isVisiblePromotions = true;
  }
  closemodalContentPromotions() {
    this.isVisiblePromotions = false;
  }
  // 订单详情
  product(flag) {
    // this.router.navigate(['product'], {
    //   queryParams: {
    //     token: this.token
    //   }});
    this.router.navigate(['aliDetail'], {
      queryParams: {
        vmCode: urlParse(window.location.search)['vmCode'],
        flag: flag
      }
    });
    // TODO;
  }
  openSuggestion() {
    document.getElementsByClassName('ant-modal-body')[5]['style'].cssText = 'padding: 0;';
    this.isVisibleCouponFour = true;
    this.showSuggestion = false;
  }

  closeSuggestion() {
    this.isVisibleCouponFour = false;
  }


  submitSuggestion() {
    if (this.userSuggestion === undefined || this.userSuggestion === null || this.userSuggestion === '') {
      this.showSuggestion = true;
      return;
    } else {
      this.showSuggestion = false;
    }
    this.appService.postDataOpen(this.appProperties.machineSuggestionUrl, {
      'vmCode': urlParse(window.location.search)['vmCode'],
      'content': this.userSuggestion
    }, this.token).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          alert('提交成功');
          this.userSuggestion = undefined;
          this.isVisibleCouponFour = false;
        } else {
          alert(data.message);
        }
      },
      error2 => {
        console.log(error2);
      });
  }

  show() {
    this.couponButtonHidden = !this.couponButtonHidden;
  }
  getCookies () {
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
    if  (item.length > 1) {
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
