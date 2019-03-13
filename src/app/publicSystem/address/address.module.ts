import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressRoutingModule } from './address-routing.module';
import { AddressComponent } from './address.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PopoverModule } from 'ngx-bootstrap';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      AddressRoutingModule,
      NgZorroAntdModule,
      PopoverModule.forRoot()
    ],
    declarations: [AddressComponent],
    providers: [AppService, AppProperties],
})
export class AddressModule {}
