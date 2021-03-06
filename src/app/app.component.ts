import { Component , OnInit} from '@angular/core';
import {getActiveCompanyId, getVmCodes, urlParse} from './utils/util';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public curId: number;
  public footerHidden = true;
  constructor(private router: Router) {
  }
  ngOnInit(): void {
    this.router.events.subscribe((event: NavigationEnd) => {
      if (event instanceof NavigationEnd) {
        const refUrl = window.location.href;
        // refUrl.indexOf('share') !== -1 ? this.footerHidden = true : this.footerHidden = false;
      }
      });
    if (getVmCodes().includes(urlParse(window.location.search)['vmCode'])) {
      this.footerHidden = false;
    }
  }
  // 获取选中状态
  selected(flag) {
    this.curId = flag;
    if (flag === 1) {
      this.router.navigate(['main'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode'],
        }
      });
    } else if (flag === 2) {
      window.location.href = `http://sms.youshuidaojia.com:9800/coupon?vmCode=${urlParse(window.location.search)['vmCode']}&coupon=1&flag=2`;
    } else if (flag === 3) {
      window.location.href = `http://sms.youshuidaojia.com:9800/user?vmCode=${urlParse(window.location.search)['vmCode']}&flag=3`;
    } else if (flag === 4) {
      window.location.href = `http://sms.youshuidaojia.com:9800/problem?vmCode=${urlParse(window.location.search)['vmCode']}&flag=4`;
    } else if (flag === 5) {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa41aef1ebf72a4b2&redirect_uri=' +
        'http://yms.youshuidaojia.com/admin/getShopToken2&response_type=code&scope=snsapi_userinfo&state=/cMain/firstPage?vm=1-1';
    }
  }
}
