import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  private openId;
  _submitForm() {
    for (const i in this.validateForm.controls) {
      if (true) {
        this.validateForm.controls[i].markAsDirty();
      }
    }
    if (this.validateForm.controls.userName.value !== null && this.validateForm.controls.password.value !== null) {
      this.router.navigate(['main']);
      console.log(this.validateForm.controls.userName.value);
      console.log(this.validateForm.controls.password.value);
    } else {
      console.log('请输入手机号和密码');
    }
  }
  constructor(private fb: FormBuilder, private router: Router, private appProperties: AppProperties, private appService: AppService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ]
    });
    this.openId = this.getUrlParaOpenId();
    console.log(this.openId);
  }
  checkPhone(phone) {
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      console.log('手机号有误');
      return false;
    }
  }
  getUrlParaOpenId() {
    const url = window.location.href.toString();
    const arrUrl = url.split('?');
    const firstArr = arrUrl[1].split('&')[0];
    const openId =  firstArr.substring(firstArr.indexOf('=') + 1, firstArr.length);
    return openId;
  }
  sendCode(e: TouchEvent) {
    e.preventDefault();
    this.checkPhone(this.phone);
    this.buttonNoTouch = true;
    setTimeout(() => {
      this.buttonNoTouch = false;
    }, 60000);
  }
}
