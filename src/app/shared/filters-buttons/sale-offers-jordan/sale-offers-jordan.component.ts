import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-jordan',
  templateUrl: './sale-offers-jordan.component.html',
  styleUrls: ['./sale-offers-jordan.component.scss']
})
export class SaleOffersJordanComponent {
  constructor(
    private router: Router,
    private saleOfferService: SaleOfferService
  ) {}

  applyAndGo() {
    this.saleOfferService.offersQueryParameters.update(q => ({
      ...q,
      brandId: 66
    }));
    this.router.navigate(['/sale-offers']);
  }
}
