import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PurchaseOfferType } from '../models/purchase-offer.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-purchase-offer-card',
  imports: [MatCardModule, RouterModule],
  templateUrl: './purchase-offer-card.component.html',
  styleUrls: ['./purchase-offer-card.component.scss']
})
export class PurchaseOfferCardComponent {
  purchaseOffer = input.required<PurchaseOfferType>();
}
