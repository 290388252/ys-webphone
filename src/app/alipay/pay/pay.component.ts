import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';


import {urlParse} from '../../utils/util';
@Component({
  selector: 'app-NotPage',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayPageComponent implements OnInit {
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }
  ngOnInit() {
    this.appService.getDataAliPay('http://120.79.74.231:6662/ys_sms/alipay/balanceAliPay', {
      payCode: urlParse(window.location.search)['payCode'],
      vmCode: urlParse(window.location.search)['vmCode']
    }, urlParse(window.location.search)['token']).subscribe(
      data4 => {
        console.log(data4);
        // document.write(data4.toString());
        const div = document.createElement('div');
        div.innerHTML = data4;
        document.body.appendChild(div);
        document.forms[0].submit();
      },
      error => {
        console.log(error);
      }
    );
  }
}
