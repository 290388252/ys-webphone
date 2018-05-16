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
  }
  focusCode() {
    document.getElementById('containers').style.height = (document.documentElement.offsetWidth + 50) + 'px';
  }
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
        }).subscribe(
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
  sendCode(e: TouchEvent) {
    e.preventDefault();
    if (checkPhone(this.phone)) {
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
}
