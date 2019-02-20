import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppProperties} from '../../app.properties';
import {AppService} from '../../app-service';
import {checkPhone, getVmCode} from '../../utils/util';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;
  public phone: number;
  public buttonNoTouch = false;
  public truePhone = true;
  public times = 60;
  public token: string;
  private phoneValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (!/^1[23456789]\d{9}$/.test(control.value)) {
      return { error: true, phoneForm: true };
    }
  }
  constructor(private fb: FormBuilder,
              private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {}

  ngOnInit() {
    this.getCookies();
    this.validateForm = this.fb.group({
      phoneForm: [ null, [ this.phoneValidator ] ],
      password: [ null, [ Validators.required ] ]
    });
  }
  /**
   * 2019-02-16
   * @author YanChao
   * 手机点击小键盘时获取焦点更改屏幕高度
   */
  focusCode() {
    document.getElementById('containers').style.height = (document.documentElement.offsetWidth + 50) + 'px';
  }
  /**
   * 2019-02-16
   * @author YanChao
   * 提交表单数据
   */
  _submitForm() {
    for (const i in this.validateForm.controls) {
      if (true) {
        this.validateForm.controls[i].markAsDirty();
      }
    }
    if (this.validateForm.controls.phoneForm.value !== null && this.validateForm.controls.password.value !== null) {
      this.appService.postAliData(this.appProperties.aliRegisterUrl,
        {
          phone: this.validateForm.controls.phoneForm.value,
          code: this.validateForm.controls.password.value,
          vmCode: getVmCode()
        }, this.token).subscribe(
          data => {
            if (data.status !== 1) {
              alert(data.message);
            } else if (data.status === 1) {
              console.log(data);
              if (data.willGo) {
                window.location.href = data.returnObject;
              }
            }
          },
          error => {
            console.log(error);
          }
      );
      console.log(this.validateForm.controls.phoneForm.value);
      console.log(this.validateForm.controls.password.value);
    } else {
      alert('请输入手机号码');
    }
  }
  /**
   * 2019-02-16
   * @author YanChao
   * 发送验证码
   */
  sendCode(e: TouchEvent) {
    e.preventDefault();
    if (checkPhone(this.phone)) {
      this.appService.postAliData(this.appProperties.aliSmsSendUrl, {phone: this.phone}, this.token).subscribe(
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
  /**
   * 2019-02-16
   * @author YanChao
   * 获取token
   */
  getCookies () {
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
}
