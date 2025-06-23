import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import {
  DefaultOfferQueryParameters,
  OffersQueryParamMapping,
} from '../../../modules/offers/purchase-offers/models/purchase-offers-query-parameters.model';
import { PurchaseOfferService } from '../../../modules/offers/purchase-offers/services/purchase-offer.service';

@Component({
  selector: 'app-purchase-offers-button',
  templateUrl: './purchase-offers-button.component.html',
  styleUrls: ['./purchase-offers-button.component.scss'],
})
export class PurchaseOffersButtonComponent {
  readonly brandId = input<number | null>(null);
  readonly label = input.required<string>();

  router = inject(Router);
  purchaseOfferService = inject(PurchaseOfferService);

  navigateToPurchaseOffers() {
    const queryParams: any = {
      [OffersQueryParamMapping.pageNumber]: 
        DefaultOfferQueryParameters.pageNumber,
      [OffersQueryParamMapping.pageSize]: 
        DefaultOfferQueryParameters.pageSize,
      ...(this.brandId() != null
        ? { [OffersQueryParamMapping.brandId]: this.brandId()! }
        : {}),
    };

    this.purchaseOfferService.offersQueryParameters.update((q) => ({
      ...DefaultOfferQueryParameters,
      ...(this.brandId() != null ? { brandId: this.brandId()! } : {}),
    }));

    this.router.navigate(['/purchase-offers'], {
      queryParams: queryParams,
      queryParamsHandling: 'replace',
    });
  }
}
