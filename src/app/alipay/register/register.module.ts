import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import {AppProperties} from '../../app.properties';
import {AppService} from '../../app-service';


@NgModule({
  declarations: [
    RegisterComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    RegisterRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  providers: [AppService, AppProperties]
})
export class RegisterModule { }
