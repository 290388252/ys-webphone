import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {RotateComponent} from './rotate.component';
import {RotateRoutingModule} from './rotate-routing.module';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NgZorroAntdModule} from 'ng-zorro-antd';

@NgModule({
  declarations: [
    RotateComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgZorroAntdModule,
    RotateRoutingModule
  ],
  providers: [AppService, AppProperties],
  bootstrap: [RotateComponent]
})
export class RotateModule {
}
