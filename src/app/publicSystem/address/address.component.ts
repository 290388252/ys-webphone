import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {getActiveCompanyId, urlParse} from '../../utils/util';

declare var WeixinJSBridge: any;
declare var wx: any;

@Component({
  selector: 'app-detail',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  public token: string;
  public flag;
  public vmCode;
  public lotteryId;
  public isAdd;
  public aliPay = false;
  public wechatVisible;
  /**/
  public emptyAddress = true;
  public list = [];
  public type;
  public delItem;
  public isVisible = false;
  public isVisibleCouponOne = false;
  public showName;
  public showPhone;
  public showAddress;
  public addressId;

  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    this.wechatVisible = false;
    this.flag = urlParse(window.location.search)['flag'];
    this.vmCode = urlParse(window.location.search)['vmCode'];
    this.lotteryId = urlParse(window.location.search)['lotteryId'];
    this.isAdd = urlParse(window.location.search)['isAdd'];
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
   * 2019-02-16
   * @author YanChao
   * 数据初始化
   */
  getInit() {
    this.appService.postAliData(this.appProperties.addressUrl, '', this.token).subscribe(
      data => {
        data.returnObject === null ? this.emptyAddress = true : this.emptyAddress = false;
        if (!this.emptyAddress) {
          this.list = data.returnObject;
          let one;
          setTimeout(() => {
            one = document.getElementsByName('default');
            console.log(one);
            for (let i = 0; i < this.list.length; i++) {
              console.log(this.list[i].defaultFlag === 1);
              console.log(this.list[i].defaultFlag === '1');
              if (this.list[i].defaultFlag === 1) {
                one[i]['checked'] = true;
                return;
              }
            }
          });

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
   * 选择地址
   */
  selectAddress(item) {
    this.isVisibleCouponOne = true;
    document.getElementsByClassName('ant-modal-footer')[1]['style'].cssText = 'text-align: center;';
    document.getElementsByClassName('ant-modal-close-x')[1]['style'].cssText = 'display: none;';
    document.getElementsByClassName('ant-modal-body')[1]['style'].cssText = 'padding: 4px 24px;';
    this.showName = item.receiver;
    this.showPhone = item.phone;
    this.showAddress = item.name;
    this.addressId = item.id;
  }

  /**
   * 2019-02-15
   * @author maiziyao
   * 确认地址或关闭
   */
  closeCoupon(val) {
    if (val === 0) {
      this.isVisibleCouponOne = false;
    } else {
      this.appService.postAliData(this.appProperties.choiceAddressUrl, {
        addressId: this.addressId,
        id: this.lotteryId
      }, this.token).subscribe(
        data => {
          alert('设置成功!');
          window.location.href = `http://sms.youshuidaojia.com:9800/user?vmCode=${urlParse(window.location.search)['vmCode']}&flag=3`;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  /**
   * 2019-02-15
   * @author maiziyao
   * 设置或取消默认地址
   */
  setDefault(item) {
    // shopAddressUpdateUrl
    const one = document.getElementsByName('default');
    const two = document.getElementById(('a' + item.id));
    if (two['checked'] === false) {
      for (let j = 0; j < one.length; j++) {
        one[j]['checked'] = false;
      }
    } else {
      for (let j = 0; j < one.length; j++) {
        one[j]['checked'] = false;
      }
      two['checked'] = true;
    }
    this.appService.postAliData(this.appProperties.shopAddressUpdateUrl, {
      receiver: item.alterName,
      name: item.alterSite,
      phone: item.alterPhone,
      defaultFlag: two['checked'] === false ? '0' : '1',
      sex: item.alterSex,
      id: item.id
    }, this.token).subscribe(
      data => {
        if (data.status === 1) {
          this.getInit();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // getInit() {
  //   this.appService.postFormData(this.appProperties.payFinishGrouponUrl, '', this.token).subscribe(
  //     data => {
  //       this.grouponList = data.returnObject;
  //       console.log(this.grouponList.length > 0);
  //       if (this.grouponList.length > 0) {
  //         this.grouponShow = true;
  //       } else {
  //         this.grouponShow = false;
  //       }
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  // }
  /**
   * 2019-02-15
   * @author maiziyao
   * 是否确认删除地址弹框
   */
  delAddress(item) {
    this.delItem = item;
    document.getElementsByClassName('ant-modal-footer')[0]['style'].cssText = 'text-align: center;';
    this.isVisible = true;
  }

  /**
   * 2019-02-15
   * @author maiziyao
   * 确认删除地址，关闭弹框
   */
  handleOk(): void {
    this.appService.postAliData(this.appProperties.shopAddressUpdateUrl, {
      receiver: this.delItem.receiver,
      name: this.delItem.name,
      phone: this.delItem.phone,
      defaultFlag: this.delItem.defaultFlag,
      deleteFlag: 1,
      sex: this.delItem.sex,
      id: this.delItem.id
    }, this.token).subscribe(
      data => {
        if (data.status === 1) {
          this.getInit();
          this.isVisible = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * 2019-02-15
   * @author maiziyao
   * 取消删除地址，关闭弹框
   */
  handleCancel(): void {
    this.isVisible = false;
  }

  addAddress() {
    this.router.navigate(['addAddress'], {
      queryParams: {
        vmCode: urlParse(window.location.search)['vmCode'],
        // token: sessionStorage.getItem('token'),
        flag: urlParse(window.location.search)['flag'],
        lotteryId: this.lotteryId,
        isAdd: 1,
        selectTrue: 0
      }
    });
  }

  alterAddress(item) {
    event.stopPropagation();
    this.router.navigate(['addAddress'], {
      queryParams: {
        isAdd: 0,
        locationId: item.id,
        vmCode: urlParse(window.location.search)['vmCode'],
        // token: sessionStorage.getItem('token'),
        flag: urlParse(window.location.search)['flag'],
        lotteryId: this.lotteryId,
        selectTrue: 0
      }
    });
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
    // let token;
    // if (this.flag === 1 || this.flag === '1'
    //   || this.flag === 2 || this.flag === '2') {
    //   token = 'token';
    // } else {
    //   token = 'adminToken';
    // }
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      const strCookie = document.cookie;
      const arrCookie = strCookie.split(';');
      for (let i = 0; i < arrCookie.length; i++) {
        const arr = arrCookie[i].split('=');
        if (arr[0].trim() === 'token') {
          this.token = arr[1];
          console.log('token');
          console.log(this.token);
        }
      }
    } else {
      this.token = urlParse(window.location.search)['token'];
    }
  }

}
