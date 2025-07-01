import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SaleOffersButtonComponent } from '../../shared/filter-offers-buttons/sale-offers-button/sale-offers-button.component';
import { PurchaseOffersButtonComponent } from '../../shared/filter-offers-buttons/purchase-offers-button/purchase-offers-button.component';

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
export class FooterComponent { }
