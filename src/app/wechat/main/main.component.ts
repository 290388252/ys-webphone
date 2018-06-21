import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NzModalService} from 'ng-zorro-antd';
import {urlParse} from '../../utils/util';
declare var wx: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public indexList: Array<object>;
  private token: string;
  private newUser: boolean;
  private wayNumber: number;
  public isVisibleOpen = false;
  public isVisibleOpenDoor = false;
  public clickMore = false;
  // public img = 'http://lenvar-resource-products.oss-cn-shenzhen.aliyuncs.com/';
  // public img = 'http://119.23.233.123:6662/ys_admin/files/';
  public img = this.appProperties.imgUrl;
  public item;
  currentModal;
  public isFourDoor = false;
  public isFiveDoor = false;
  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {}
  ngOnInit() {
    // console.log(document.getElementsByClassName('ant-modal-footer')[0].id = 'ant-modal-footer');
    this.getInitData();
    this.getCookies();
    console.log(this.token);
    if (urlParse(window.location.search)['token']) {
      this.token = urlParse(window.location.search)['token'];
      const exp = new Date();
      exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
      document.cookie = 'token=' + this.token + ';expires=' + exp.toUTCString();
    }
    console.log(urlParse(window.location.search)['vmCode']);
    console.log(urlParse(window.location.search)['newUser']);
    // 新用户进入界面
    if (urlParse(window.location.search)['newUser'] === '1') {
      this.appService.getDataOpen(this.appProperties.indexOpenDoor,
        {vmCode: urlParse(window.location.search)['vmCode'], way: sessionStorage.getItem('wayNumber')}, this.token).subscribe(
        data => {
          console.log(data);
          this.isVisibleOpenDoor = false;
          if (data.code === 0) {
            this.isVisibleOpen = true;
          } else if (data.code === 3) {
            alert('开门失败！');
          } else if (data.code === -1) {
            this.login();
          } else if (data.code === -87) {
            window.location.href = this.appProperties.followWechatSubscription;
          } else if (data.code === -88) {
            alert('您有未支付订单请点击我的订单支付完毕再进行购水！');
          } else if (data.code === -89) {
            alert('他人在买水，请稍后扫码,文明购买，请勿争抢');
          } else if (data.code === -90) {
            this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl).subscribe(
              data1 => {
                window.location.href =  data1;
                sessionStorage.setItem('open', '1');
              },
              error1 => {
                console.log(error1);
              }
            );
          }
        },
        error => {
          console.log(error);
        }
      );
    }
    // 是否自动开门
    if (sessionStorage.getItem('open') === '1') {
      this.appService.getDataOpen(this.appProperties.indexOpenDoor,
        {vmCode: urlParse(window.location.search)['vmCode'], way: sessionStorage.getItem('wayNumber')}, this.token).subscribe(
        data => {
          console.log(data);
          this.isVisibleOpenDoor = false;
          if (data.code === 0) {
            this.isVisibleOpen = true;
          } else if (data.code === 3) {
            alert('开门失败！');
          } else if (data.code === -1) {
            this.login();
          } else if (data.code === -87) {
            window.location.href = this.appProperties.followWechatSubscription;
          } else if (data.code === -88) {
            alert('您有未支付订单请点击我的订单支付完毕再进行购水！');
          } else if (data.code === -89) {
            alert('他人在买水，请稍后扫码,文明购买，请勿争抢');
          } else if (data.code === -90) {
            this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl).subscribe(
              data1 => {
                window.location.href =  data1;
              },
              error1 => {
                console.log(error1);
              }
            );
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  // 数据初始化
  getInitData() {
    this.appService.getData(this.appProperties.indexListUrl, {vmCode: urlParse(window.location.search)['vmCode'], type: 1}).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          if (data.data.length <= 4) {
            this.isFourDoor = true;
            this.isFiveDoor = false;
          } else if (data.data.length === 5) {
            this.isFourDoor = false;
            this.isFiveDoor = true;
          }
          this.indexList = data.data;
          for (let i = 0; i < 2; i++) {
            this.indexList.unshift(this.indexList.pop());
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  // 开门
  openDoor(item) {
    this.item = item;
    if (item.num <= 0) {
      alert('水已经卖完无法开门');
    } else {
      this.isVisibleOpenDoor = true;
    }
  }
  // 运维登陆
  vmLogin() {
    this.router.navigate(['addMain'], {
      queryParams: {
        vmCode: urlParse(window.location.search)['vmCode'],
        payType: 1
      }});
  }
  // 订单详情
  product() {
    // this.router.navigate(['product'], {
    //   queryParams: {
    //     token: this.token
    //   }});
    this.router.navigate(['detail']);
    // TODO;
  }
  // 是否已关门
  isClosed(vmCode) {
    this.appService.getDataOpen(this.appProperties.isClosedUrl, {vmCode: vmCode}).subscribe(
      data2 => {
        console.log(data2);
        if (data2.data === false) {
          // alert('您的门还未关闭！优水到家提醒您,为了您账号资金安全,提水后请随手关门');
          this.isVisibleOpen = true;
        } else if (data2.data === true) {
          this.isVisibleOpen = false;
          // this.router.navigate(['detail']);
          alert('广州优水到家工程感谢你的惠顾。');
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  // 新用户登陆
  login() {
    // this.currentModal = this.modalService.open({
    //   title       : titleTpl,
    //   content     : contentTpl,
    //   footer      : footerTpl,
    //   maskClosable: false,
    //   onOk() {
    //     console.log('Click ok');
    //   }
    // });
    this.appService.getData(this.appProperties.wechatOauth2Url, '').subscribe(
      data => {
        console.log(data);
        let newData;
        // const wlhUrl = 'http://youshui.natapp1.cc/main';
        // const wlhUrl = window.location.href;
        // const newWlhUrl = window.location.href.replace('main', 'register');
        // const newWlhUrl = wlhUrl.replace(wlhUrl.substring(wlhUrl.indexOf('main'), wlhUrl.length), 'register');
        const wlhUrl = '/main?vmCode=' + urlParse(window.location.href)['vmCode'];
        const newWlhUrl = '/register?vmCode=' + urlParse(window.location.href)['vmCode'];
        if (typeof(data.data) === 'string' && data.data.length > 0) {
          newData = data.data.replace(data.data.substring(data.data.indexOf('state=') + 6, data.data.length),
            newWlhUrl + '-' + wlhUrl);
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
  // 检测关门
  openOk() {
    this.isVisibleOpen = true;
    this.isClosed(urlParse(window.location.search)['vmCode']);
  }
  // 确定开门
  yesOpenDoor() {
    this.isVisibleOpenDoor = false;
      if (this.clickMore) {
        alert('亲,服务器还没反应过来,请勿再点击');
      } else {
        this.clickMore = true;
        if (this.token === null || this.token === undefined || this.token === 'undefined') {
          this.clickMore = false;
          sessionStorage.setItem('wayNumber', this.item.wayNumber);
          alert('请点击确认，注册登陆');
          this.login();
        } else {
          this.appService.getDataOpen(this.appProperties.indexOpenDoor,
            {vmCode: urlParse(window.location.search)['vmCode'], way: this.item.wayNumber}, this.token).subscribe(
            data => {
              console.log(data);
              this.clickMore = false;
              if (data.code === 0) {
                // alert('优水到家提醒您,为了您账号资金安全,提水后请随手关门');
                this.isVisibleOpen = true;
              } else if (data.code === 3) {
                alert('开门失败！');
              } else if (data.code === -1) {
                this.login();
              } else if (data.code === -87) {
                window.location.href = this.appProperties.followWechatSubscription;
              } else if (data.code === -88) {
                alert('您有未支付订单请点击我的订单支付完毕再进行购水！');
              } else if (data.code === -89) {
                alert('他人在买水，请稍后扫码,文明购买，请勿争抢');
              } else if (data.code === -90) {
                this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl).subscribe(
                  data1 => {
                    window.location.href =  data1;
                    sessionStorage.setItem('open', '1');
                    sessionStorage.setItem('wayNumber', this.item.wayNumber);
                  },
                  error1 => {
                    console.log(error1);
                  }
                );
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      }
  }
  // 确定关门
  noOpenDoor() {
    this.isVisibleOpenDoor = false;
  }
  // 测试支付
  test(data) {
    wx.config({
      debug: false,
      appId: data.config.appId,
      timestamp: data.config.timestamp,
      nonceStr: data.config.nonceStr,
      signature: data.config.signature,
      jsApiList: ['checkJsApi',
        'chooseWXPay',
      ]
    });
    wx.ready(() => {
      wx.chooseWXPay({
        debug: false,
        timestamp: data.payInfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: data.payInfo.nonceStr, // 支付签名随机串，不长于 32 位
        package: data.payInfo.package,
        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: data.payInfo.sign, // 支付签名
        success: (res) => {
          if (res.errMsg === 'chooseWXPay:ok') {
            alert('支付成功');
          } else {
            alert('支付失败');
          }
        },
        cancel: (res) => {
          alert('您取消了支付');
          // 支付取消
        },
        error: (res) => {
          alert('出错了，请联系优水到家管理员');
        }
      });
    });
  }
  // 获取token
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
}
