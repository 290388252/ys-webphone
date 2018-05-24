import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NzModalService} from 'ng-zorro-antd';
import {urlParse} from '../../utils/util';
import {AddMainModule} from './addMain.module';

@Component({
  selector: 'app-main',
  templateUrl: './addMain.component.html',
  styleUrls: ['./addMain.component.css']
})
export class AddMainComponent implements OnInit {
  public indexList: Array<object>;
  private wayNumber: number;
  public isVisibleOpen = false;
  public token: string;
  // public img = 'http://lenvar-resource-products.oss-cn-shenzhen.aliyuncs.com/';
  public img = 'http://47.106.92.82:6663/files/';
  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {}
  ngOnInit() {
    this.getCookies();
    this.getInitData();
    if (this.token === null
      || this.token === undefined
      || this.token === 'undefined') {
      if (urlParse(window.location.search)['payType'] === '1') {
        this.appService.getData(this.appProperties.adminOauth2Url, '').subscribe(
          data => {
            console.log(data);
            let newData;
            const newWlhUrl = '/vmLogin?vmCode=' + urlParse(window.location.search)['vmCode'] + '&payType=1';
            if (typeof(data.data) === 'string' && data.data.length > 0) {
              newData = data.data.replace(data.data.substring(data.data.indexOf('state=') + 6, data.data.length),
                newWlhUrl);
              console.log(newData);
              window.location.href = newData;
            }
          },
          error => {
            console.log(error);
          }
        );
      } else if (urlParse(window.location.search)['payType'] === '2') {
        const newWlhUrl = '?state=/vmLogin?vmCode=' + urlParse(window.location.search)['vmCode'] + '&payType=2';
        window.location.href = this.appProperties.aliVmGetUserIdUrl + newWlhUrl;
        // this.router.navigate(['vmLogin'], {
        //   queryParams: {
        //     vmCode: urlParse(window.location.search)['vmCode'],
        //     payType: 2
        //   }});
      }
    }
  }
  getInitData() {
    this.appService.getData(this.appProperties.indexListUrl, {vmCode: urlParse(window.location.search)['vmCode'], type: 2}).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          this.indexList = data.data;
          for (let i = 0; i < 2; i++) {
            this.indexList.unshift(this.indexList.pop());
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  openDoor(item) {
    if (this.token === null
      || this.token === undefined
      || this.token === 'undefined') {
      alert('登陆超时,请重新登陆');
      this.router.navigate(['vmLogin'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode']
        }});
    } else {
      this.appService.getDataOpen(this.appProperties.addOpendoorUrl,
        {vmCode: urlParse(window.location.search)['vmCode'], way: item.wayNumber},
        this.token).subscribe(
        data => {
          console.log(data);
          if (data.code === 0) {
            this.isVisibleOpen = true;
          } else if (data.code === -1) {
            this.router.navigate(['vmLogin']);
          } else if (data.code === -89) {
            alert('门已开，请误点击多次！');
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  isClosed(vmCode) {
    this.appService.getDataOpen(this.appProperties.isClosedUrl, {vmCode: vmCode}).subscribe(
      data2 => {
        if (data2.data === false) {
          this.isVisibleOpen = true;
          // this.isClosed(urlParse(window.location.search)['vmCode']);
        } else if (data2.data === true) {
          this.getInitData();
          this.isVisibleOpen = false;
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  resetNum() {
    console.log(urlParse(window.location.search)['vmCode']);
    this.appService.postAliData(this.appProperties.orderResetWaysNumUrl + urlParse(window.location.search)['vmCode'],
      '', this.token).subscribe(
      data => {
        console.log(data);
        alert(data.msg);
        this.getInitData();
      },
      error => {
        console.log(error);
      }
    );
  }
  openOk() {
    this.isClosed(urlParse(window.location.search)['vmCode']);
  }
  getCookies () {
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      const strCookie = document.cookie;
      const arrCookie = strCookie.split(';');
      for (let i = 0; i < arrCookie.length; i++) {
        const arr = arrCookie[i].split('=');
        if (arr[0].trim() === 'adminToken') {
          this.token = arr[1];
        }
      }
    }
  }
}
