import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOfferService } from '../../../modules/offers/purchase-offers/services/purchase-offer.service';

@Component({
  selector: 'app-purchase-offers-nike',
  templateUrl: './purchase-offers-nike.component.html',
  styleUrls: ['./purchase-offers-nike.component.scss']
})
export class PurchaseOffersNikeComponent {
  private purchaseOfferService = inject(PurchaseOfferService);
  constructor(private router: Router) {}

  applyAndGo() {
    this.purchaseOfferService.offersQueryParameters.update(q => ({
      ...q,
      brandId: 85
    }));
    this.router.navigate(['/purchase-offers']);
  }
}
