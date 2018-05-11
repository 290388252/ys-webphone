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
  public totalPrice = 0;
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
    if (this.title === '我的订单') {
      this.postData(this.appProperties.aliFindAllUserOrderUrl);
    } else if (this.title === '已付款订单') {
      this.postData(this.appProperties.aliFindPayOrderUrl);
    } else if (this.title === '未付款订单') {
      this.postData(this.appProperties.aliFindNotPayOrderUrl);
    }
  }
  nzSpan(flag) {
    return flag !== '支付失败' ? 24 : 20;
  }
  postData(url) {
    this.appService.postAliData(url, {}).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          this.list = data.returnObject;
          this.list.forEach((item => {
            this.totalPrice += item.price;
            this.totalPrice = Math.floor(this.totalPrice * 100) / 100;
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
