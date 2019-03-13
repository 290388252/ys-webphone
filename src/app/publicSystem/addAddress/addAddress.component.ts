import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {getActiveCompanyId, urlParse} from '../../utils/util';
import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';

declare var WeixinJSBridge: any;
declare var wx: any;

@Component({
  selector: 'app-detail',
  templateUrl: './addAddress.component.html',
  styleUrls: ['./addAddress.component.css']
})
export class AddAddressComponent implements OnInit {
  public token: string;
  public flag;
  public aliPay = false;
  public wechatVisible;
  /**/
  public isAdd;
  public alterId;
  public vmCode;
  public lotteryId;
  public selectTrue;
  //
  // add
  public addName;
  public addSex;
  public addPhone;
  public addSite;
  public addSwitch;
  public addShow;
  public shopCar;
  public disable;
  public goodsId;
  public quantity;
  public groupId;

// alter
  public alterName;
  public alterSex;
  public alterPhone;
  public alterSite;
  public alterSwitch;
  public alterShow;
  //
  public cont;

  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    // isAdd 1：新增 0：编辑
    this.isAdd = urlParse(window.location.href)['isAdd'];
    this.alterId = urlParse(window.location.href)['locationId'];
    this.flag = urlParse(window.location.search)['flag'];
    this.vmCode = urlParse(window.location.search)['vmCode'];
    this.lotteryId = urlParse(window.location.search)['lotteryId'];
    this.selectTrue = urlParse(window.location.search)['selectTrue'];
    this.wechatVisible = false;
    this.flag = sessionStorage.getItem('flag');
    this.getToken();
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/AlipayClient/i)) {
      if (ua.match(/AlipayClient/i)[0] === 'alipayclient') {
        this.aliPay = true;
      }
    } else {
      this.aliPay = false;
    }
    this.getInit();

  }

  /**
   * 2019-03-06
   * @author maiziyao
   * 判断为新增地址还是编辑地址
   */
  getInit() {
    if (toNumber(this.isAdd) === 1) {
      this.addName = undefined;
      this.addSex = '1';
      this.addPhone = undefined;
      this.addSite = undefined;
      this.addSwitch = false;
      this.addShow = false;
      this.disable = false;
      if (this.selectTrue === 0) {
        this.cont = '返回首页';
      } else {
        this.cont = '';
      }
    } else if (toNumber(this.isAdd) === 0) {
      this.appService.postAliData(this.appProperties.shopAddressCheckUrl + '?id=' + this.alterId, {}, this.token).subscribe(
        data => {
          if (data.status === 1) {
            this.alterName = data.returnObject.receiver;
            this.alterSex = data.returnObject.sex.toString();
            this.alterPhone = data.returnObject.phone;
            this.alterSite = data.returnObject.name;
            this.alterSwitch = data.returnObject.defaultFlag;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  /**
   * 2019-03-06
   * @author maiziyao
   * 新增地址判断是否填写信息完整，保存新增地址
   */
  addAddress() {
    this.disable = true;
    if (this.addName === undefined || this.addName === null || this.addName === ''
      || this.addPhone === undefined || this.addPhone === null || this.addPhone === ''
      || this.addSite === undefined || this.addSite === null || this.addSite === '') {
      this.addShow = true;
      this.disable = false;
      return;
    } else {
      this.addShow = false;
    }
    let addSwitch;
    if (this.addSwitch === false) {
      addSwitch = 0;
    } else {
      addSwitch = 1;
    }
    this.appService.postAliData(this.appProperties.shopAddressAddUrl, {
      receiver: this.addName,
      name: this.addSite,
      phone: this.addPhone,
      defaultFlag: addSwitch,
      deleteFlag: 0,
      sex: this.addSex
    }, this.token).subscribe(
      data => {
        if (data.status === 1) {
          this.disable = false;
          alert('新增成功!');
          if (toNumber(this.selectTrue) === 0) {
            this.appService.postAliData(this.appProperties.addressUrl, '', this.token).subscribe(
              data2 => {
                console.log(data2.returnObject[0].id);
                this.appService.postAliData(this.appProperties.choiceAddressUrl, {
                  addressId: data2.returnObject[0].id,
                  id: this.lotteryId
                }, this.token).subscribe(
                  data3 => {
                    window.location.href = `http://sms.youshuidaojia.com:9800/user?vmCode=${urlParse(window.location.search)['vmCode']}&flag=3`;
                  },
                  error => {
                    console.log(error);
                  }
                );
              },
              error => {
                console.log(error);
              }
            );
            window.location.href = `http://sms.youshuidaojia.com:9800/user?vmCode=${urlParse(window.location.search)['vmCode']}&flag=3`;
          } else if (toNumber(this.selectTrue) === 1) {
            this.router.navigate(['address'], {
              queryParams: {
                vmCode: urlParse(window.location.search)['vmCode'],
                // token: sessionStorage.getItem('token'),
                flag: urlParse(window.location.search)['flag'],
                lotteryId: this.lotteryId,
                isAdd: this.isAdd,
                selectTrue: 1
              }
            });
          }
        } else {
          this.disable = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * 2019-03-06
   * @author maiziyao
   * 编辑地址判断是否填写信息完整，保存编辑后的地址
   */
  alterAddress() {
    if (this.alterName === undefined || this.alterName === null || this.alterName === ''
      || this.alterPhone === undefined || this.alterPhone === null || this.alterPhone === ''
      || this.alterSite === undefined || this.alterSite === null || this.alterSite === '') {
      this.alterShow = true;
      return;
    } else {
      this.alterShow = false;
    }
    let alterSwitch;
    if (this.alterSwitch === true) {
      alterSwitch = 1;
    } else {
      alterSwitch = 0;
    }
    console.log(this.alterSwitch);
    console.log(alterSwitch);
    this.appService.postAliData(this.appProperties.shopAddressUpdateUrl, {
      receiver: this.alterName,
      name: this.alterSite,
      phone: this.alterPhone,
      defaultFlag: alterSwitch,
      deleteFlag: 0,
      sex: this.alterSex,
      id: this.alterId
    }, this.token).subscribe(
      data => {
        if (data.status === 1) {
          alert('修改成功!');
          if (this.selectTrue === 0) {
            window.location.href = `http://sms.youshuidaojia.com:9800/user?vmCode=${urlParse(window.location.search)['vmCode']}&flag=3`;
          } else {
            this.router.navigate(['address'], {
              queryParams: {
                vmCode: urlParse(window.location.search)['vmCode'],
                // token: sessionStorage.getItem('token'),
                flag: urlParse(window.location.search)['flag'],
                lotteryId: this.lotteryId,
                isAdd: this.isAdd,
                selectTrue: 1
              }
            });
          }
        } else {
          alert(data.message);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * 2019-03-06
   * @author mzy
   * 返回地址页面
   */
  goTo() {
    if (toNumber(this.isAdd) === 0) {
      this.router.navigate(['address'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode'],
          // token: sessionStorage.getItem('token'),
          flag: urlParse(window.location.search)['flag'],
          lotteryId: this.lotteryId,
          isAdd: this.isAdd,
          selectTrue: 1
        }
      });
    } else if (toNumber(this.isAdd) === 1) {
      if (toNumber(this.selectTrue) === 1) {
        this.router.navigate(['address'], {
          queryParams: {
            vmCode: urlParse(window.location.search)['vmCode'],
            // token: sessionStorage.getItem('token'),
            flag: urlParse(window.location.search)['flag'],
            lotteryId: this.lotteryId,
            isAdd: this.isAdd,
            selectTrue: 1
          }
        });
      } else {
        this.exit();
      }
    }

  }


  /**
   * 2019-03-06
   * @author mzy
   * 返回首页
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
          // WeixinJSBridge.call('closeWindow');
          this.router.navigate(['main'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              token: sessionStorage.getItem('token'),
              close: '1'
            }
          });
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
          // window['AlipayJSBridge'].call('closeWebview');
          this.router.navigate(['aliMain'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              token: sessionStorage.getItem('token'),
              close: '1'
            }
          });
        }
      }
    }
  }

  /**
   * 2019-02-16
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
          console.log('token');
          console.log(this.token);
        }
      }
    }
  }

}
