import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
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
  public loadingVisible = false;
  public isVisibleOpenDoor = false;
  public token: string;
  // public radioValue: string;
  public count = 1;
  public restartTimes = 15; // 重启时间（秒）
  public times = 1;
  public num: number;
  public wayNo: number;
  public temperature: number;
  // public img = 'http://lenvar-resource-products.oss-cn-shenzhen.aliyuncs.com/';
  // public img = 'http://119.23.233.123:6662/ys_admin/files/';
  public img = this.appProperties.imgUrl;
  public clickMore = false;
  public isFourDoor = false; // 四门
  public isFiveDoor = false; // 五门
  public isSixDoor = false; // liu门
  // public myVol = false;
  // public isConfirmLoading = false;
  public isVisible = false;
  public isOkLoading = false;
  // public beginvolValue;
  public volValue;
  // public endVole;

  constructor(private router: Router,
              private modalService: NzModalService,
              private activatedRoute: ActivatedRoute,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    // 数据初始化
    this.getCookies();
    // 数据初始化
    this.getInitData();
    console.log('123');
    if (this.token === null
      || this.token === undefined
      || this.token === 'undefined') {
      if (urlParse(window.location.search)['payType'] === '1') {
        // 微信授权登陆验证
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
        // 支付宝授权登陆验证
        this.appService.getData(this.appProperties.aliVmGetUserIdUrl, {vmCode: urlParse(window.location.search)['vmCode']}).subscribe(
          data2 => {
            console.log(data2);
            window.location.href = data2.returnObject;
          },
          error2 => {
            console.log(error2);
          }
        );
        // const newWlhUrl = '?state=/vmLogin?vmCode=' + urlParse(window.location.search)['vmCode'] + '&payType=2';
        // window.location.href = this.appProperties.aliVmGetUserIdUrl + newWlhUrl;
        // this.router.navigate(['vmLogin'], {
        //   queryParams: {
        //     vmCode: urlParse(window.location.search)['vmCode'],
        //     payType: 2
        //   }});
      }
    } else {
      if (urlParse(window.location.search)['payType'] === '1') {
        this.canReplenish('main');
      } else if (urlParse(window.location.search)['payType'] === '2') {
        this.canReplenish('aliMain');
      }
    }
    this.volValue = 0;
  }
  canReplenish(url) {
    this.appService.getDataOpen(this.appProperties.canReplenishUrl,
      {vmCode: urlParse(window.location.search)['vmCode']}, this.token).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
        } else {
          alert(data.msg);
          this.router.navigate([url], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode']
            }});
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }
  // 初始化选水界面
  getInitData() {
    this.appService.getData(this.appProperties.indexListUrl, {
      vmCode: urlParse(window.location.search)['vmCode'],
      type: 2
    }).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          if (data.data.wayItem.length <= 4) {
            this.isFourDoor = true;
            this.isFiveDoor = false;
            this.isSixDoor = false;
            this.indexList = data.data.wayItem;
            for (let i = 0; i < 2; i++) {
              this.indexList.unshift(this.indexList.pop());
            }
          } else if (data.data.wayItem.length === 5) {
            this.isFourDoor = false;
            this.isFiveDoor = true;
            this.isSixDoor = false;
            this.indexList = data.data.wayItem;
          } else if (data.data.wayItem.length === 6) {
            this.isFourDoor = false;
            this.isFiveDoor = false;
            this.isSixDoor = true;
            this.indexList = data.data.wayItem;
          }
          console.log(this.indexList);
          this.temperature = data.data.temperature;
        //   let volvalue = data.data.volume;
        //   // this.beginvolValue = data.data.volume;
        //   console.log('ok1');
        //   console.log(volvalue);
        //   console.log(volvalue === '99');
        //   if(volvalue === undefined) {
        //     volvalue = 0;
        //   }
        //   this.beginvolValue = volvalue;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // 开门接口
  openDoor(item) {
    if (this.token === null
      || this.token === undefined
      || this.token === 'undefined') {
      alert('登陆超时,请重新登陆');
      this.router.navigate(['vmLogin'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode']
        }
      });
    } else {
      if (this.clickMore) {
        alert('亲,服务器还没反应过来,请勿再点击');
      } else {
        this.clickMore = true;
        this.appService.getDataOpen(this.appProperties.addOpendoorUrl,
          {vmCode: urlParse(window.location.search)['vmCode'], way: item.wayNumber},
          this.token).subscribe(
          data => {
            console.log(data);
            this.clickMore = false;
            if (data.code === 0) {
              this.isVisibleOpen = true;
            } else if (data.code === -1) {
              this.router.navigate(['vmLogin']);
            } else if (data.code === -89) {
              alert('门已开，请误点击多次！');
            } else {
              alert(data.msg);
            }
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  // 检测是否已关门
  isClosed(vmCode) {
    this.appService.getDataOpen(this.appProperties.isClosedUrl, {vmCode: vmCode}, this.token).subscribe(
      data2 => {
        if (data2.data === false) {
          this.isVisibleOpen = true;
          // this.isClosed(urlParse(window.location.search)['vmCode']);
        } else if (data2.data === true) {
          this.getInitData();
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
          this.isVisibleOpen = false;
        }
      },
      error2 => {
        console.log(error2);
      }
    );
  }

  // 校准数量
  resetNum() {
    console.log(urlParse(window.location.search)['vmCode']);
    this.appService.postAliData(this.appProperties.orderResetWaysNumUrl + urlParse(window.location.search)['vmCode'],
      '', this.token).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          alert('成功');
          this.getInitData();
        } else {
          alert(data.msg);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // 调节音量
  adjustVol(): void {
    this.isVisible = true;
    // this.endVole = this.beginvolValue;
    // if(this.endVole === undefined || this.endVole === '无' || this.endVole === '99') {
    //   this.endVole = 0;
    // }
    // this.volValue = this.endVole;
    this.volValue = 0;
    console.log('vmcode');
    console.log(urlParse(window.location.search)['vmCode']);
    console.log(this.volValue);
  }

  // 音量提交
  myVolOk(): void {
    console.log('123');
    this.appService.getAliData(this.appProperties.volumeUrl,
      {'volume': this.volValue, 'vmCode': urlParse(window.location.search)['vmCode']}, this.token ).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          alert(data.msg);
          this.getInitData();
          this.isOkLoading = true;
          this.isVisible = false;
          // this.isConfirmLoading = true;
          // setTimeout(() => {
          //   this.myVol = false;
          //   this.isConfirmLoading = false;
          // }, 3000);
        } else if (data.code === -87) {
          alert(data.msg);
        } else if (data.code === -1) {
          alert(data.msg);
        }

      },
      error => {
        console.log(error);
      }
    );

  }

// 音量模态框关闭
  myVolCancel(): void {
    // if (this.endVole === '99' || this.endVole === '无') {
    //   this.beginvolValue = this.endVole;
    // }
    this.isVisible = false;
  }

  // 校准重量
  resetWeight() {
    this.wayNo = undefined;
    this.num = undefined;
    this.times = 1;
    this.count = 1;
    this.isVisibleOpenDoor = true;
  }

  // 机器重启
  reStart() {
    this.appService.postAliData(this.appProperties.restartUrl + urlParse(window.location.search)['vmCode'],
      '', this.token).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          this.loadingVisible = true;
          const timer = setInterval(() => {
            this.restartTimes--;
            if (this.restartTimes <= 0) {
              this.loadingVisible = false;
              clearInterval(timer);
            }
          }, 1000);
        } else if (data.code === -1) {
          this.router.navigate(['vmLogin']);
        } else {
          alert(data.msg);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  openAll() {
    let way;
    if (this.isFourDoor) {
      way = '1,2,3,4';
    } else {
      way = '1,2,3,4,5';
    }
    this.appService.postAliData(this.appProperties.operateOpendoorUrl
      + '?vmCode=' + urlParse(window.location.search)['vmCode']
      + '&wayNum=' + way,
      '', this.token).subscribe(
      data => {
        console.log(data);
        if (data.code === -1) {
          this.router.navigate(['vmLogin']);
        } else if (data.code === 0) {
          this.isVisibleOpen = true;
        } else {
          alert(data.msg);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // 是否开门（是）
  yes() {
    this.count++;
    console.log(this.wayNo);
    console.log(this.times);
    console.log(this.num);
    this.appService.postAliData(this.appProperties.reviseUrl,
      {
        vmCode: urlParse(window.location.search)['vmCode'],
        wayNum: this.wayNo,
        times: this.times,
        num: this.num
      }, this.token).subscribe(
      data => {
        console.log(data);
        if (data.code === 0) {
          this.times = 2;
        } else if (data.code === -89) {
          alert(data.msg);
          this.times = 2;
          this.isVisibleOpenDoor = true;
        } else if (data.code === -1) {
          this.router.navigate(['vmLogin']);
        }
      },
      error => {
        console.log(error);
      }
    );
    if (this.count >= 3) {
      this.count = 1;
      this.isVisibleOpenDoor = false;
    }
  }

  // 是否开门（否）
  no() {
    // this.isVisibleOpenDoor = false;
    // console.log(this.radioValue);
  }

  // 是否关门按钮事件（是）
  openOk() {
    this.isClosed(urlParse(window.location.search)['vmCode']);
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
