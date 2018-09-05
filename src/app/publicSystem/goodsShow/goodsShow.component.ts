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
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    if (urlParse(window.location.search)['flag'] === 1 || urlParse(window.location.search)['flag'] === '1') {
      this.more = true;
      this.single = false;
    } else {
      this.more = false;
      this.single = true;
    }
  }
}
