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
    console.log(this.urlParse(window.location.search)['adminToken']);
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
  openDoor(item) {
    if (this.urlParse(window.location.search)['adminToken'] === null
      || this.urlParse(window.location.search)['adminToken'] === undefined
      || this.urlParse(window.location.search)['adminToken'] === 'undefined') {
      alert('登陆超时,请重新登陆');
      this.router.navigate(['vmLogin']);
    } else {
      this.appService.getDataOpen(this.appProperties.addOpendoorUrl,
        {vmCode: this.urlParse(window.location.search)['vmCode'], way: item.wayNumber},
        this.urlParse(window.location.search)['adminToken']).subscribe(
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
          this.getInitData();
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
    return obj;
  }
}
