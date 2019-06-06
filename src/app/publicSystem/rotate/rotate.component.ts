import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

declare const WeixinJSBridge: any;

import * as $ from 'jquery';
import {urlParse} from '../../utils/util';
import {toNumber} from 'ngx-bootstrap/timepicker/timepicker.utils';

@Component({
  selector: 'app-rotate',
  templateUrl: './rotate.component.html',
  styleUrls: ['./rotate.component.css']
})
export class RotateComponent implements OnInit {
  private info = [];
  public clickNum: any;
  public integral: any;
  public vmCode = urlParse(window.location.search)['vmCode'];
  public flag = urlParse(window.location.search)['flag'];
  public gameId;
  public token;
  public prizeLength;
  public prize;
  public isVisible = false;
  public choiceAddress = false;
  public lotteryId;
  public isAdd;

  constructor(private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    if (urlParse(window.location.search)['token'] === undefined) {
      this.getCookies();
    } else {
      this.token = urlParse(window.location.search)['token'];
      const exp = new Date();
      exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
      document.cookie = 'token=' + this.token + ';expires=' + exp.toUTCString();
    }
    // this.token = 'eyJhbGciOiJIUzUxMiJ9.eyJyYW5kb21LZXkiOiJianU2b3giLCJzdWIiOiJ7XCJpZFwiOlwiMzUwNzVcIixcIm9wZW5JZFwiOlwib0trWnkwMUZqZVFwQ0JBblI2U1FkUlBJdVRnMFwiLFwicGF5VHlwZVwiOlwiMVwiLFwidHlwZVwiOjF9IiwiZXhwIjoxNTU0NDYzMjQ5LCJpYXQiOjE1NTE4NzEyNDl9.5C75HhgUksPq4jzMNZUn3v0W9JkPWTqlPEYU3k2Rr1vAPg9jkT0pqSUOO43WjPBpJDyxq4UHWcow5VY9lfR25g';
    this.getData();
    this.getInit();
  }
  /**
   * 2019-03-06
   * @author mzy
   * 获取游戏奖品list
   */
  getData() {
    this.appService.postAliData(this.appProperties.gameGetGamePrize + '?vmCode=' + this.vmCode, '', this.token).subscribe(
      data => {
        console.log(data);
        if (data.returnObject.gamePrize) {
          this.prizeLength = data.returnObject.gamePrize.length;
          console.log(this.prizeLength);
        }
        data.returnObject.gamePrize.forEach((item) => {
          this.info.push(item.name);
        });
        this.gameId = data.returnObject.game.id;
        this.clickNum = data.returnObject.game.times;
        this.integral = data.returnObject.integral;
        console.log(this.gameId);
        this.getRotate(this.info, this.appProperties, this.appService, this.token);
      },
      error2 => {
        console.log(error2);
      }
    );

  }

