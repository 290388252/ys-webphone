import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MiddleComponent } from './middle.component';
import { MiddleRoutingModule } from './middle-routing.module';
import {AppService} from '../app-service';
import {AppProperties} from '../app.properties';


@NgModule({
  declarations: [
    MiddleComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    MiddleRoutingModule
  ],
  providers: [AppService, AppProperties],
  bootstrap: [MiddleComponent]
})
export class MiddleModule { }
