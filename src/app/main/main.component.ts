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
        console.log(data);
        if (data.code === 0) {
          this.indexList = data.data;
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
        let newData;
        if (typeof(data.data) === 'string' && data.data.length > 0) {
          newData = data.data.replace(data.data.substring(data.data.indexOf('state=') + 6, data.data.length),
            'http://localhost:4300/register');
          console.log(newData);
          window.location.href = newData;
        }
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
