import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ShareComponent } from './share.component';
import { ShareRoutingModule } from './share-routing.module';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    ShareComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgZorroAntdModule,
    ShareRoutingModule
  ],
  providers: [AppService, AppProperties],
  bootstrap: [ShareComponent]
})
export class ShareModule { }
