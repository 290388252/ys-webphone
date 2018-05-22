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
export class VmDetailComponent implements OnInit, AfterViewChecked{
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
    this.appService.postAliData(this.appProperties.aliMachineQueryVMListUrl, '' , 'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJvdmFoY2IiLCJzdWIiOiJ7XCJpZFwiOlwiNTY5MVwiLFwib3BlbklkXCI6XCJvS2taeTA0cVZxWXBkMk1HQTVSdUxLYUtxZ1prXCIsXCJwYXlUeXBlXCI6XCIxXCIsXCJ0eXBlXCI6MX0iLCJleHAiOjE1Mjc0NjkzMTIsImlhdCI6MTUyNjg2NDUxMn0.UP5Gve9w1t27-V97ZYAukL8ZhE9QXYtwb8q36gTbhKWlzuqArUe4U0Mp1Y_NHzJZqYYys3u3xa7wkZMtIDIQTA').subscribe(
    // this.appService.postAliData(this.appProperties.aliMachineQueryVMListUrl, '' , urlParse(window.location.search)['token']).subscribe(
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
  onSearch(event: string): void {
    console.log(event);
    this.appService.postAliData(this.appProperties.aliMachineQueryVMListUrl + '?form=' + event,
      '',
      'eyJhbGciOiJIUzUxMiJ9.eyJyYW' +
      '5kb21LZXkiOiJvdmFoY2IiLCJzdWIiOiJ7XCJpZFwiOlwiNTY5MVwiLFwib3' +
      'BlbklkXCI6XCJvS2taeTA0cVZxWXBkMk1HQTVSdUxLYUtxZ1prXCIsXCJwYXlUeXBlXCI' +
      '6XCIxXCIsXCJ0eXBlXCI6MX0iLCJleHAiOjE1Mjc0NjkzMTIsImlhdCI6MTUyNjg2NDUxMn0.U' +
      'P5Gve9w1t27-V97ZYAukL8ZhE9QXYtwb8q36gTbhKWlzuqArUe4U0Mp1Y_NHzJZqYYys3u3xa7wkZMtIDIQTA').subscribe(
      // this.appService.postAliData(this.appProperties.aliMachineQueryVMListUrl, '' , urlParse(window.location.search)['token']).subscribe(
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
  detail(vmCode) {
    this.isVisible = true;
    this.vmCode = vmCode;
    this.appService.postAliData(this.appProperties.aliMachineQueryDetailUrl + '?vmCode=' + vmCode,
      '',
      'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJvdmFoY2' +
      'IiLCJzdWIiOiJ7XCJpZFwiOlwiNTY5MVwiLFwib3BlbklkXCI6XCJvS2taeTA0c' +
      'VZxWXBkMk1HQTVSdUxLYUtxZ1prXCIsXCJwYXlUeXBlXCI6XCIxXCIsXCJ0eXBlXCI6MX0iLC' +
      'JleHAiOjE1Mjc0NjkzMTIsImlhdCI6MTUyNjg2NDUxMn0.UP5Gve9w1t27-V97ZYAuk' +
      'L8ZhE9QXYtwb8q36gTbhKWlzuqArUe4U0Mp1Y_NHzJZqYYys3u3xa7wkZMtIDIQTA').subscribe(
      // this.appService.postAliData(this.appProperties.aliMachineQueryVMListUrl, {vmCode: vmCode} , urlParse(window.location.search)['token']).subscribe(
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
  sails(vmCode) {
    const yesterday = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2);
    const tomorrow = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    const startDate = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
    const endDate = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;
    this.isVisibleSails = true;
    this.appService.postAliData(this.appProperties.aliMachineQueryTradeDetailUrl,
      {
        vmCode: vmCode,
        startDate: startDate,
        endDate: endDate
      },
      'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJvdmFoY2' +
      'IiLCJzdWIiOiJ7XCJpZFwiOlwiNTY5MVwiLFwib3BlbklkXCI6XCJvS2taeTA0c' +
      'VZxWXBkMk1HQTVSdUxLYUtxZ1prXCIsXCJwYXlUeXBlXCI6XCIxXCIsXCJ0eXBlXCI6MX0iLC' +
      'JleHAiOjE1Mjc0NjkzMTIsImlhdCI6MTUyNjg2NDUxMn0.UP5Gve9w1t27-V97ZYAuk' +
      'L8ZhE9QXYtwb8q36gTbhKWlzuqArUe4U0Mp1Y_NHzJZqYYys3u3xa7wkZMtIDIQTA').subscribe(
      // this.appService.postAliData(this.appProperties.aliMachineQueryVMListUrl, {vmCode: vmCode} , urlParse(window.location.search)['token']).subscribe(
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
  handleOk(): void {
    this.isVisible = false;
    this.isConfirmLoading = false;
    this.detailListLoading = true;
    this.detailList = [];
  }

  handleCancel(): void {
    this.isVisible = false;
    this.detailListLoading = true;
    this.detailList = [];
  }
  handleOkSails(): void {
    this.isVisibleSails = false;
    this.isConfirmLoadingSails = false;
    this.tradeDetailListLoading = true;
    this.tradeDetailList = [];
  }

  handleCancelSails(): void {
    this.isVisibleSails = false;
    this.tradeDetailListLoading = true;
    this.tradeDetailList = [];
  }
}
