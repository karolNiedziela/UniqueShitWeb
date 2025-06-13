import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-hoodies',
  templateUrl: './sale-offers-hoodies.component.html',
  styleUrls: ['./sale-offers-hoodies.component.scss']
})
export class SaleOffersHoodiesComponent {
  constructor(
    private router: Router,
    private saleOfferService: SaleOfferService
  ) {}

  applyAndGo() {
    this.saleOfferService.offersQueryParameters.update(q => ({
      ...q,
      productCategoryId: 3
    }));
    this.router.navigate(['/sale-offers']);
  }
}