import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
  private token: string;
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {}
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.token = queryParams.token;
    });
    this.getInitData();
  }
  getInitData() {
    this.appService.getData(this.appProperties.indexListUrl, {vmCode: '1988000072'}).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          this.indexList = data.data;
        } else if (data.code === -1) {
          this.login();
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  openDoor(item) {
    console.log(this.token);
    this.appService.getData(this.appProperties.indexOpenDoor, {vmCode: '1988000072', way: item.wayNumber}, this.token).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          console.log(data.data);
        } else if (data.code === -1) {
          this.login();
          // alert('no');
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  detail() {
    this.router.navigate(['product']);
    // TODO;
  }
  login() {
    this.appService.getData(this.appProperties.wechatOauth2Url, '').subscribe(
      data => {
        console.log(data);
        let newData;
        const wlhUrl = window.location.href;
        const newWlhUrl = wlhUrl.replace(wlhUrl.substring(wlhUrl.indexOf('main'), wlhUrl.length), 'register');
        if (typeof(data.data) === 'string' && data.data.length > 0) {
          newData = data.data.replace(data.data.substring(data.data.indexOf('state=') + 6, data.data.length),
            newWlhUrl + '-' + wlhUrl);
          console.log(newData);
          window.location.href = newData;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
