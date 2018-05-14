import { Component , OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NzModalService} from 'ng-zorro-antd';
import {AddMainModule} from './addMain.module';

@Component({
  selector: 'app-main',
  templateUrl: './addMain.component.html',
  styleUrls: ['./addMain.component.css']
})
export class AddMainComponent implements OnInit {
  public indexList: Array<object>;
  public isVisible = false;
  private token: string;
  private wayNumber: number;
  public isVisibleOpen = false;
  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {}
  ngOnInit() {
    this.getInitData();
    console.log(this.urlParse(window.location.search)['token']);
  }
  getInitData() {
    this.appService.getData(this.appProperties.indexListUrl, {vmCode: this.urlParse(window.location.search)['vmCode']}).subscribe(
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
  openDoor(item, titleTpl, contentTpl, footerTpl) {
    // this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl).subscribe(
    //   data => {
    //     console.log(data);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
    } else {
      this.appService.getDataOpen(this.appProperties.indexOpenDoor,
        {vmCode: this.urlParse(window.location.search)['vmCode'], way: item.wayNumber}, this.token).subscribe(
        data => {
          console.log(data);
          if (data.code === 0) {
            // alert('优水到家提醒您,为了您账号资金安全,提水后请随手关门');
            // this.isClosed(this.urlParse(window.location.search)['vmCode'], titleTpl, contentTpl, footerTpl);
            this.isVisibleOpen = true;
          } else if (data.code === -1) {
          } else if (data.code === -87) {
            window.location.href = this.appProperties.followWechatSubscription;
          } else if (data.code === -88) {
            alert('您有未支付订单请点击我的订单支付完毕再进行购水！');
          } else if (data.code === -89) {
            alert('门已开，请误点击多次！');
          } else if (data.code === -90) {
            this.appService.getDataOpen(this.appProperties.nonePassWordPayUrl).subscribe(
              data1 => {
                window.location.href =  data1;
                sessionStorage.setItem('open', '1');
                sessionStorage.setItem('wayNumber', item.wayNumber);
              },
              error1 => {
                console.log(error1);
              }
            );
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  // product() {
  //   this.router.navigate(['product'], {
  //     queryParams: {
  //       token: this.token
  //     }});
  //   // TODO;
  // }
  isClosed(vmCode) {
    this.appService.getDataOpen(this.appProperties.isClosedUrl, {vmCode: vmCode}).subscribe(
      data2 => {
        if (data2.data === false) {
          this.isVisibleOpen = true;
          this.isClosed(this.urlParse(window.location.search)['vmCode']);
        } else if (data2.data === true) {
          this.isVisibleOpen = false;
          this.router.navigate(['detail']);
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  openOk() {
    this.isClosed(this.urlParse(window.location.search)['vmCode']);
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
    if (obj['token']) {
      this.token = obj['token'];
    }
    return obj;
  }
}
