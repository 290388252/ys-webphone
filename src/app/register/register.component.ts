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
  public validateValue = true;
  _submitForm() {
    // if (this.validateForm.controls.userName.value !== null && this.validateForm.controls.password.value !== null) {
    //   this.validateValue = true;
    //   console.log(this.validateValue);
    // } else {
    //   this.validateValue = false;
    //   console.log(this.validateValue);
    // }
    for (const i in this.validateForm.controls) {
      // if (true) {
        this.validateForm.controls[i].markAsDirty();
      // }
    }
    if (this.validateForm.controls.userName.value !== null && this.validateForm.controls.password.value) {
      this.router.navigate(['main']);
      console.log(this.validateForm.controls.userName.value);
      console.log(this.validateForm.controls.password.value);
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

  register() {
    this.router.navigate(['main']);
  }
}
