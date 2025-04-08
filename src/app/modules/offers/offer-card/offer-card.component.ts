import { Component, input } from '@angular/core';
import { OfferType } from '../models/offer.model';

@Component({
  selector: 'app-offer-card',
  imports: [],
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.scss',
  standalone: true,
})
export class OfferCardComponent {
  offer = input.required<OfferType>();
}
