import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { SearchComponent } from '../search/search.component';


@NgModule({
  declarations: [
    MainComponent,
    FooterComponent,
    NavbarComponent,
    CarouselComponent,
    SearchComponent,
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
