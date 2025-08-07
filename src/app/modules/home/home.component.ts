import { Component } from '@angular/core';
import { SpecificSaleOffersSliderComponent } from "../offers/sale-offers/specific-sale-offers-slider/specific-sale-offers-slider.component";
import { CommonModule } from '@angular/common';
import { BrandId } from '../../shared/enums/enums.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    SpecificSaleOffersSliderComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  readonly sliders = [
    { brandId: BrandId.Adidas, brandName: 'Adidas' },
    { brandId: BrandId.Nike, brandName: 'Nike' },
    { brandId: BrandId.Jordan, brandName: 'Jordan' },
    { brandId: BrandId.Lacoste, brandName: 'Lacoste' },
  ];
}