import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOfferService } from '../../../modules/offers/purchase-offers/services/purchase-offer.service';

@Component({
  selector: 'app-purchase-offers-lacoste',
  templateUrl: './purchase-offers-lacoste.component.html',
  styleUrls: ['./purchase-offers-lacoste.component.scss']
})
export class PurchaseOffersLacosteComponent {
  constructor(
    private router: Router,
    private purchaseOfferService: PurchaseOfferService
  ) {}

  applyAndGo() {
    this.purchaseOfferService.offersQueryParameters.update(q => ({
      ...q,
      brandId: 69
    }));
    this.router.navigate(['/purchase-offers']);
  }
}
