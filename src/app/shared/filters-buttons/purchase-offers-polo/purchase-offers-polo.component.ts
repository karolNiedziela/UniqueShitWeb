import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOfferService } from '../../../modules/offers/purchase-offers/services/purchase-offer.service';

@Component({
  selector: 'app-purchase-offers-polo',
  templateUrl: './purchase-offers-polo.component.html',
  styleUrls: ['./purchase-offers-polo.component.scss']
})
export class PurchaseOffersPoloComponent {
  constructor(
    private router: Router,
    private purchaseOfferService: PurchaseOfferService
  ) {}

  applyAndGo() {
    this.purchaseOfferService.offersQueryParameters.update(q => ({
      ...q,
      brandId: 102
    }));
    this.router.navigate(['/purchase-offers']);
  }
}
