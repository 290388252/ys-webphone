import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PayPageComponent } from './pay.component';
import { PayPageRoutingModule } from './pay-routing.module';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';


@NgModule({
  declarations: [
    PayPageComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    PayPageRoutingModule
  ],
  providers: [AppService, AppProperties],
  bootstrap: [PayPageComponent]
})
export class PayPageModule { }
