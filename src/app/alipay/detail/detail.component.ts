import {AfterViewChecked, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {urlParse} from '../../utils/util';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewChecked {
  public token: string;
  public id: any;
  public list;
  public couponEffectiveList;
  public totalPrice = 0; // 总金额
  public detailVisible = false; // 订单详情是否开启
  public doorNO = '无';
  public num = '无';
  public openedTime = '无';
  public closedTime = '无';
  public imgUrl;
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    this.imgUrl = this.appProperties.imgUrl;
    this.id = urlParse(window.location.search)['flag'];
    // 获取cookies的token值
    this.getCookies();
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      this.token = urlParse(window.location.search)['token'];
    }
    this.getData(this.appProperties.aliFindAllUserOrderUrl);
    this.appService.postAliData(this.appProperties.couponAvailable + '?vmCode=' + urlParse(window.location.search)['vmCode'],
      '', this.token).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          this.couponEffectiveList = data.returnObject;
        } else if (data.status !== 1) {
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  nzSpan(flag) {
    return flag !== '支付失败' ? 24 : 20;
  }
  // 查询订单条目
  getData(url) {
    this.appService.getDataOpen(url, {}, this.token).subscribe(
      data => {
        console.log(data);
        if (data) {
          this.list = data;
          this.list.forEach((item => {
            this.totalPrice += item.price;
            this.totalPrice = Math.floor(this.totalPrice * 100) / 100;
          }));
        } else {
          alert(data.message);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  getItem(list, name) {
    if (list.length > 1) {
      return list[1][name];
    }
  }
  // 支付宝支付接口调用
  pay(item) {
    window.location.href = this.appProperties.alipayWapPayUrl
      + item.orderId
      + '&vmCode=' + sessionStorage.getItem('vmCode')
      + '&token=' + this.token;
  }
  // DOM元素检测时修改高度px
  ngAfterViewChecked(): void {
    if (document.documentElement.offsetHeight > document.getElementById('content').clientHeight) {
      document.getElementById('containers').style.height = document.documentElement.offsetHeight + 'px';
    } else if (document.documentElement.offsetHeight < document.getElementById('content').clientHeight) {
      document.getElementById('containers').style.height = document.getElementById('content').clientHeight + 70 + 'px';
    }
  }
  // 查询订单详情数据
  detail(ptCode) {
    this.detailVisible = true;
    this.appService.postDetailData(this.appProperties.findMachineHistoryUrl,
      {
        ptCode: ptCode
      }).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          console.log(data.returnObject);
          this.doorNO = data.returnObject.doorNO;
          this.num = data.returnObject.num;
          this.openedTime = data.returnObject.openedTime;
          this.closedTime = data.returnObject.closedTime;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  // 关闭订单详情窗口
  closeDetail() {
    this.detailVisible = false;
  }
  // 获取token值
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
  toDate(date) {
    return new Date(date.substring(0, 10)).getFullYear() + '-' + (new Date(date.substring(0, 10)).getMonth() + 1) + '-' + new Date(date.substring(0, 10)).getDate();
  }
}
