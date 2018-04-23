import { Component , OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../app-service';
import {AppProperties} from '../app.properties';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public indexList: Array<object>;
  public openId: string;
  constructor(private router: Router, private appProperties: AppProperties, private appService: AppService) {}
  ngOnInit() {
    this.getInitData();
  }
  getInitData() {
    this.appService.getData(this.appProperties.indexListUrl, {vmCode: '1988000072'}).subscribe(
      data => {
        if (data.status === 1) {
          this.indexList = data.returnObject;
        } else {
          alert('登陆失败');
        }
      },
      error => {
        console.log(error);
      }
    );
    this.appService.getData(this.appProperties.wechatOauth2Url, '').subscribe(
      data => {
        console.log(data);
        console.log(window.location.href);
        // this.appService.getData(data, '').subscribe(
        //   data2 => {
        //     this.openId = data2;
        //     console.log(this.openId);
        //   },
        //   error2 => {
        //     console.log(error2);
        //   }
        // );
      },
      error => {
        console.log(error);
      }
    );
  }
  open(item) {
    console.log(item);
  }
  detail() {
    this.router.navigate(['product']);
    // TODO;
  }
}
