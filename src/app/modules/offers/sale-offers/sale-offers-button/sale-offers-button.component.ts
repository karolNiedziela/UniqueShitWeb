import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import {
  DefaultSaleOfferQueryParameters,
  SaleOffersQueryParamMapping,
} from '../models/sale-offers-query-parameters.model';
import { SaleOfferService } from '../services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-button',
  templateUrl: './sale-offers-button.component.html',
  styleUrls: ['./sale-offers-button.component.scss'],
})
export class SaleOffersButtonComponent {
  readonly brandId = input<number | null>(null);
  readonly productCategoryId = input<number | null>(null);
  readonly label = input.required<string>();

  router = inject(Router);
  saleOfferService = inject(SaleOfferService);

  navigateToSaleOffers() {
    const queryParams: any = {
      [SaleOffersQueryParamMapping.pageNumber]: 
        DefaultSaleOfferQueryParameters.pageNumber,
      [SaleOffersQueryParamMapping.pageSize]: 
        DefaultSaleOfferQueryParameters.pageSize,
      ...(this.brandId() != null 
          ? { [SaleOffersQueryParamMapping.brandId]: this.brandId()! } 
          : {}),
      ...(this.productCategoryId() != null 
          ? { [SaleOffersQueryParamMapping.productCategoryId]: this.productCategoryId()! } 
          : {}),
    };

    this.saleOfferService.offersQueryParameters.update((q) => ({
      ...DefaultSaleOfferQueryParameters,
      ...(this.brandId() != null ? { brandId: this.brandId()! } : {}),
      ...(this.productCategoryId() != null ? { productCategoryId: this.productCategoryId()! } : {}),
    }));

    this.router.navigate(['/sale-offers'], {
      queryParams: queryParams,
      queryParamsHandling: 'replace',
    });
  }
}
