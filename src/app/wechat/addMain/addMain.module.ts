import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AddMainComponent } from './addMain.component';
import { AddMainRoutingModule } from './addMain-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';


@NgModule({
  declarations: [
    AddMainComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    AddMainRoutingModule,
    NgZorroAntdModule
  ],
  providers: [AppService, AppProperties],
  bootstrap: [AddMainComponent]
})
export class AddMainModule { }
