import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppProperties} from '../../app.properties';
import {AppService} from '../../app-service';
import {urlParse} from '../../utils/util';

@Component({
  selector: 'app-carousel',
  templateUrl: './vmDetailLogin.component.html',
  styleUrls: ['./vmDetailLogin.component.css']
})
export class VmDetailLoginComponent implements OnInit {
  validateForm: FormGroup;
  public validateValue = true;
  public phone: number;
  public buttonNoTouch = false;
  public truePhone = true;
  public times = 60;
  constructor(private fb: FormBuilder,
              private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      phoneForm: [ null, [ Validators.required  ] ],
      password: [ null, [ Validators.required ] ]
    });
  }
  // 表单提交
  _submitForm() {
    for (const i in this.validateForm.controls) {
      if (true) {
        this.validateForm.controls[i].markAsDirty();
      }
    }
    if (this.validateForm.controls.phoneForm.value !== null && this.validateForm.controls.password.value !== null) {
      this.appService.getData(this.appProperties.adminLoginUrl,
        {
          phone: this.validateForm.controls.phoneForm.value,
          smsCode: this.validateForm.controls.password.value,
          payType: urlParse(window.location.search)['payType'],
          openId: urlParse(window.location.search)['openId']
        }).subscribe(
        data => {
          if (data.code !== 0) {
            alert(data.msg);
          } else if (data.code === 0) {
            console.log(data);
            const exp = new Date();
            exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 3);
            document.cookie = 'adminToken=' + data.data + ';expired=' + exp.toUTCString();
            if (data.msg !== 'success') {
              alert(data.msg);
            }
            this.router.navigate(['vmDetail'], {
              queryParams: {
                token: data.data
              }});
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
  // 手机端打开小键盘获取焦点是改变背景高度px
  focusCode() {
    document.getElementById('containers').style.height = (document.documentElement.offsetWidth + 80) + 'px';
  }
  // 发送验证码
  sendCode(e: TouchEvent) {
    e.preventDefault();
    if (/^1[345678]\d{9}$/.test(this.phone.toString())) {
      this.appService.postData(this.appProperties.smsSendUrl, {phone: this.phone}).subscribe(
        data => {
          console.log(data);
          if (data.code !== 0) {
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
}
