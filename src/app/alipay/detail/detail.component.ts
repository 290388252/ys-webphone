import {AfterViewChecked, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewChecked {
  public queryParamsTitle: string;
  public title: string;
  public list;
  public totalPrice;
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParamsTitle = queryParams.title;
      if (this.queryParamsTitle === '1') {
        this.title = '我的订单';
      } else if (this.queryParamsTitle === '2') {
        this.title = '已付款订单';
      } else if (this.queryParamsTitle === '3') {
        this.title = '未付款订单';
      }
    });
  }

  ngOnInit() {
    if (document.documentElement.offsetHeight > document.getElementById('content').clientHeight) {
      document.getElementById('containers').style.height = document.documentElement.offsetHeight + 'px';
    } else {
      document.getElementById('containers').style.height = document.getElementById('content').clientHeight + 50 + 'px';
    }
    // console.log(document.getElementById('content').clientHeight);
    if (this.title === '我的订单') {
      this.appService.postAliData(this.appProperties.aliFindAllUserOrderUrl, {}).subscribe(
        data => {
          console.log(data);
          if (data.status === 1) {
            this.list = data.returnObject;
            this.list.forEach((item => {
              this.totalPrice += item.totalPrice;
            }));
            console.log(this.totalPrice);
          } else if (data.status !== 1) {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else if (this.title === '已付款订单') {
      this.appService.postAliData(this.appProperties.aliFindPayOrderUrl, {}).subscribe(
        data => {
          console.log(data);
          if (data.status === 1) {
            this.list = data.returnObject;
            this.list.forEach((item => {
              this.totalPrice += item.totalPrice;
            }));
          } else if (data.status !== 1) {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else if (this.title === '未付款订单') {
      this.appService.postAliData(this.appProperties.aliFindNotPayOrderUrl, {}).subscribe(
        data => {
          console.log(data);
          if (data.status === 1) {
            this.list = data.returnObject;
            this.list.forEach((item => {
              this.totalPrice += item.totalPrice;
            }));
          } else if (data.status !== 1) {
            alert(data.message);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  nzSpan(flag) {
    return flag !== '支付失败' ? 24 : 20;
  }
  pay(item) {
    window.location.href = this.appProperties.alipayWapPayUrl + item.orderId + '&vmCode=' + sessionStorage.getItem('vmCode');
  }
  ngAfterViewChecked(): void {
    if (document.documentElement.offsetHeight > document.getElementById('content').clientHeight) {
      document.getElementById('containers').style.height = document.documentElement.offsetHeight + 'px';
    } else if (document.documentElement.offsetHeight < document.getElementById('content').clientHeight) {
      document.getElementById('containers').style.height = document.getElementById('content').clientHeight + 70 + 'px';
    }
  }
}
