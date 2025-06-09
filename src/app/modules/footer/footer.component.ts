import {Component} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import { SaleOffersNikeComponent } from '../../shared/filters-buttons/sale-offers-nike/sale-offers-nike.component';
import { SaleOffersAdidasComponent } from '../../shared/filters-buttons/sale-offers-adidas/sale-offers-adidas.component';
import { PurchaseOffersNikeComponent } from '../../shared/filters-buttons/purchase-offers-nike/purchase-offers-nike.component';
import { PurchaseOffersAdidasComponent } from '../../shared/filters-buttons/purchase-offers-adidas/purchase-offers-adidas.component';

@Component({
  selector: 'app-footer',
  standalone: true, 
  imports: [MatToolbarModule, 
    MatButtonModule, 
    RouterLink, 
    SaleOffersNikeComponent, 
    SaleOffersAdidasComponent, 
    PurchaseOffersNikeComponent, 
    PurchaseOffersAdidasComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}