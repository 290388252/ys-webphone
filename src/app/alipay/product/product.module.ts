import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import {PopoverModule} from 'ngx-bootstrap';


@NgModule({
    imports: [
      FormsModule,
      HttpClientModule,
      CommonModule,
      ProductRoutingModule,
      NgZorroAntdModule,
      ReactiveFormsModule,
      ProductRoutingModule,
      NgZorroAntdModule,
      PopoverModule.forRoot()
    ],
    declarations: [ProductComponent]
})
export class ProductModule {}
