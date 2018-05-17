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
  public img = 'http://lenvar-resource-products.oss-cn-shenzhen.aliyuncs.com/';
  public isVisibleOpen = false;
  constructor(private router: Router,
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
    sessionStorage.setItem('vmCode', urlParse(window.location.search)['vmCode']);
  }
  getInitData() {
    this.appService.getData(this.appProperties.aliIndexListUrl, {vmCode: urlParse(window.location.search)['vmCode']}).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          if (!data.willGo) {
            this.indexList = data.returnObject;
            for (let i = 0; i < 2; i++) {
              this.indexList.unshift(this.indexList.pop());
            }
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
  openDoor(item) {
      this.appService.postAliData(this.appProperties.aliOpenDoorUrl,
        {vmCode: urlParse(window.location.search)['vmCode'], openType: 1, doorNO: item.doorNO}).subscribe(
        data => {
          if (data.status === 1) {
            this.isVisibleOpen = true;
            console.log(data);
          } else {
            console.log(data);
            alert(data.message);
            if (data.willGo) {
              window.location.href = data.returnObject;
            }
          }
        },
        error => {
          console.log(error);
        }
      );
  }
  openOk() {
    this.isClosed(urlParse(window.location.search)['vmCode']);
  }
  isClosed(vmCode) {
    this.appService.getDataOpen(this.appProperties.isClosedUrl, {vmCode: vmCode}).subscribe(
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
  isAttention() {
    this.appService.getAliData(this.appProperties.aliBusinessIsAttentionUrl).subscribe(
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
  vmLogin() {
    this.router.navigate(['addMain'], {
      queryParams: {
        vmCode: urlParse(window.location.search)['vmCode']
      }});
    // TODO;
  }
  detail() {
    this.router.navigate(['aliDetail'], {
      queryParams: {
        title: 1
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
