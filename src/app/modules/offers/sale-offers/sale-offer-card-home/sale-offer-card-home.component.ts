import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SaleOfferType } from '../models/sale-offer.model';

@Component({
  selector: 'app-sale-offer-card-home',
  imports: [RouterModule],
  templateUrl: './sale-offer-card-home.component.html',
  styleUrls: ['./sale-offer-card-home.component.scss'],
})
export class SaleOfferCardHomeComponent {
  saleOffer = input.required<SaleOfferType>();
}
