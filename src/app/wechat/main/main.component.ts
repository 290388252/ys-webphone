import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NzModalService} from 'ng-zorro-antd';
import {urlParse} from '../../utils/util';

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
  // public img = 'http://lenvar-resource-products.oss-cn-shenzhen.aliyuncs.com/';
  public img = 'http://47.106.92.82:6663/files/';
  currentModal;
  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {}
  ngOnInit() {
    // this.activatedRoute.queryParams.subscribe(queryParams => {
    //   this.token = queryParams.token;
    // });
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
    if (urlParse(window.location.search)['newUser'] === '1') {
      this.appService.getDataOpen(this.appProperties.indexOpenDoor,
        {vmCode: urlParse(window.location.search)['vmCode'], way: sessionStorage.getItem('wayNumber')}, this.token).subscribe(
        data => {
          console.log(data);
          if (data.code === 0) {
            this.isVisibleOpen = true;
          } else if (data.code === -1) {
            this.login('', '', '');
          } else if (data.code === -87) {
            window.location.href = this.appProperties.followWechatSubscription;
          } else if (data.code === -88) {
            alert('您有未支付订单请点击我的订单支付完毕再进行购水！');
          } else if (data.code === -89) {
            alert('门已开，请误点击多次');
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
    if (sessionStorage.getItem('open') === '1') {
      this.appService.getDataOpen(this.appProperties.indexOpenDoor,
        {vmCode: urlParse(window.location.search)['vmCode'], way: sessionStorage.getItem('wayNumber')}, this.token).subscribe(
        data => {
          console.log(data);
          if (data.code === 0) {
            this.isVisibleOpen = true;
          } else if (data.code === -1) {
            this.login('', '', '');
          } else if (data.code === -87) {
            window.location.href = this.appProperties.followWechatSubscription;
          } else if (data.code === -88) {
            alert('您有未支付订单请点击我的订单支付完毕再进行购水！');
          } else if (data.code === -89) {
            alert('门已开，请误点击多次');
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
  getInitData() {
    this.appService.getData(this.appProperties.indexListUrl, {vmCode: urlParse(window.location.search)['vmCode']}).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
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
  openDoor(item, titleTpl, contentTpl, footerTpl) {
    // this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl).subscribe(
    //   data => {
    //     console.log(data);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
    if (item.num === 0) {
      alert('水已经卖完无法开门');
    } else {
      if (this.token === null || this.token === undefined || this.token === 'undefined') {
        sessionStorage.setItem('wayNumber', item.wayNumber);
        alert('请点击确认，注册登陆');
        this.login(titleTpl, contentTpl, footerTpl);
      } else {
        this.appService.getDataOpen(this.appProperties.indexOpenDoor,
          {vmCode: urlParse(window.location.search)['vmCode'], way: item.wayNumber}, this.token).subscribe(
          data => {
            console.log(data);
            if (data.code === 0) {
              // alert('优水到家提醒您,为了您账号资金安全,提水后请随手关门');
              this.isVisibleOpen = true;
            } else if (data.code === -1) {
              this.login(titleTpl, contentTpl, footerTpl);
            } else if (data.code === -87) {
              window.location.href = this.appProperties.followWechatSubscription;
            } else if (data.code === -88) {
              alert('您有未支付订单请点击我的订单支付完毕再进行购水！');
            } else if (data.code === -89) {
              alert('门已开，请误点击多次！');
            } else if (data.code === -90) {
              this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl).subscribe(
                data1 => {
                  window.location.href =  data1;
                  sessionStorage.setItem('open', '1');
                  sessionStorage.setItem('wayNumber', item.wayNumber);
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
  vmLogin() {
    this.router.navigate(['addMain'], {
      queryParams: {
        vmCode: urlParse(window.location.search)['vmCode']
      }});
  }
  product() {
    // this.router.navigate(['product'], {
    //   queryParams: {
    //     token: this.token
    //   }});
    this.router.navigate(['detail']);
    // TODO;
  }
  isClosed(vmCode) {
    this.appService.getDataOpen(this.appProperties.isClosedUrl, {vmCode: vmCode}).subscribe(
      data2 => {
        console.log(data2);
        if (data2.data === false) {
          // alert('您的门还未关闭！优水到家提醒您,为了您账号资金安全,提水后请随手关门');
          this.isVisibleOpen = true;
          // this.isClosed(urlParse(window.location.search)['vmCode']);
        } else if (data2.data === true) {
          this.isVisibleOpen = false;
          // this.router.navigate(['detail']);
          alert('谢谢惠顾,祝您生活愉快');
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  login(titleTpl, contentTpl, footerTpl) {
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
  openOk() {
    this.isVisibleOpen = true;
    this.isClosed(urlParse(window.location.search)['vmCode']);
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
}
