import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {urlParse} from '../../utils/util';

@Component({
  selector: 'app-detail',
  templateUrl: './vmDetail.component.html',
  styleUrls: ['./vmDetail.component.css']
})
export class VmDetailComponent implements OnInit, AfterViewChecked {
  public _value = '';
  public isVisible = false;
  public isVisibleSails = false;
  public isConfirmLoading = false;
  public isConfirmLoadingSails = false;
  public vmList = [];
  public detailList = [];
  public tradeDetailList = [];
  public vmCode: string;
  public detailListLoading = true;
  public tradeDetailListLoading = true;
  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    // 获取机器列表
    this.appService.postAliData(this.appProperties.aliMachineQueryVMListUrl, '' , urlParse(window.location.search)['token']).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          this.vmList = data.returnObject;
        } else {
          alert(data.message);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  ngAfterViewChecked(): void {
  }
  // 搜索机器号
  onSearch(event: string): void {
    console.log(event);
      this.appService.postAliData(this.appProperties.aliMachineQueryVMListUrl + '?form=' + event,
        '' , urlParse(window.location.search)['token']).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          this.vmList = data.returnObject;
        } else {
          alert(data.message);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  // 机器详情查看
  detail(vmCode) {
    this.isVisible = true;
    this.vmCode = vmCode;
      this.appService.postAliData(this.appProperties.aliMachineQueryDetailUrl + '?vmCode=' + vmCode,
        '' , urlParse(window.location.search)['token']).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          this.detailList = data.returnObject;
          this.detailListLoading = false;
        } else {
          alert('查询失败无数据');
          this.isVisible = false;
          this.detailListLoading = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  // 销售情况详情
  sails(vmCode) {
    const yesterday = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2);
    const tomorrow = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    let yesterdayMonth;
    let yesterdayDate;
    let tomorrowMonth;
    let tomorrowDate;
    if ((yesterday.getMonth() + 1).toString().length === 1) {
      yesterdayMonth = '0' + (yesterday.getMonth() + 1).toString();
    } else {
      yesterdayMonth = (yesterday.getMonth() + 1).toString();
    }
    if ((yesterday.getDate()).toString().length === 1) {
      yesterdayDate = '0' + (yesterday.getDate()).toString();
    } else {
      yesterdayDate = (yesterday.getDate()).toString();
    }
    if ((tomorrow.getMonth() + 1).toString().length === 1) {
      tomorrowMonth = '0' + (tomorrow.getMonth() + 1).toString();
    } else {
      tomorrowMonth = (tomorrow.getMonth() + 1).toString();
    }
    if ((tomorrow.getDate()).toString().length === 1) {
      tomorrowDate = '0' + (tomorrow.getDate()).toString();
    } else {
      tomorrowDate = (tomorrow.getDate()).toString();
    }
    const startDate = `${yesterday.getFullYear()}-${yesterdayMonth}-${yesterdayDate}`;
    const endDate = `${tomorrow.getFullYear()}-${tomorrowMonth}-${tomorrowDate}`;
    this.isVisibleSails = true;
      this.appService.postAliData(this.appProperties.aliMachineQueryTradeDetailUrl,
        {
            vmCode: vmCode,
            startDate: startDate,
            endDate: endDate
         } , urlParse(window.location.search)['token']).subscribe(
      data => {
        console.log(data);
        if (data.status === 1) {
          this.tradeDetailList = data.returnObject;
          this.tradeDetailListLoading = false;
        } else {
          alert('查询失败无数据');
          this.isVisibleSails = false;
          this.tradeDetailListLoading = true;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  // 销售情况详情
  handleOk(): void {
    this.isVisible = false;
    this.isConfirmLoading = false;
    this.detailListLoading = true;
    this.detailList = [];
  }
  // 销售情况详情
  handleCancel(): void {
    this.isVisible = false;
    this.detailListLoading = true;
    this.detailList = [];
  }
  // 销售情况详情打开
  handleOkSails(): void {
    this.isVisibleSails = false;
    this.isConfirmLoadingSails = false;
    this.tradeDetailListLoading = true;
    this.tradeDetailList = [];
  }
  // 销售情况详情关闭
  handleCancelSails(): void {
    this.isVisibleSails = false;
    this.tradeDetailListLoading = true;
    this.tradeDetailList = [];
  }
}
