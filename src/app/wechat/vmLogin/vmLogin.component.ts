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
  constructor(private fb: FormBuilder,
              private router: Router,
              private appProperties: AppProperties,
              private appService: AppService) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      phoneForm: [ null, [ Validators.required  ] ],
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
    this.router.navigate(['vmDetail']);
    // if (this.validateForm.controls.phoneForm.value !== null && this.validateForm.controls.password.value !== null) {
    //   this.appService.getData(this.appProperties.wechatRegisterUrl,
    //     {openId: this.openId,
    //       phone: this.validateForm.controls.phoneForm.value,
    //       smsCode: this.validateForm.controls.password.value
    //     }).subscribe(
    //     data => {
    //       if (data.code !== 0) {
    //         alert('登陆失败');
    //       } else if (data.code === 0) {
    //         console.log(data);
    //         const exp = new Date();
    //         exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
    //         document.cookie = 'token=' + data.data.token + ';expires=' + exp.toUTCString();
    //         this.router.navigate(['main']);
    //         // this.router.navigate(['main'], {queryParams: {'token': data.data.token}});
    //       }
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
    // } else {
    //   alert('请输入账号密码');
    // }
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
}
