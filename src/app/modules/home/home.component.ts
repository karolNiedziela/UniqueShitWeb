import { Component } from '@angular/core';
import { SaleOffersAdidasComponent } from '../../shared/featured-sale-offers/sale-offers-adidas/sale-offers-adidas.component';
import { SaleOffersNikeComponent } from '../../shared/featured-sale-offers/sale-offers-nike/sale-offers-nike.component';
import { SaleOffersJordanComponent } from '../../shared/featured-sale-offers/sale-offers-jordan/sale-offers-jordan.component';
import { SaleOffersLacosteComponent } from '../../shared/featured-sale-offers/sale-offers-lacoste/sale-offers-lacoste.component';

@Component({
  selector: 'app-home',
  imports: [
    SaleOffersAdidasComponent,
    SaleOffersNikeComponent,
    SaleOffersJordanComponent,
    SaleOffersLacosteComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