  /**
   * 2019-03-02
   * @author mzy
   * 获取token
   */
  getCookies() {
    if (this.token === null || this.token === undefined || this.token === 'undefined') {
      const strCookie = document.cookie;
      const arrCookie = strCookie.split(';');
      for (let i = 0; i < arrCookie.length; i++) {
        const arr = arrCookie[i].split('=');
        if (arr[0].trim() === 'token') {
          this.token = arr[1];
        }
      }
    }
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 获取旋转角度
   */
  getRotate(info, appProperties, appService, token) {
    // 旋转角度
    let angles;
    // 旋转次数
    let rotNum = 0;
    // 中奖公告
    let notice = null;
    // 转盘初始化
    // ec5f5f   ffcc41  378eef
    const color = ['#ec5f5f', '#ffcc41', 'rgba(0,0,0,0)', '#fff', 'white', '#258dff'];
    // const info = ['谢谢参与', '    10', '   10', '  50', '  100', '   40', '    1', '   20'];
    // const info1 = [' ', '       ', '       ', '      ', '      ', '      ', '      ', '      '];
    // const info1 = ['再接再厉', '      元', '      元', '     元', '     元', '     元', '     元', '     元'];
    canvasRun();
    const _this = this;
    $('#tupBtn').bind('click', function () {
      console.log(_this.clickNum);
      appService.postAliData(appProperties.gameLottery + '?gameId=' + _this.gameId, '', token).subscribe(
        data => {
          console.log(data);
          if (data.status === 81) {
            alert(data.message);
          } else {
            runCup(data.returnObject.indexOf);
            _this.clickNum = data.returnObject.times;
            _this.lotteryId = data.returnObject.id;
            // 转盘旋转过程“开始抽奖”按钮无法点击
            $('#tupBtn').attr('disabled');
            // 旋转次数加一
            rotNum = rotNum + 1;
            if (toNumber(data.status) === 66) {
              _this.choiceAddress = true;
            }
            // “开始抽奖”按钮无法点击恢复点击
            setTimeout(function () {
              // alert(notice);
              document.getElementsByClassName('ant-modal-footer')[0]['style'].cssText = 'text-align: center;';
              document.getElementsByClassName('ant-modal-close')[0]['style'].cssText = 'display: none;';
              _this.isVisible = true;
              _this.prize = data.message;
              _this.integral = data.returnObject.integral;
              // _this.getData();
              $('#tupBtn').removeAttr('disabled');
            }, 6000);
          }
        },
        error2 => {
          console.log(error2);
        }
      );
    });

    /**
     * 2019-02-16
     * @author YanChao
     * 转盘旋转
     */
    function runCup(num) {
      // probability();
      // const num = Math.floor(Math.random() * (7));
      console.log(num);
      // if (toNumber(this.prizeLength) === 6) {
      //   if (num === 0) {
      //     angles = 2160 * rotNum + 1800;
      //     notice = info[0];
      //   } else if (num === 1) {
      //     angles = 2160 * rotNum + 1860;
      //     notice = info[1];
      //   } else if (num === 2) {
      //     angles = 2160 * rotNum + 1920;
      //     notice = info[2];
      //   } else if (num === 3) {
      //     angles = 2160 * rotNum + 1980;
      //     notice = info[3];
      //   } else if (num === 4) {
      //     angles = 2160 * rotNum + 2040;
      //     notice = info[4];
      //   } else if (num === 5) {
      //     angles = 2160 * rotNum + 2100;
      //     notice = info[5];
      //   }
      // } else if (toNumber(this.prizeLength) === 6) {
      //   if (num === 0) {
      //     angles = 2160 * rotNum + 1800;
      //     notice = info[0];
      //   } else if (num === 1) {
      //     angles = 2160 * rotNum + 2115;
      //     notice = info[1];
      //   } else if (num === 2) {
      //     angles = 2160 * rotNum + 2070;
      //     notice = info[2];
      //   } else if (num === 3) {
      //     angles = 2160 * rotNum + 2025;
      //     notice = info[3];
      //   } else if (num === 4) {
      //     angles = 2160 * rotNum + 1980;
      //     notice = info[4];
      //   } else if (num === 5) {
      //     angles = 2160 * rotNum + 1935;
      //     notice = info[5];
      //   } else if (num === 6) {
      //     angles = 2160 * rotNum + 1890;
      //     notice = info[6];
      //   } else if (num === 7) {
      //     angles = 2160 * rotNum + 1845;
      //     notice = info[7];
      //   }
      // }
      angles = 2160 * rotNum + 1800 + 360 / info.length * (info.length - num);
      notice = info[num];
      // 概率
      const degValue = 'rotate(' + angles + 'deg' + ')';
      console.log(degValue);
      $('#myCanvas').css('-o-transform', degValue);           // Opera
      $('#myCanvas').css('-ms-transform', degValue);          // IE浏览器
      $('#myCanvas').css('-moz-transform', degValue);         // Firefox
      $('#myCanvas').css('-webkit-transform', degValue);      // Chrome和Safari
      $('#myCanvas').css('transform', degValue);
    }

    /**
     * 2019-02-16
     * @author YanChao
     * 绘制转盘
     */
    function canvasRun() {
      const canvas = document.getElementById('myCanvas');
      const canvas01 = document.getElementById('myCanvas01');
      const canvas03 = document.getElementById('myCanvas03');
      const canvas02 = document.getElementById('myCanvas02');
      const ctx = canvas['getContext']('2d');
      const ctx1 = canvas01['getContext']('2d');
      const ctx3 = canvas03['getContext']('2d');
      const ctx2 = canvas02['getContext']('2d');
      createCircle();
      createCirText();
      initPoint();

      /**
       * 2019-02-16
       * @author YanChao
       * 外圆
       */
      function createCircle() {
        // let startAngle = 0; // 扇形的开始弧度
        // let endAngle = 0; // 扇形的终止弧度
        // // 画一个8等份扇形组成的圆形
        // for (let i = 0; i < 6; i++) {
        //   startAngle = Math.PI * (i / 3 - 1 / 6);
        //   endAngle = startAngle + Math.PI * (1 / 3);
        //   ctx.save();
        //   ctx.beginPath();
        //   ctx.arc(150, 150, 100, startAngle, endAngle, false);
        //   ctx.lineWidth = 120;
        //   if (i % 2 === 0) {
        //     ctx.strokeStyle = color[0];
        //   } else {
        //     ctx.strokeStyle = color[1];
        //   }
        //   ctx.stroke();
        //   ctx.restore();
        // }
        let startAngle = 0; // 扇形的开始弧度
        let endAngle = 0; // 扇形的终止弧度
        // 画一个等份扇形组成的圆形
        for (let i = 0; i < info.length; i++) {
          // startAngle = Math.PI * (i / (info.length / 2) - 2 / info.length);
          if (toNumber(info.length) === 8) {
            startAngle = Math.PI * (i / (info.length / 2) - 1 / info.length);
          } else if (toNumber(info.length) === 6) {
            startAngle = Math.PI * (i / (info.length / 2) - 2 / info.length);
          }
          endAngle = startAngle + Math.PI * (1 / (info.length / 2));
          ctx.save(); // 保存备份
          ctx.beginPath(); // 绘制两条线
          // ctx.rotate(i * step);
          ctx.arc(150, 150, 100, startAngle, endAngle, false); // 绘制圆
          ctx.lineWidth = 120;
          if (i % 2 === 0) { // 绘制颜色
            ctx.strokeStyle = color[1];
          } else {
            ctx.strokeStyle = color[0];
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      /**
       * 2019-02-16
       * @author YanChao
       * 各奖项
       */
      function createCirText() {
        // ctx.textAlign = 'start';
        // ctx.textBaseline = 'middle';
        // ctx.fillStyle = color[3];
        // const step = 2 * Math.PI / 6;
        // for (let i = 0; i < 6; i++) {
        //   ctx.save();
        //   ctx.beginPath();
        //   // 位移到圆心，下面需要围绕圆心旋转
        //   ctx.translate(150, 150);
        //   ctx.rotate(i * step);
        //   ctx.font = ' 20px Microsoft YaHei';
        //   ctx.fillStyle = color[3];
        //   // ctx.fillText(info[i], -20, -75, 40);
        //   ctx.fillText(info[i], -30, -115, 60);
        //   ctx.font = ' 16px Microsoft YaHei';
        //   // ctx.fillText(info1[i], -15, -48, 40);
        //   // ctx.fillText(info1[i], -30, -95, 60);
        //   ctx.closePath();
        //   ctx.restore();
        // }
        ctx.textAlign = 'start';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = color[3];
        const step = 2 * Math.PI / info.length;
        for (let i = 0; i < info.length; i++) {
          ctx.save();
          ctx.beginPath();
          ctx.translate(150, 150);
          ctx.rotate(i * step);
          ctx.font = ' 20px SimHei YaHei ';
          ctx.fillStyle = color[3];
          ctx.fillText(info[i], -30, -100, 60); // 书写转盘文字
          ctx.font = ' 14px SimHei YaHei ';
          ctx.closePath();
          ctx.restore();
        }
      }

      function initPoint() {
        // 箭头指针
        ctx1.beginPath();
        // ctx1.moveTo(100, 40);
        // ctx1.lineTo(90, 75);
        // ctx1.lineTo(110, 75);
        // ctx1.lineTo(100, 40);

        ctx1.moveTo(100, 24);
        ctx1.lineTo(90, 62);
        ctx1.lineTo(110, 62);
        ctx1.lineTo(100, 24);
        ctx1.fillStyle = color[5];
        ctx1.fill();
        ctx1.closePath();
        // 中间小圆
        ctx3.beginPath();
        // ctx3.arc(100, 100, 28, 0, Math.PI * 2, false);
        ctx3.arc(100, 100, 40, 0, Math.PI * 2, false);
        ctx3.fillStyle = color[5];
        ctx3.fill();
        ctx3.closePath();

        ctx3.beginPath();
        // ctx3.arc(100, 100, 28, 0, Math.PI * 2, false);
        ctx3.arc(100, 100, 34, 0, Math.PI * 2, false);
        ctx3.fillStyle = color[3];
        ctx3.fill();
        ctx3.closePath();
        // 小圆文字
        ctx3.font = 'Bold 22px SimHei YaHei';
        ctx3.textAlign = 'start';
        ctx3.textBaseline = 'middle';
        ctx3.fillStyle = color[5];
        ctx3.beginPath();
        // ctx3.fillText('开  始', 80, 90, 40);
        //         // ctx3.fillText('抽  奖', 80, 110, 40);
        ctx3.fillText('奖', 88, 100, 40);
        ctx3.fill();
        ctx3.closePath();
        // 中间圆圈
        ctx2.beginPath();
        ctx2.arc(75, 75, 75, 0, Math.PI * 2, false);
        ctx2.fillStyle = color[2];
        ctx2.fill();
        ctx2.closePath();
      }
    }
  }

  /**
   * 2019-02-16
   * @author YanChao
   * 判断是微信登陆还是支付宝登陆
   */
  urlParse(url): object {
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

  close() {
    WeixinJSBridge.call('closeWindow');
  }
  /**
   * 2019-03-06
   * @author mzy
   * 返回首页
   */
  goTo() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i)) {
      if (ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
        if (this.flag === 3 || this.flag === '3'
          || this.flag === 4 || this.flag === '4') {
          this.router.navigate(['addMain'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              token: sessionStorage.getItem('token'),
              payType: 1
            }
          });
        } else {
          // WeixinJSBridge.call('closeWindow');
          this.router.navigate(['main'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              token: sessionStorage.getItem('token'),
              close: '1'
            }
          });
        }
      }
    } else if (ua.match(/AlipayClient/i)) {
      if (ua.match(/AlipayClient/i)[0] === 'alipayclient') {
        if (this.flag === 3 || this.flag === '3'
          || this.flag === 4 || this.flag === '4') {
          this.router.navigate(['addMain'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              token: sessionStorage.getItem('token'),
              payType: 2
            }
          });
        } else {
          // window['AlipayJSBridge'].call('closeWebview');
          this.router.navigate(['aliMain'], {
            queryParams: {
              vmCode: urlParse(window.location.search)['vmCode'],
              token: sessionStorage.getItem('token'),
              close: '1'
            }
          });
        }
      }
    }
  }

  /**
   * 2019-02-15
   * @author maiziyao
   * 确认删除地址，关闭弹框
   */
  handleOk(): void {
    this.isVisible = false;
    window.location.href = `http://sms.youshuidaojia.com:9800/user?vmCode=${urlParse(window.location.search)['vmCode']}&flag=3`;
  }

  /**
   * 2019-02-15
   * @author maiziyao
   * 取消删除地址，关闭弹框
   */
  handleCancel(): void {
    this.isVisible = false;
  }

  /**
   * 2019-02-15
   * @author maiziyao
   * 填写地址
   */
  goAddress() {
    if (this.isAdd === 0) {
      this.router.navigate(['address'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode'],
          token: this.token,
          flag: urlParse(window.location.search)['flag'],
          lotteryId: this.lotteryId,
          isAdd: this.isAdd,
          selectTrue: 1
        }
      });
    } else {
      this.router.navigate(['addAddress'], {
        queryParams: {
          vmCode: urlParse(window.location.search)['vmCode'],
          token: this.token,
          flag: urlParse(window.location.search)['flag'],
          lotteryId: this.lotteryId,
          isAdd: this.isAdd,
          selectTrue: 0
        }
      });
    }

  }

  /**
   * 2019-02-15
   * @author maiziyao
   * 查询地址
   */
  getInit() {
    this.appService.postAliData(this.appProperties.addressUrl, '', this.token).subscribe(
      data => {
        console.log(data);
        // console.log(data.returnObject[0].id);
        toNumber(data.status) === 0 ? this.isAdd = 1 : this.isAdd = 0;
      },
      error => {
        console.log(error);
      }
    );
  }
  /**
   * 2019-03-06
   * @author mzy
   * 跳转到抽奖页面
   */
  toPrize() {
      this.router.navigate(['shareInfo'], {
        queryParams: {
          token: this.token,
        }
      });
    }
}
