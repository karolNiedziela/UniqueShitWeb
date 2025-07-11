import { Component } from '@angular/core';
import { SpecificSaleOffersSliderComponent } from "../offers/sale-offers/specific-sale-offers-slider/specific-sale-offers-slider.component";
@Component({
  selector: 'app-home',
  imports: [
    SpecificSaleOffersSliderComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
