import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppProperties} from '../../app.properties';
import {AppService} from '../../app-service';
import {getOpenId, getVmCode, checkPhone, urlParse} from '../../utils/util';
import * as $ from 'jquery';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;
  public validateValue = true;
  public phone: number;
  public buttonNoTouch = false;
  public truePhone = true;
  public times = 60;
  private openId: string;
  private phoneValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (!/^1[23456789]\d{9}$/.test(control.value)) {
      return {error: true, phoneForm: true};
    }
  };

  constructor(private fb: FormBuilder,
              private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      phoneForm: [null, [this.phoneValidator]],
      password: [null, [Validators.required]]
    });
    this.openId = getOpenId();
    console.log(getOpenId());
  }

  // 手机点击小键盘时获取焦点更改屏幕高度
  focusCode() {
    document.getElementById('containers').style.height = (document.documentElement.offsetWidth + 50) + 'px';
  }

  // 提交表单数据
  _submitForm() {
    for (const i in this.validateForm.controls) {
      if (true) {
        this.validateForm.controls[i].markAsDirty();
      }
    }
    if (this.validateForm.controls.phoneForm.value !== null && this.validateForm.controls.password.value !== null) {
      this.appService.getData(this.appProperties.wechatRegisterUrl,
        {
          openId: this.openId,
          phone: this.validateForm.controls.phoneForm.value,
          smsCode: this.validateForm.controls.password.value,
          vmCode: getVmCode()
        }).subscribe(
        data => {
          if (data.code !== 0) {
            alert('登陆失败');
          } else if (data.code === 0) {
            console.log(data);
            const exp = new Date();
            // exp.setTime(exp.getTime() + 1000 * 60 * 60);
            exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
            document.cookie = 'token=' + data.data.token + ';expires=' + exp.toUTCString();
            if (data.data.registerCoupon === 1 || data.data.registerCoupon === '1') {
              document.cookie = 'coupon=' + 0;
            } else if (data.data.registerCoupon === 2 || data.data.registerCoupon === '2') {
              document.cookie = 'coupon=' + 2;
            }
            document.cookie = 'newUser=' + 1;
            this.router.navigate(['main'], {
              queryParams: {
                vmCode: getVmCode(),
              }
            });
            // this.router.navigate(['main'], {queryParams: {'token': data.data.token}});
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

  // 发送验证码
  sendCode(e: TouchEvent) {
    e.preventDefault();
    if (checkPhone(this.phone)) {
      this.appService.postData(this.appProperties.smsSendUrl, {phone: this.phone}).subscribe(
        data => {
          if (data.code !== 0) {
            alert('发送失败');
          } else {
            this.times = 60;
            this.buttonNoTouch = true;
            this.truePhone = true;
            const timer = setInterval(() => {
              this.times--;
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
