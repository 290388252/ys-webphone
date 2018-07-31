import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotPageComponent } from './notPage.component';
import { NotPageRoutingModule } from './notPage-routing.module';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';


@NgModule({
  declarations: [
    NotPageComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    NotPageRoutingModule
  ],
  providers: [AppService, AppProperties],
  bootstrap: [NotPageComponent]
})
export class NotPageModule { }
