import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  DefaultSaleOfferQueryParameters,
  SaleOffersQueryParamMapping,
} from '../../../modules/offers/sale-offers/models/sale-offers-query-parameters.model';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-shoes',
  templateUrl: './sale-offers-shoes.component.html',
  styleUrls: ['./sale-offers-shoes.component.scss'],
})
export class SaleOffersShoesComponent {
  private _shoesProductCategoryId: number = 1;

  router = inject(Router);
  saleOfferService = inject(SaleOfferService);

  navigateToSaleOffers() {
    const queryParams = {
      [SaleOffersQueryParamMapping.pageNumber]:
        DefaultSaleOfferQueryParameters.pageNumber,
      [SaleOffersQueryParamMapping.pageSize]:
        DefaultSaleOfferQueryParameters.pageSize,
      [SaleOffersQueryParamMapping.productCategoryId]:
        this._shoesProductCategoryId,
    };

    this.saleOfferService.offersQueryParameters.update((q) => ({
      ...DefaultSaleOfferQueryParameters,
      productCategoryId: this._shoesProductCategoryId,
    }));

    this.router.navigate(['/sale-offers'], {
      queryParams: queryParams,
      queryParamsHandling: 'replace',
      onSameUrlNavigation: 'reload',
    });
  }
}
