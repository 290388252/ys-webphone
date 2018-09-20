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
  public isVisibleOpenG = false;
  public isVisibleOpenDetail = false;
  public token: string;
  // public radioValue: string;
  public count = 1;
  public restartTimes = 15; // 重启时间（秒）
  public times = 1;
  public num: number;
  public num2: number;
  public wayNo: number;
  public wayIndex: number;
  public temperature: number;
  public selectGoods = '0';
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
  public visible = false;
  public isDisabledOne = false;
  public isDisabledTwo = true;
  // public beginvolValue;
  public volValue;
  // public endVole;
  public fullNum;
  public numDetail;
  public costPrice;
  public price;
  public weight;
  public oneWeight;
  public itemName;

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
        const newWlhUrl = '?state=/vmLogin?vmCode=' + urlParse(window.location.search)['vmCode'] + '&payType=2';
        this.appService.getData(this.appProperties.aliVmGetUserIdUrl + '?vmCode=' + urlParse(window.location.search)['vmCode'], '').subscribe(
          data2 => {
            console.log(data2);
            window.location.href = data2.returnObject + newWlhUrl;
          },
          error2 => {
            console.log(error2);
          }
        );
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

  selectDoor(num) {
    console.log(num === 3);
    if (num === 3) {
      this.wayIndex = 0;
    } else if (num === 4) {
      this.wayIndex = 1;
    } else if (num === 1) {
      this.wayIndex = 2;
    } else if (num === 2) {
      this.wayIndex = 3;
    } else if (num === 5) {
      this.wayIndex = 4;
    }
    if (this.indexList[this.wayIndex]['wayItemList'].length > 1) {
      this.visible = true;
    } else {
      this.visible = false;
    }
    console.log(this.wayIndex);
    this.isVisibleOpenG = true;
  }

  selectGood(num) {
    console.log(num);
    switch (num) {
      case 0:
        this.isDisabledOne = false;
        this.isDisabledTwo = true;
        this.num2 = null;
        break;
      case 1:
        this.isDisabledOne = true;
        this.isDisabledTwo = false;
        this.num = null;
        break;
    }
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
            }
          });
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
          if (data.data.wayInfo.length <= 4) {
            this.isFourDoor = true;
            this.isFiveDoor = false;
            this.isSixDoor = false;
            this.indexList = data.data.wayInfo;
            for (let i = 0; i < 2; i++) {
              this.indexList.unshift(this.indexList.pop());
            }
          } else if (data.data.wayInfo.length === 5) {
            this.isFourDoor = false;
            this.isFiveDoor = true;
            this.isSixDoor = false;
            this.indexList = data.data.wayInfo;
          } else if (data.data.wayInfo.length === 6) {
            this.isFourDoor = false;
            this.isFiveDoor = false;
            this.isSixDoor = true;
            this.indexList = data.data.wayInfo;
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

  detail(item, event, weight) {
    event.stopPropagation();
    console.log(item);
    // costPrice: 6.88
    // endTime: "2018-05-05 00:00:00"
    // fullNum: 24
    // hot: 1
    // itemId: "4572"
    // itemName: "怡宝纯净水4.5L"
    // num: 0
    // pic: "20180601_084447.png"
    // price: 8.2
    // state: 30001
    // wayId: "44332"
    // wayNumber: 3
    // weight: 0
    this.itemName = item.itemName;
    this.costPrice = item.costPrice;
    this.weight = weight;
    this.oneWeight = item.weight;
    this.fullNum = item.fullNum;
    this.numDetail = item.num;
    this.isVisibleOpenDetail = true;
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
              // this.isVisibleOpen = true;
              this.router.navigate(['goodsShow'], {
                queryParams: {
                  vmCode: urlParse(window.location.search)['vmCode'],
                  flag: 4,
                }});
            } else if (data.code === 4) {
              this.router.navigate(['goodsShow'], {
                queryParams: {
                  vmCode: urlParse(window.location.search)['vmCode'],
                  flag: 3,
                }});
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
      {'volume': this.volValue, 'vmCode': urlParse(window.location.search)['vmCode']}, this.token).subscribe(
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
          // this.isVisibleOpen = true;
          this.router.navigate(['goodsShow'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              flag: 4,
            }});
        }  else if (data.code === 4) {
          this.router.navigate(['goodsShow'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              flag: 3,
            }});
        } else {
          alert(data.msg);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // 是否校准开门（是）
  yes() {
    this.count++;
    console.log(this.count);
    console.log(this.wayNo);
    console.log(this.times);
    console.log(this.num);
    console.log(this.wayIndex);
    console.log(this.selectGoods);
    let num;
    if (this.isDisabledOne) {
      num = this.num2;
    } else if (this.isDisabledTwo) {
      num = this.num;
    }
    this.num = undefined;
    this.num2 = undefined;
    this.appService.postAliData(this.appProperties.reviseUrl,
      {
        vmCode: urlParse(window.location.search)['vmCode'],
        wayNum: this.wayNo,
        times: this.times,
        num: num,
        orderNumber: this.indexList[this.wayIndex]['wayItemList'][this.selectGoods].orderNumber
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
      this.getInitData();
      this.count = 1;
      this.isVisibleOpenDoor = false;
    }
  }

  // 是否开门（否）
  no() {
    this.isVisibleOpenDoor = false;
    // console.log(this.radioValue);
  }

  closeDetail() {
    this.isVisibleOpenDetail = false;
  }

  // 是否关门按钮事件（是）
  openOk() {
    this.isClosed(urlParse(window.location.search)['vmCode']);
  }

  openOkG() {
    if (this.isDisabledOne) {
      if (this.num2 === undefined) {
        alert('请输入桶数');
      } else {
        this.yes();
        if (this.times === 2) {
          this.isVisibleOpenG = false;
        }
      }
    } else if (this.isDisabledTwo) {
      if (this.num === undefined) {
        alert('请输入桶数');
      } else {
        this.yes();
        if (this.times === 2) {
          this.isVisibleOpenG = false;
        }
      }
    }
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

  turnImg(item) {
    let img;
    if (item.length > 1) {
      img = this.img + item[1].pic;
    } else {
      img = '';
    }
    return img;
  }

  turn(item, flag) {
    let text;
    if (item.length > 1) {
      switch (flag) {
        case 'img':
          text = this.img + item[1].pic;
          break;
        case 'num':
          text = item[1].num;
          break;
        default:
          text = '';
      }
    }
    return text;
  }
}
