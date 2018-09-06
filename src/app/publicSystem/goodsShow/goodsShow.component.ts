import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {urlParse} from '../../utils/util';

@Component({
  selector: 'app-detail',
  templateUrl: './goodsShow.component.html',
  styleUrls: ['./goodsShow.component.css']
})
export class GoodsShowComponent implements OnInit {
  public more: boolean;
  public single: boolean;
  public close: boolean;
  public token: string;
  public goodsList = [];
  public totolPrice = 0;
  private timeInterval;
  public img = this.appProperties.imgUrl;
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    this.getCookies();
    console.log(urlParse(window.location.search)['vmCode']);
    console.log(urlParse(window.location.search)['flag']);
    console.log(this.token);
    const _this = this;
    if (urlParse(window.location.search)['flag'] === 1 || urlParse(window.location.search)['flag'] === '1') {
      this.timeInterval = setInterval(() => {
        // _this.totolPrice = null;
        _this.isClosed();
      }, 1000);
      this.more = true;
      this.close = true;
      this.single = false;
    } else {
      this.timeInterval = setInterval(() => {
        // _this.totolPrice = null;
        _this.getData();
      }, 1000);
      this.more = false;
      this.close = true;
      this.single = true;
    }
  }
  turnText(num) {
    let text;
    if (num < 0) {
      text = `拿取数量${-num}`;
    }
    return text;
  }
  exit() {
    window.close();
  }
  getData() {
    this.appService.getAliData(this.appProperties.machineControlUrl,
      {vmCode:  urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data => {
        console.log(data);
        this.goodsList = data.data;
        this.isClosed();
        // this.goodsList.forEach(item => {
        //   if (item.changeNum < 0) {
        //     this.totolPrice += item.price;
        //   }
        // });
        // console.log(this.totolPrice);
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  // 检测是否关门
  isClosed() {
    this.appService.getDataOpen(this.appProperties.isClosedUrl,
      {vmCode: urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data2 => {
        console.log(data2);
        if (data2.data === false) {
          // alert('您的门还未关闭！优水到家提醒您,为了您账号资金安全,提水后请随手关门');
          if (urlParse(window.location.search)['flag'] === 1 || urlParse(window.location.search)['flag'] === '1') {
            this.more = true;
            this.close = true;
            this.single = false;
          } else {
            this.more = false;
            this.close = true;
            this.single = true;
          }
        } else if (data2.data === true) {
          this.close = false;
          this.more = true;
          this.single = true;
          clearInterval(this.timeInterval);
          // this.router.navigate(['detail']);
          // alert('广州优水到家工程感谢你的惠顾,系统将从零钱或者银行卡中自动扣取本次购买费用。');
        }
      },
      error2 => {
        console.log(error2);
      }
    );
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
