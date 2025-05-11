import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { computed, Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  DefaultOfferQueryParameters,
  OfferQueryParameters,
  OffersQueryParamMapping,
} from '../models/sale-offers-query-parameters.model';
import { PagedListModel } from '../../../../shared/models/paged-list-model';
import { environment } from '../../../../../environments/environment';
import { SaleOfferType } from '../models/sale-offer.model';
import { CreateSaleOfferDto } from '../models/create-sale-offer.dto';

@Injectable({
  providedIn: 'root',
})
export class SaleOfferService {
  private saleOffersEndpoint = `${environment.apiUrl}/sale-offers`;

  private httpClient = inject(HttpClient);

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

  offers = httpResource<PagedListModel<SaleOfferType>>(
    () => ({ url: `${this.saleOffersEndpoint}?${this.offersParams()}` }),
    {
      defaultValue: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviosPage: false,
        pageNumber: DefaultOfferQueryParameters.pageNumber,
        pageSize: DefaultOfferQueryParameters.pageSize,
      },
      parse: (data) => data as PagedListModel<SaleOfferType>,
    }
  );

  createSaleOffer(dto: CreateSaleOfferDto): Observable<CreateSaleOfferDto> {
    return this.httpClient
      .post<CreateSaleOfferDto>(this.saleOffersEndpoint, dto)
      .pipe(tap(() => console.log('Offer created')));
  }

  createSaleOfferWithFile(
    dto: CreateSaleOfferDto,
    file: File
  ): Observable<CreateSaleOfferDto> {
    const formData = new FormData();
    formData.append(
      'offer',
      new Blob([JSON.stringify(dto)], { type: 'application/json' })
    );
    formData.append('file', file);

    return this.httpClient
      .post<CreateSaleOfferDto>(this.saleOffersEndpoint, formData)
      .pipe(tap(() => console.log('Offer with file created')));
  }
}
