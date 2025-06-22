import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  DefaultSaleOfferQueryParameters,
  SaleOffersQueryParamMapping,
} from '../../../modules/offers/sale-offers/models/sale-offers-query-parameters.model';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-nike',
  templateUrl: './sale-offers-nike.component.html',
  styleUrls: ['./sale-offers-nike.component.scss'],
})
export class SaleOffersNikeComponent {
  private _nikeBrandId: number = 85;

  router = inject(Router);
  saleOfferService = inject(SaleOfferService);

  navigateToSaleOffers(): void {
    const queryParams = {
      [SaleOffersQueryParamMapping.pageNumber]:
        DefaultSaleOfferQueryParameters.pageNumber,
      [SaleOffersQueryParamMapping.pageSize]:
        DefaultSaleOfferQueryParameters.pageSize,
      [SaleOffersQueryParamMapping.brandId]: this._nikeBrandId,
    };

    this.saleOfferService.offersQueryParameters.update((q) => ({
      ...DefaultSaleOfferQueryParameters,
      brandId: this._nikeBrandId,
    }));

    this.router.navigate(['/sale-offers'], {
      queryParams: queryParams,
      queryParamsHandling: 'replace',
      onSameUrlNavigation: 'reload',
    });
  }
}
