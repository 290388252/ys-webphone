import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

@Component({
  selector: 'app-detail',
  templateUrl: './creditPayment.component.html',
  styleUrls: ['./creditPayment.component.css']
})
export class CreditPaymentComponent implements OnInit {
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    this.appService.getAliData(this.appProperties.aliGetCreditWithheldUrl + this.urlParse(window.location.href)['vmCode']).subscribe(
      data => {
        document.write(data.returnObject);
      },
      error => {
        console.log(error);
      }
    );
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
    return obj;
  }
}
