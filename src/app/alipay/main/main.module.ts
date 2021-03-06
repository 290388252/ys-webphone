import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    MainRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    CarouselModule.forRoot()
  ],
  providers: [AppService, AppProperties],
  bootstrap: [MainComponent]
})
export class MainModule { }
