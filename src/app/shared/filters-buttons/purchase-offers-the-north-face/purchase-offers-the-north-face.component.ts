import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOfferService } from '../../../modules/offers/purchase-offers/services/purchase-offer.service';

@Component({
  selector: 'app-purchase-offers-the-north-face',
  templateUrl: './purchase-offers-the-north-face.component.html',
  styleUrls: ['./purchase-offers-the-north-face.component.scss']
})
export class PurchaseOffersTheNorthFaceComponent {
  constructor(
    private router: Router,
    private purchaseOfferService: PurchaseOfferService
  ) {}

  applyAndGo() {
    this.purchaseOfferService.offersQueryParameters.update(q => ({
      ...q,
      brandId: 122
    }));
    this.router.navigate(['/purchase-offers']);
  }
}
