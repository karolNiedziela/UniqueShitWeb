import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SaleOffersButtonComponent } from '../offers/sale-offers/sale-offers-button/sale-offers-button.component';
import { PurchaseOffersButtonComponent } from '../offers/purchase-offers/purchase-offers-button/purchase-offers-button.component';
import { BrandId, ProductCategoryId } from '../../shared/enums/enums.component';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    SaleOffersButtonComponent,
    PurchaseOffersButtonComponent
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  brandId = BrandId;
  productCategoryId = ProductCategoryId;
}
