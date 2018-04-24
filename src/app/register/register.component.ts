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
  private openId: string;
  private phoneValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (!/^1[34578]\d{9}$/.test(control.value)) {
      return { error: true, phoneForm: true };
    }
  }
  constructor(private fb: FormBuilder, private router: Router, private appProperties: AppProperties, private appService: AppService) {}

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
      this.router.navigate(['main']);
      console.log(this.validateForm.controls.phoneForm.value);
      console.log(this.validateForm.controls.password.value);
    } else {
      console.log('请输入手机号和密码');
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
      this.buttonNoTouch = true;
      this.truePhone = true;
      this.appService.postData(this.appProperties.smsSend, {phone: this.phone}).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
      setTimeout(() => {
        this.buttonNoTouch = false;
      }, 60000);
    } else {
      this.truePhone = false;
    }
  }
}
