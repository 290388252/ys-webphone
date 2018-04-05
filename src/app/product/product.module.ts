import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from "./product-routing.module";
import { ProductComponent } from './product.component';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { PopoverModule } from "ngx-bootstrap";

@NgModule({
    imports: [
        CommonModule,
        ProductRoutingModule,
        NgZorroAntdModule,
        PopoverModule.forRoot()
    ],
    declarations: [ProductComponent]
})
export class ProductModule {}
