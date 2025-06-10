import { Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

// Importowane komponenty są ładowane dynamicznie za pomocą *ngComponentOutlet.
// Ostrzeżenia o "nieużywaniu" tych komponentów w szablonie można zignorować.
import { SaleOffersNikeComponent } from '../../shared/filters-buttons/sale-offers-nike/sale-offers-nike.component';
import { SaleOffersAdidasComponent } from '../../shared/filters-buttons/sale-offers-adidas/sale-offers-adidas.component';
import { PurchaseOffersNikeComponent } from '../../shared/filters-buttons/purchase-offers-nike/purchase-offers-nike.component';
import { PurchaseOffersAdidasComponent } from '../../shared/filters-buttons/purchase-offers-adidas/purchase-offers-adidas.component';
import { SaleOffersShoesComponent } from '../../shared/filters-buttons/sale-offers-shoes/sale-offers-shoes.component';
import { SaleOffersTshirtsComponent } from '../../shared/filters-buttons/sale-offers-tshirts/sale-offers-tshirts.component';
import { SaleOffersHoodiesComponent } from '../../shared/filters-buttons/sale-offers-hoodies/sale-offers-hoodies.component';
import { SaleOffersJordanComponent } from '../../shared/filters-buttons/sale-offers-jordan/sale-offers-jordan.component';
import { PurchaseOffersJordanComponent } from '../../shared/filters-buttons/purchase-offers-jordan/purchase-offers-jordan.component';
import { PurchaseOffersLacosteComponent } from '../../shared/filters-buttons/purchase-offers-lacoste/purchase-offers-lacoste.component';
import { PurchaseOffersPoloComponent } from '../../shared/filters-buttons/purchase-offers-polo/purchase-offers-polo.component';
import { PurchaseOffersTheNorthFaceComponent } from '../../shared/filters-buttons/purchase-offers-the-north-face/purchase-offers-the-north-face.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    SaleOffersNikeComponent,
    SaleOffersAdidasComponent,
    PurchaseOffersNikeComponent,
    PurchaseOffersAdidasComponent,
    SaleOffersShoesComponent,
    SaleOffersTshirtsComponent,
    SaleOffersHoodiesComponent,
    SaleOffersJordanComponent,
    PurchaseOffersJordanComponent,
    PurchaseOffersLacosteComponent,
    PurchaseOffersPoloComponent,
    PurchaseOffersTheNorthFaceComponent
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  saleOffersColumns: Type<any>[][] = [
    [SaleOffersNikeComponent, SaleOffersAdidasComponent, SaleOffersJordanComponent],
    [SaleOffersShoesComponent, SaleOffersTshirtsComponent, SaleOffersHoodiesComponent]
  ];

  purchaseOffersColumns: Type<any>[][] = [
    [PurchaseOffersNikeComponent, PurchaseOffersAdidasComponent, PurchaseOffersJordanComponent],
    [PurchaseOffersLacosteComponent, PurchaseOffersPoloComponent, PurchaseOffersTheNorthFaceComponent]
  ];
}
