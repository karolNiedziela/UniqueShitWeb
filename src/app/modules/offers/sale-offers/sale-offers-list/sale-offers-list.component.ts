import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SaleOfferService } from '../services/sale-offer.service';
import { SaleOfferCardComponent } from '../sale-offer-card/sale-offer-card.component';
import { SaleOffersListFiltersComponent } from '../sale-offers-list-filters/sale-offers-list-filters.component';
import { ActivatedRoute } from '@angular/router';
import {
  DefaultSaleOfferQueryParameters,
  SaleOfferQueryParameters,
  SaleOffersQueryParamMapping,
} from '../models/sale-offers-query-parameters.model';

@Component({
  selector: 'app-sale-offers-list',
  imports: [
    MatButtonModule,
    SaleOfferCardComponent,
    SaleOffersListFiltersComponent,
  ],
  templateUrl: './sale-offers-list.component.html',
  styleUrls: ['./sale-offers-list.component.scss'],
  standalone: true,
})
export class SaleOffersListComponent implements OnInit {
  filtersVisible = signal<boolean>(false);

  saleOfferService = inject(SaleOfferService);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const mappedParams: SaleOfferQueryParameters = {
        modelId: params[SaleOffersQueryParamMapping.modelId],
        brandId: params[SaleOffersQueryParamMapping.brandId],
        productCategoryId:
          params[SaleOffersQueryParamMapping.productCategoryId],
        sizeId: params[SaleOffersQueryParamMapping.sizeId],
        pageNumber: params[SaleOffersQueryParamMapping.pageNumber],
        pageSize: params[SaleOffersQueryParamMapping.pageSize],
      };

      this.saleOfferService.offersQueryParameters.set(mappedParams);
    });
  }

  toggleFilters() {
    this.filtersVisible.update((filtersVisible) => !filtersVisible);
  }
}
