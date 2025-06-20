import { Component, input } from '@angular/core';
import { SaleOfferType } from '../models/sale-offer.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sale-offer-card',
  imports: [RouterModule],
  templateUrl: './sale-offer-card.component.html',
  styleUrl: './sale-offer-card.component.scss',
})
export class SaleOfferCardComponent {
  saleOffer = input.required<SaleOfferType>();
}
