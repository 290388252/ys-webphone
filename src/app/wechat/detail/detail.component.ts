import {Component, AfterViewChecked, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit , AfterViewChecked {
  public queryParamsTitle: string;
  public queryParamsToken: string;
  public title: string;
  public totalPrice: string;
  public list;
  public unList;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appProperties: AppProperties,
  private appService: AppService) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.queryParamsTitle = queryParams.title;
      this.queryParamsToken = queryParams.token;
      if (this.queryParamsTitle === '1') {
        this.title = '我的订单';
      } else if (this.queryParamsTitle === '2') {
        this.title = '已付款订单';
      } else if (this.queryParamsTitle === '3') {
        this.title = '未付款订单';
      }
    });
    this.list = [];
    this.unList = [];
  }

  ngOnInit() {
    if (this.title === '我的订单') {
      this.appService.getDataOpen(this.appProperties.findAllUserOrderUrl, {}, this.queryParamsToken).subscribe(
        data => {
          console.log(data);
          if (data.status === 1) {
            this.list = data.returnObject;
            this.list.forEach((item => {
              this.totalPrice += item.price;
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
      this.appService.getDataOpen(this.appProperties.findAllUserOrderUrl, {}, this.queryParamsToken).subscribe(
        data => {
          console.log(data);
          if (data.status === 1) {
            data.returnObject.forEach((item => {
              this.totalPrice += item.price;
              if (item.state !== '10002') {
                this.list.push(item);
              }
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
      this.appService.getDataOpen(this.appProperties.findAllUserOrderUrl, {}, this.queryParamsToken).subscribe(
        data => {
          console.log(data);
          if (data.status === 1) {
            data.returnObject.forEach((item => {
              this.totalPrice += item.price;
              if (item.state === '10002') {
                this.list.push(item);
              }
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
  ngAfterViewChecked(): void {
    if (document.documentElement.offsetHeight > document.getElementById('content').clientHeight) {
      document.getElementById('containers').style.height = document.documentElement.offsetHeight + 'px';
    } else if (document.documentElement.offsetHeight < document.getElementById('content').clientHeight) {
      document.getElementById('containers').style.height = document.getElementById('content').clientHeight + 70 + 'px';
    }
  }
  nzSpan(flag) {
    return flag !== '10002' ? 24 : 20;
  }
  pay(item) {
    this.appService.getDataOpen(this.appProperties.orderUnifiedOrderUrl, {orderId: item.id}, this.queryParamsToken).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
}
