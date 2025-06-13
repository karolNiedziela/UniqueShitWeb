import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOfferService } from '../../../modules/offers/purchase-offers/services/purchase-offer.service';

@Component({
  selector: 'app-purchase-offers-jordan',
  templateUrl: './purchase-offers-jordan.component.html',
  styleUrls: ['./purchase-offers-jordan.component.scss']
})
export class PurchaseOffersJordanComponent {
  constructor(
    private router: Router,
    private purchaseOfferService: PurchaseOfferService
  ) {}

  applyAndGo() {
    this.purchaseOfferService.offersQueryParameters.update(q => ({
      ...q,
      brandId: 4
    }));
    this.router.navigate(['/purchase-offers']);
  }
}
