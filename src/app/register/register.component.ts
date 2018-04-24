import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AppProperties} from '../app.properties';
import {AppService} from '../app-service';

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
    if (this.validateForm.controls.phoneForm.value !== null && this.validateForm.controls.password.value !== null) {
      this.appService.getData(this.appProperties.wechatRegisterUrl,
        {openId: this.openId,
          phone: this.validateForm.controls.phoneForm.value,
          smsCode: this.validateForm.controls.password.value
        }).subscribe(
          data => {
            if (data.code !== 0) {
              alert('登陆失败');
            } else if (data.code === 0) {
              console.log(data);
              this.router.navigate(['main'], {queryParams: {'token': data.data.token}});
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
  checkPhone(phone) {
      return /^1[34578]\d{9}$/.test(phone);
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
  sendCode(e: TouchEvent) {
    e.preventDefault();
    if (this.checkPhone(this.phone)) {
      this.appService.getData(this.appProperties.smsSendUrl, {phone: this.phone}).subscribe(
        data => {
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
