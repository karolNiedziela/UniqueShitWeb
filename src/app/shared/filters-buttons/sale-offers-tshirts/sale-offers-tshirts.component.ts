import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  DefaultSaleOfferQueryParameters,
  SaleOffersQueryParamMapping,
} from '../../../modules/offers/sale-offers/models/sale-offers-query-parameters.model';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-tshirts',
  templateUrl: './sale-offers-tshirts.component.html',
  styleUrls: ['./sale-offers-tshirts.component.scss'],
})
export class SaleOffersTshirtsComponent {
  private _tshirtsProductCategoryId: number = 2;

  router = inject(Router);
  saleOfferService = inject(SaleOfferService);

  navigateToSaleOffers() {
    const queryParams = {
      [SaleOffersQueryParamMapping.pageNumber]:
        DefaultSaleOfferQueryParameters.pageNumber,
      [SaleOffersQueryParamMapping.pageSize]:
        DefaultSaleOfferQueryParameters.pageSize,
      [SaleOffersQueryParamMapping.productCategoryId]:
        this._tshirtsProductCategoryId,
    };

    this.saleOfferService.offersQueryParameters.update((q) => ({
      ...DefaultSaleOfferQueryParameters,
      productCategoryId: this._tshirtsProductCategoryId,
    }));

    this.router.navigate(['/sale-offers'], {
      queryParams: queryParams,
      queryParamsHandling: 'replace',
      onSameUrlNavigation: 'reload',
    });
  }
}
