import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
declare var wx: any;
import {urlParse} from '../../utils/util';
@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  private token: string;
  public img: string;
  public customerNum: number;
  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }
  ngOnInit() {
    this.token = urlParse(window.location.search)['token'];
    if (this.token !== undefined && this.token !== '') {
      const exp = new Date();
      exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 30);
      document.cookie = 'token=' + this.token + ';expires=' + exp.toUTCString();
    }
    this.appService.postAliData(this.appProperties.tblCustomerMyInviteRewards, {}, this.token).subscribe(
      data => {
        console.log(data);
        this.customerNum = data.returnObject.length;
      },
      error => {
        console.log(error);
      }
    );
  }
  goto(val) {
    if (val === 1) {
      this.router.navigate(['shareInfo'], {
        queryParams: {
          token: this.token
        }
      });
    } else if (val === 2) {
      if (this.customerNum === 0) {
        alert('您还没有成功邀请到好友，无法查看奖励！');
      } else {
        // window.location.href = `http://localhost:81/myInviteRewards`;
        window.location.href = `http://sms.youshuidaojia.com:9800/myInviteRewards`;
      }
    }
  }
  // 判断是微信登陆还是支付宝登陆
  urlParse(url): object {
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
