import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MyproductregisterComponent } from './myproductregister.component';
import { MyproductregisterRoutingModule } from './myproductregister-routing.module';


@NgModule({
  declarations: [
    MyproductregisterComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    MyproductregisterRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class MyproductregisterModule { }
