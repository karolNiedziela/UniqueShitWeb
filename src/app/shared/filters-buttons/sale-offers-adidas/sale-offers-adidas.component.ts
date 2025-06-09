import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-adidas',
  templateUrl: './sale-offers-adidas.component.html',
  styleUrls: ['./sale-offers-adidas.component.scss']
})
export class SaleOffersAdidasComponent {
  private saleOfferService = inject(SaleOfferService);
  constructor(private router: Router) {}

  applyAndGo() {
    this.saleOfferService.offersQueryParameters.update(q => ({
      ...q,
      brandId: 4
    }));
    this.router.navigate(['/sale-offers']);
  }
}
