import { Component, input } from '@angular/core';
import { SaleOfferType } from '../models/sale-offer.model';

@Component({
  selector: 'app-sale-offer-card',
  imports: [],
  templateUrl: './sale-offer-card.component.html',
  styleUrl: './sale-offer-card.component.scss',
})
export class SaleOfferCardComponent {
  saleOffer = input.required<SaleOfferType>();
}
