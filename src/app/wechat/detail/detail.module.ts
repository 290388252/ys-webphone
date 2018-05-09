import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PopoverModule } from 'ngx-bootstrap';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';

@NgModule({
    imports: [
        CommonModule,
        DetailRoutingModule,
        NgZorroAntdModule,
        PopoverModule.forRoot()
    ],
    declarations: [DetailComponent],
    providers: [AppService, AppProperties]
})
export class DetailModule {}
