import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
    ProductRoutingModule
  ],
  providers: []
})
export class ProductModule { }
