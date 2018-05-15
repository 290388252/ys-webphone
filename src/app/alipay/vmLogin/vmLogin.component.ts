import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppProperties} from '../../app.properties';
import {AppService} from '../../app-service';

@Component({
  selector: 'app-carousel',
  templateUrl: './vmLogin.component.html',
  styleUrls: ['./vmLogin.component.css']
})
export class VmLoginComponent implements OnInit {
  validateForm: FormGroup;
  public validateValue = true;
  public phone: number;
  public buttonNoTouch = false;
  public truePhone = true;
  public times = 60;
  private openId: string;
  private phoneValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (!/^1[34578]\d{9}$/.test(control.value)) {
      return { error: true, phoneForm: true };
    }
  }
  constructor(private fb: FormBuilder,
              private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      phoneForm: [ null, [ this.phoneValidator ] ],
      password: [ null, [ Validators.required ] ]
    });
    this.openId = this.getOpenId();
    console.log(this.getOpenId());
  }
  _submitForm() {
    for (const i in this.validateForm.controls) {
      if (true) {
        this.validateForm.controls[i].markAsDirty();
      }
    }
    // this.router.navigate(['vmDetail']);
    if (this.validateForm.controls.phoneForm.value !== null && this.validateForm.controls.password.value !== null) {
      this.appService.getData(this.appProperties.aliLoginVerifyOperateUrl,
        {vmCode: this.urlParse(window.location.href)['vmCode'],
          phone: this.validateForm.controls.phoneForm.value,
          code: this.validateForm.controls.password.value
        }).subscribe(
        data => {
          if (data.code !== 0) {
            alert('登陆失败');
          } else if (data.code === 0) {
            console.log(data);
            const exp = new Date();
            exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
            document.cookie = 'token=' + data.data.token + ';expires=' + exp.toUTCString();
            this.router.navigate(['aliAddMain']);
            // this.router.navigate(['main'], {queryParams: {'token': data.data.token}});
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      alert('请输入账号密码');
    }
  }
  getOpenId() {
    const url = window.location.href.toString();
    const arrUrl = url.split('?');
    let openId: string;
    if (arrUrl[1] !== undefined) {
      const firstArr = arrUrl[1].split('&')[0];
      openId =  firstArr.substring(firstArr.indexOf('=') + 1, firstArr.length);
    } else {
      openId = '';
    }
    return openId;
  }
  focusCode() {
    document.getElementById('containers').style.height = (document.documentElement.offsetWidth + 50) + 'px';
  }
  sendCode(e: TouchEvent) {
    e.preventDefault();
    if (/^1[34578]\d{9}$/.test(this.phone.toString())) {
      this.appService.getAliData(this.appProperties.aliSmsSendUrl, {phone: this.phone}).subscribe(
        data => {
          if (data.status !== 1) {
            alert('发送失败');
          } else {
            this.times = 60;
            this.buttonNoTouch = true;
            this.truePhone = true;
            const timer = setInterval(() => {
              this.times --;
              if (this.times <= 0) {
                this.buttonNoTouch = false;
                clearInterval(timer);
              }
            }, 1000);
            setTimeout(() => {
              this.buttonNoTouch = false;
            }, 60100);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.truePhone = false;
    }
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
