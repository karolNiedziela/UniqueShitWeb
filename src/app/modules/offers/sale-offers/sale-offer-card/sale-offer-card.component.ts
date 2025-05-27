import { Component, inject, input } from '@angular/core';
import { SaleOfferType } from '../models/sale-offer.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sale-offer-card',
  imports: [RouterModule],
  templateUrl: './sale-offer-card.component.html',
  styleUrl: './sale-offer-card.component.scss',
  standalone: true,
})
export class SaleOfferCardComponent {
  saleOffer = input.required<SaleOfferType>();
}
