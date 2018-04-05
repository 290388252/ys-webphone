import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-myproductregister',
  templateUrl: './myproductregister.component.html',
  styleUrls: ['./myproductregister.component.css']
})
export class MyproductregisterComponent implements OnInit {
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
      console.log(this.validateForm.controls.userName.value);
      console.log(this.validateForm.controls.password.value);
      console.log('ok');
    } else {
      console.log('请输入手机号和密码');
    }
  }
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ]
    });
  }
}
