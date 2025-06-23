import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SaleOfferService } from '../../modules/offers/sale-offers/services/sale-offer.service';
import { SaleOfferCardHomeComponent } from '../../modules/offers/sale-offers/sale-offer-card-home/sale-offer-card-home.component';

@Component({
  selector: 'app-feature-sale-offers',
  imports: [CommonModule, RouterModule, SaleOfferCardHomeComponent],
  templateUrl: './feature-sale-offers.component.html',
  styleUrls: ['./feature-sale-offers.component.scss'],
})
export class FeatureSaleOffersComponent {
  readonly brandIdFilter = input.required<number>();
  readonly brandName     = input.required<string>();
  readonly sliceLimit    = input<number>(20);

  private saleOfferService = inject(SaleOfferService);

  offers = computed(() => {
    const items = this.saleOfferService.offers.value()?.items as any[]|undefined;
    return items
      ?.filter(o => o.brand.id === this.brandIdFilter())
      .slice(0, this.sliceLimit())
    ?? [];
  });
}
