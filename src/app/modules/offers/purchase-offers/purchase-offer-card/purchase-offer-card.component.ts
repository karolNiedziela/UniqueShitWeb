import { Component, input } from '@angular/core';
import { PurchaseOfferType } from '../models/purchase-offer.model';

@Component({
  selector: 'app-purchase-offer-card',
  imports: [],
  templateUrl: './purchase-offer-card.component.html',
  styleUrls: ['./purchase-offer-card.component.scss'],
})
export class PurchaseOfferCardComponent {
  purchaseOffer = input.required<PurchaseOfferType>();
}
