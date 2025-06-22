import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  DefaultSaleOfferQueryParameters,
  SaleOffersQueryParamMapping,
} from '../../../modules/offers/sale-offers/models/sale-offers-query-parameters.model';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-jordan',
  templateUrl: './sale-offers-jordan.component.html',
  styleUrls: ['./sale-offers-jordan.component.scss'],
})
export class SaleOffersJordanComponent {
  private _jordanBrandId: number = 66;

  router = inject(Router);
  saleOfferService = inject(SaleOfferService);

  navigateToSaleOffers() {
    const queryParams = {
      [SaleOffersQueryParamMapping.pageNumber]:
        DefaultSaleOfferQueryParameters.pageNumber,
      [SaleOffersQueryParamMapping.pageSize]:
        DefaultSaleOfferQueryParameters.pageSize,
      [SaleOffersQueryParamMapping.brandId]: this._jordanBrandId,
    };

    this.saleOfferService.offersQueryParameters.update((q) => ({
      ...DefaultSaleOfferQueryParameters,
      brandId: this._jordanBrandId,
    }));

    this.router.navigate(['/sale-offers'], {
      queryParams: queryParams,
      queryParamsHandling: 'replace',
      onSameUrlNavigation: 'reload',
    });
  }
}
