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
    this.appService.getAliData(this.appProperties.aliGetCreditWithheldUrl).subscribe(
      data => {
        document.write(data.returnObject);
      },
      error => {
        console.log(error);
      }
    );
  }
}
