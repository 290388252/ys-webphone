import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';


@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    ProductRoutingModule,
    NgZorroAntdModule
  ],
  providers: []
})
export class ProductModule { }
