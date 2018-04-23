import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CarouselComponent } from '../carousel/carousel.component';
import {AppService} from '../app-service';
import {AppProperties} from '../app.properties';


@NgModule({
  declarations: [
    MainComponent,
    FooterComponent,
    NavbarComponent,
    CarouselComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    MainRoutingModule
  ],
  providers: [AppService, AppProperties],
  bootstrap: [MainComponent]
})
export class MainModule { }
