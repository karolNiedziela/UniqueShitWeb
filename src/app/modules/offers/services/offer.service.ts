import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { computed, Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OfferType } from '../models/offer.model';
import { environment } from '../../../../environments/environment';
import {
  DefaultOfferQueryParameters,
  OfferQueryParameters,
  OffersQueryParamMapping,
} from '../models/offers-query-parameters.model';
import { PagedListModel } from '../../../shared/models/paged-list-model';
import { CreateOfferDto } from '../models/offer.dto';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private offersEndpoint = `${environment.apiUrl}/offers`;

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
      parse: (data) => data as PagedListModel<OfferType>,
    }
  );


  createOffer(dto: CreateOfferDto): Observable<CreateOfferDto> {
    return this.httpClient
      .post<CreateOfferDto>(this.offersEndpoint, dto)
      .pipe(tap(() => console.log('Offer created')));
  }


  createOfferWithFile(
    dto: CreateOfferDto,
    file: File
  ): Observable<CreateOfferDto> {
    const formData = new FormData();
    formData.append(
      'offer',
      new Blob([JSON.stringify(dto)], { type: 'application/json' })
    );
    formData.append('file', file);

    return this.httpClient
      .post<CreateOfferDto>(this.offersEndpoint, formData)
      .pipe(tap(() => console.log('Offer with file created')));
  }
}