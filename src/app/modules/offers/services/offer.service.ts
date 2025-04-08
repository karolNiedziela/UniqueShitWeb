import { HttpParams, httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { OfferType } from '../models/offer.model';
import { environment } from '../../../../environments/environment';
import {
  DefaultOfferQueryParameters,
  OfferQueryParameters,
  OffersQueryParamMapping,
} from '../models/offers-query-parameters.model';
import { PagedListModel } from '../../../shared/models/paged-list-model';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private offersEndpoint: string = `${environment.apiUrl}/offers`;

  offersQueryParameters = signal<OfferQueryParameters>({
    ...DefaultOfferQueryParameters,
  });

  offersParams = computed<HttpParams>(() => {
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

  offers = httpResource<PagedListModel<OfferType>>(
    () => ({ url: `${this.offersEndpoint}?${this.offersParams()}` }),
    {
      defaultValue: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviosPage: false,
        pageNumber: DefaultOfferQueryParameters.pageNumber,
        pageSize: DefaultOfferQueryParameters.pageSize,
      },
      parse: (data) => {
        const parsedData = data as PagedListModel<OfferType>;
        return parsedData;
      },
    }
  );
}
