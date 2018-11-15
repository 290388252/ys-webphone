import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {urlParse} from '../../utils/util';
import {AddGoodsModule} from './addGoods.module';

@Component({
  selector: 'app-main',
  templateUrl: './addGoods.component.html',
  styleUrls: ['./addGoods.component.css']
})
export class AddGoodsComponent implements OnInit {

  public num;
  public num2;
  public indexList;
  public wayIndex;
  public wayNo;
  public times = 1;
  public goods;
  public token;
  public count = 1;
  public disableButton = false;
  public sureButtonText = '确定';
  private saveNum = [];

  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    this.getCookies();
    this.goods = urlParse(window.location.href)['goods'];
    console.log(urlParse(window.location.href)['orderNumber']);
  }

  yes() {
    if (this.goods === 'true') {
      if (this.num === undefined || this.num2 === undefined) {
        alert('您还有数量未输入');
      } else {
        this.adjust();
      }
    } else {
      if (this.num === undefined) {
        alert('您还有数量未输入');
      } else {
        this.adjust();
      }
    }
  }

  adjust() {
    let num;
    if (this.goods === 'true') {
      if (this.times === 1) {
        this.saveNum.push(this.num);
        this.saveNum.push(this.num2);
        num = [this.num, this.num2].join(',');
        this.count++;
      } else {
        if (this.num === this.saveNum[0] || this.num2 === this.saveNum[1]) {
          alert('两次数量不可相同');
        } else {
          num = [this.num, this.num2].join(',');
          this.count++;
        }
      }
    } else {
      if (this.times === 1) {
        this.saveNum.push(this.num);
        num = this.num;
        this.count++;
      } else {
        if (this.num === this.saveNum[0] || this.num2 === this.saveNum[1]) {
          alert('两次数量不可相同');
        } else {
          num = this.num;
          this.count++;
        }
      }
    }
    this.num = undefined;
    this.num2 = undefined;
    this.times = 2;
    this.appService.postAliData(this.appProperties.reviseUrl,
      {
        vmCode: urlParse(window.location.search)['vmCode'],
        wayNum: this.wayNo,
        times: this.times,
        num: num,
        orderNumber: urlParse(window.location.href)['orderNumber']
      }, this.token).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          this.disableButton = true;
          this.sureButtonText = '正在校准请稍等...';
          setTimeout(() => {
            this.times = 2;
            this.disableButton = false;
            this.sureButtonText = '确定';
          }, 6000);
        } else if (data.code === -1) {
          this.router.navigate(['vmLogin'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode']
            }
          });
        } else if (data.code === 3) {
          alert('校准失败请重试！');
        } else {
          alert(data.msg);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  back() {
    this.router.navigate(['addMain'], {
      queryParams: {
        vmCode: urlParse(window.location.search)['vmCode'],
      }
    });
  }

  getCookies() {
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
