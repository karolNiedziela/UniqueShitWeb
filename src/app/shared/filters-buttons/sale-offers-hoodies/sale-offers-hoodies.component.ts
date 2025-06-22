import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  DefaultSaleOfferQueryParameters,
  SaleOffersQueryParamMapping,
} from '../../../modules/offers/sale-offers/models/sale-offers-query-parameters.model';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-hoodies',
  templateUrl: './sale-offers-hoodies.component.html',
  styleUrls: ['./sale-offers-hoodies.component.scss'],
})
export class SaleOffersHoodiesComponent {
  private _hoodieProductCategoryId: number = 3;

  router = inject(Router);
  saleOfferService = inject(SaleOfferService);

  navigateToSaleOffers() {
    const queryParams = {
      [SaleOffersQueryParamMapping.pageNumber]:
        DefaultSaleOfferQueryParameters.pageNumber,
      [SaleOffersQueryParamMapping.pageSize]:
        DefaultSaleOfferQueryParameters.pageSize,
      [SaleOffersQueryParamMapping.productCategoryId]:
        this._hoodieProductCategoryId,
    };

    this.saleOfferService.offersQueryParameters.update((q) => ({
      ...DefaultSaleOfferQueryParameters,
      productCategoryId: this._hoodieProductCategoryId,
    }));

    this.router.navigate(['/sale-offers'], {
      queryParams: queryParams,
      queryParamsHandling: 'replace',
      onSameUrlNavigation: 'reload',
    });
  }
}
