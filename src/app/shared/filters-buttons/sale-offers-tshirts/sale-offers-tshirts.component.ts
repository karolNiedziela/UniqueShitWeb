import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-tshirts',
  templateUrl: './sale-offers-tshirts.component.html',
  styleUrls: ['./sale-offers-tshirts.component.scss']
})
export class SaleOffersTshirtsComponent {
  constructor(
    private router: Router,
    private saleOfferService: SaleOfferService
  ) {}

  applyAndGo() {
    this.saleOfferService.offersQueryParameters.update(q => ({
      ...q,
      productCategoryId: 2
    }));
    this.router.navigate(['/sale-offers']);
  }
}