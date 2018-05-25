import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { VmDetailLoginComponent } from './vmDetailLogin.component';
import { VmDetailLoginRoutingModule } from './vmDetailLogin-routing.module';
import {AppProperties} from '../../app.properties';
import {AppService} from '../../app-service';


@NgModule({
  declarations: [
    VmDetailLoginComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    VmDetailLoginRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  providers: [AppService, AppProperties]
})
export class VmDetailLoginModule { }
