import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';
import { SaleOfferCardHomeComponent } from '../../../modules/offers/sale-offers/sale-offer-card-home/sale-offer-card-home.component';

@Component({
  selector: 'app-sale-offers-lacoste',
  imports: [
    CommonModule,
    RouterModule,
    SaleOfferCardHomeComponent
  ],
  templateUrl: './sale-offers-lacoste.component.html',
  styleUrls: ['./sale-offers-lacoste.component.scss'],
})
export class SaleOffersLacosteComponent {
  @Input() brandIdFilter: number = 69; 
  private saleOfferService = inject(SaleOfferService);

  offers = computed(() => {
    const items = this.saleOfferService.offers.value()?.items as any[] | undefined;
    const filteredItems = items?.filter(offer => offer.brand.id === this.brandIdFilter);
    return filteredItems?.slice(0, 20) ?? [];
  });
}
