import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-adidas',
  templateUrl: './sale-offers-adidas.component.html',
  styleUrls: ['./sale-offers-adidas.component.scss']
})
export class SaleOffersAdidasComponent {
  constructor(
    private router: Router,
    private saleOfferService: SaleOfferService
  ) {}

  applyAndGo() {
    this.saleOfferService.offersQueryParameters.update(q => ({
      ...q,
      brandId: 4
    }));
    this.router.navigate(['/sale-offers']);
  }
}
