import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public indexList: Array<object>;
  public isVisible = false;
  private token: string;
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
    console.log(this.urlParse(window.location.search)['vmCode']);
  }
  getInitData() {
    this.appService.getData(this.appProperties.indexListUrl, {vmCode: this.urlParse(window.location.search)['vmCode']}).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          this.indexList = data.data;
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
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      alert('点击确认登陆');
      this.login(titleTpl, contentTpl, footerTpl);
    } else {
      this.appService.getDataOpen(this.appProperties.indexOpenDoor,
        {vmCode: this.urlParse(window.location.search)['vmCode'], way: item.wayNumber}, this.token).subscribe(
        data => {
          console.log(data);
          if (data.code === 0) {
            console.log(data.data);
          } else if (data.code === -1) {
            this.login(titleTpl, contentTpl, footerTpl);
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
  vmLogin() {
    this.router.navigate(['vmLogin']);
  }
  detail() {
    this.router.navigate(['product'], {
      queryParams: {
        token: this.token
      }});
    // TODO;
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
        const wlhUrl = '/main?vmCode=' + this.urlParse(window.location.href)['vmCode'];
        const newWlhUrl = '/register?vmCode=' + this.urlParse(window.location.href)['vmCode'];
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
  urlParse(url) {
    const obj = {};
    const reg = /[?&][^?&]+=[^?&]+/g;
    const arr = url.match(reg);

    if (arr) {
      arr.forEach(function (item) {
        const tempArr = item.substring(1).split('=');
        const key = decodeURIComponent(tempArr[0]);
        const val = decodeURIComponent(tempArr[1]);
        obj[key] = val;
      });
    }
    if (obj['token']) {
      this.token = obj['token'];
      const exp = new Date();
      exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
      document.cookie = 'token=' + this.token + ';expires=' + exp.toUTCString();
    }
    return obj;
  }
}
