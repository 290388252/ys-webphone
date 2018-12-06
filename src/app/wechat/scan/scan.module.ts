import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ElModule } from 'element-angular';
import { ScanRoutingModule } from './scan-routing.module';
import {ScanComponent} from './scan.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import { FormsModule } from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';
// import {WeUiModule} from 'ngx-weui';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    // ElModule,
    // WeUiModule.forRoot(),
    FileUploadModule,
    ScanRoutingModule
  ],
  providers: [AppService, AppProperties],
  declarations: [ScanComponent]
})
export class ScanModule { }
