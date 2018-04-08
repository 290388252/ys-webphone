import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;
  public validateValue = false;
  public phone: number;
  public buttonNoTouch = false;
  _submitForm() {
    for (const i in this.validateForm.controls) {
      // if (true) {
        this.validateForm.controls[i].markAsDirty();
      // }
    }
    if (this.validateForm.controls.userName.value !== null && this.validateForm.controls.password.value !== null) {
      this.router.navigate(['main']);
      console.log(this.validateForm.controls.userName.value);
      console.log(this.validateForm.controls.password.value);
    } else {
      console.log('请输入手机号和密码');
    }
  }
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    console.log($('div'));
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ]
    });
  }
  checkPhone(phone) {
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      console.log('手机号有误');
      return false;
    } else {
      return true;
    }
  }
  sendCode(e: TouchEvent) {
    e.preventDefault();
    if (this.checkPhone(this.phone)) {
      // TODO 发送验证码接口 60秒
      this.validateValue = false;
      this.buttonNoTouch = true;
      setTimeout(() => {
        this.buttonNoTouch = false;
      }, 60000);
    } else {
      this.validateValue = true;
    }
  }
}
