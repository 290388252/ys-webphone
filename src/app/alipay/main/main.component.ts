import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {urlParse} from '../../utils/util';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public indexList: Array<object>;
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
    this.getCookies();
    console.log(this.token);
    if (urlParse(window.location.search)['token']) {
      this.token = urlParse(window.location.search)['token'];
      const exp = new Date();
      exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
      document.cookie = 'token=' + this.token + ';expires=' + exp.toUTCString();
    }
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
    this.appService.getAliData(this.appProperties.aliIndexListUrl,
      {vmCode: urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          if (!data.willGo) {
            if (data.returnObject.length <= 4) {
              this.isFourDoor = true;
              this.isFiveDoor = false;
              this.indexList = data.returnObject;
              for (let i = 0; i < 2; i++) {
                this.indexList.unshift(this.indexList.pop());
              }
            } else if (data.returnObject.length === 5) {
              this.isFourDoor = false;
              this.isFiveDoor = true;
              this.indexList = data.returnObject;
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
  // 开门接口
  openDoor(item) {
    this.item = item;
    if (item.num <= 0) {
      alert('水已经卖完无法开门');
    } else {
      this.isVisibleOpenDoor = true;
    }
  }
  openOk() {
    this.isClosed(urlParse(window.location.search)['vmCode']);
  }
  closeCoupon() {
  }
  // 是否开门（是）
  yesOpenDoor() {
    this.isVisibleOpenDoor = false;
      if (this.clickMore) {
        alert('亲,服务器还没反应过来,请勿再点击');
      } else {
        this.clickMore = true;
        this.appService.postAliData(this.appProperties.aliOpenDoorUrl,
          {vmCode: urlParse(window.location.search)['vmCode'], openType: 1, doorNO: this.item.doorNO}, this.token).subscribe(
          data => {
            console.log(data);
            this.clickMore = false;
            if (data.status === 1) {
              this.isVisibleOpen = true;
            } else if (data.status === -1) {
              window.location.href = this.appProperties.aliGetUserIdUrl + urlParse(window.location.search)['vmCode'];
            } else {
             if (data.code === -1) {
                window.location.href = this.appProperties.aliGetUserIdUrl + urlParse(window.location.search)['vmCode'];
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
  // 补货人员登陆界面入口
  vmLogin() {
    this.router.navigate(['addMain'], {
      queryParams: {
        vmCode: urlParse(window.location.search)['vmCode'],
        payType: 2
      }});
    // TODO;
  }
  // 查看用户订单
  detail() {
    this.router.navigate(['aliDetail'], {
      queryParams: {
        title: 1,
        vmCode: urlParse(window.location.search)['vmCode']
      }});
    // TODO;
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
