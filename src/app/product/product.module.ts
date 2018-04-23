import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';


@NgModule({
    imports: [
      FormsModule,
      HttpClientModule,
      CommonModule,
      ProductRoutingModule,
      NgZorroAntdModule,
      ReactiveFormsModule
    ],
    declarations: [ProductComponent]
})
export class ProductModule {}
