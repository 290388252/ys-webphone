import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public indexList: Array<object>;
  private token: string;
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
    console.log(this.urlParse(window.location.search)['vmCode']);
    sessionStorage.setItem('vmCode', this.urlParse(window.location.search)['vmCode']);
  }
  getInitData() {
    this.appService.getData(this.appProperties.aliIndexListUrl, {vmCode: this.urlParse(window.location.search)['vmCode']}).subscribe(
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
        {vmCode: this.urlParse(window.location.search)['vmCode'], openType: 1, doorNO: item.doorNO}).subscribe(
        data => {
          if (data.status === 1) {
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
  vmLogin() {
    this.router.navigate(['aliVmLogin'], {
      queryParams: {
        vmCode: this.urlParse(window.location.search)['vmCode']
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
  getCookies() {
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      const strCookie = document.cookie;
      const arrCookie = strCookie.split(';');
      for (let i = 0; i < arrCookie.length; i++) {
        const arr = arrCookie[i].split('=');
        if (arr[0] === 'token') {
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
