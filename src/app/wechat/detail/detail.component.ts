import {Component, DoCheck, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, DoCheck {
  public queryParamsTitle: string;
  public title: string;
  public totalPrice: string;
  mark;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
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
      document.getElementById('containers').style.height = document.getElementById('content').clientHeight - 70 + 'px';
    }
    console.log(document.getElementById('content').clientHeight);
  }
  ngDoCheck(): void {
  }
}
