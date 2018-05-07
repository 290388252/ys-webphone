import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditPaymentRoutingModule } from './creditPayment-routing.module';
import { CreditPaymentComponent } from './creditPayment.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PopoverModule } from 'ngx-bootstrap';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

@NgModule({
    imports: [
        CommonModule,
        CreditPaymentRoutingModule,
        NgZorroAntdModule,
        PopoverModule.forRoot()
    ],
    declarations: [CreditPaymentComponent],
    providers: [AppService, AppProperties],
})
export class CreditPaymentModule {}
