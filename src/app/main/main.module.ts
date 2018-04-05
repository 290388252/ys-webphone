import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { NavbarComponent } from '../navbar/navbar.component';
import { CarouselComponent } from '../carousel/carousel.component';


@NgModule({
  declarations: [
    MainComponent,
    NavbarComponent,
    CarouselComponent,
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    MainRoutingModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class MainModule { }
