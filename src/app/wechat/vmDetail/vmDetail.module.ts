import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VmDetailRoutingModule } from './vmDetail-routing.module';
import { VmDetailComponent } from './vmDetail.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PopoverModule } from 'ngx-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    imports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        CommonModule,
        VmDetailRoutingModule,
        NgZorroAntdModule,
        PopoverModule.forRoot()
    ],
    declarations: [VmDetailComponent]
})
export class VmDetailModule {}
