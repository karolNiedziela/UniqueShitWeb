import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-nike',
  templateUrl: './sale-offers-nike.component.html',
  styleUrls: ['./sale-offers-nike.component.scss']
})
export class SaleOffersNikeComponent {
  private saleOfferService = inject(SaleOfferService);
  
  constructor(private router: Router) {}

  applyAndGo() {
    this.saleOfferService.offersQueryParameters.update(q => ({
      ...q,
      brandId: 85
    }));
    this.router.navigate(['/sale-offers']);
  }
}
