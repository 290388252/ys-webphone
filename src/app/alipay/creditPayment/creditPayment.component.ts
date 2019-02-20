import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {urlParse} from '../../utils/util';

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
    /**
     * 2019-02-16
     * @author YanChao
     * 获取支付宝授权
     */
    this.appService.getAliData(this.appProperties.aliGetCreditWithheldUrl + urlParse(window.location.href)['vmCode']).subscribe(
      data => {
        document.write(data.returnObject);
      },
      error => {
        console.log(error);
      }
    );
  }
}
