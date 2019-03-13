import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAddressRoutingModule } from './addAddress-routing.module';
import { AddAddressComponent } from './addAddress.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PopoverModule } from 'ngx-bootstrap';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      AddAddressRoutingModule,
      NgZorroAntdModule,
      PopoverModule.forRoot()
    ],
    declarations: [AddAddressComponent],
    providers: [AppService, AppProperties],
})
export class AddAddressModule {}
