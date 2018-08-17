import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import {BsDatepickerModule, ModalModule, PaginationModule, PopoverModule} from 'ngx-bootstrap';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        DetailRoutingModule,
        NgZorroAntdModule,
        PopoverModule.forRoot(),
      FormsModule,
      ModalModule.forRoot(),
      PaginationModule.forRoot(),
      BsDatepickerModule.forRoot(),
    ],
    declarations: [DetailComponent],
    providers: [AppService, AppProperties]
})
export class DetailModule {}
