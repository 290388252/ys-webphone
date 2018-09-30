import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';
import { TestRoutingModule } from './test-routing.module';
import {AppService} from '../../app-service';
import {AppProperties} from '../../app.properties';


@NgModule({
  declarations: [
    TestComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    TestRoutingModule
  ],
  providers: [AppService, AppProperties],
  bootstrap: [TestComponent]
})
export class TestModule { }
