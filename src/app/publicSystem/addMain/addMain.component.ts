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
  public img = 'http://lenvar-resource-products.oss-cn-shenzhen.aliyuncs.com/';
  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {}
  ngOnInit() {
    this.token = sessionStorage.getItem('adminToken');
    this.getInitData();
    if (this.token === null
      || this.token === undefined
      || this.token === 'undefined') {
      this.router.navigate(['vmLogin'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode']
        }});
    }
  }
  getInitData() {
    this.appService.getData(this.appProperties.indexListUrl, {vmCode: urlParse(window.location.search)['vmCode']}).subscribe(
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
          this.isClosed(urlParse(window.location.search)['vmCode']);
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
    this.appService.postData(this.appProperties.orderResetWaysNumUrl + urlParse(window.location.search)['vmCode'],
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
}
