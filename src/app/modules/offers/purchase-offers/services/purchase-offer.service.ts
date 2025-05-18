import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { computed, Injectable, signal, inject } from '@angular/core';
import {
  DefaultOfferQueryParameters,
  OfferQueryParameters,
  OffersQueryParamMapping,
} from '../models/purchase-offers-query-parameters.model';
import { PagedListModel } from '../../../../shared/models/paged-list-model';
import { environment } from '../../../../../environments/environment';
import { PurchaseOfferType } from '../models/purchase-offer.model';
import { CreatePurchaseOfferDto } from '../models/create-purchase-offer.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOfferService {
  private purchaseOffersEndpoint = `${environment.apiUrl}/purchase-offers`;
  private httpClient = inject(HttpClient);

  offersQueryParameters = signal<OfferQueryParameters>({
    ...DefaultOfferQueryParameters,
  });

  offersParams = computed(() => {
    let params = new HttpParams();
    Object.entries(this.offersQueryParameters()).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const queryParamKey =
          OffersQueryParamMapping[key as keyof OfferQueryParameters];
        params = params.set(queryParamKey, value.toString());
      }
    });
    return params;
  });

  offers = httpResource<PagedListModel<PurchaseOfferType>>(
    () => ({
      url: this.purchaseOffersEndpoint,
      params: this.offersParams(),
    }),
    {
      defaultValue: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviosPage: false,
        pageNumber: DefaultOfferQueryParameters.pageNumber,
        pageSize: DefaultOfferQueryParameters.pageSize,
      },
    }
  );

  createPurchaseOffer(dto: CreatePurchaseOfferDto): Observable<CreatePurchaseOfferDto> {
    return this.httpClient
      .post<CreatePurchaseOfferDto>(this.purchaseOffersEndpoint, dto)
  }

}
