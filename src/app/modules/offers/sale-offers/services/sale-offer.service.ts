import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { computed, Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DefaultSaleOfferQueryParameters,
  SaleOfferQueryParameters,
  SaleOffersQueryParamMapping,
} from '../models/sale-offers-query-parameters.model';
import { PagedListModel } from '../../../../shared/models/paged-list-model';
import { environment } from '../../../../../environments/environment';
import { SaleOfferType } from '../models/sale-offer.model';
import { CreateSaleOfferDto } from '../models/create-sale-offer.dto';
import { SaleOfferDetails } from '../models/sale-offer-details.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleOfferService {
  private saleOffersEndpoint = `${environment.apiUrl}/sale-offers`;

  private httpClient = inject(HttpClient);

  offersQueryParameters = signal<SaleOfferQueryParameters>({
    ...DefaultSaleOfferQueryParameters,
  });

  offersParams = computed<HttpParams>(() => {
    let params = new HttpParams();

    Object.entries(this.offersQueryParameters()).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const queryParamKey =
          SaleOffersQueryParamMapping[key as keyof SaleOfferQueryParameters];
        params = params.set(queryParamKey, value.toString());
      }
    });

    return params;
  });

  getOffer(id: number): Observable<SaleOfferDetails> {
    const url = `${this.saleOffersEndpoint}/${id}`;
    return this.httpClient.get<SaleOfferDetails>(url);
  }

  offers = httpResource<PagedListModel<SaleOfferType>>(
    () => ({ url: `${this.saleOffersEndpoint}?${this.offersParams()}` }),
    {
      defaultValue: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviosPage: false,
        pageNumber: DefaultSaleOfferQueryParameters.pageNumber,
        pageSize: DefaultSaleOfferQueryParameters.pageSize,
      },
      parse: (data) => data as PagedListModel<SaleOfferType>,
    }
  );

  createSaleOffer(dto: CreateSaleOfferDto): Observable<CreateSaleOfferDto> {
    return this.httpClient.post<CreateSaleOfferDto>(
      this.saleOffersEndpoint,
      dto
    );
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

    return this.httpClient.post<CreateSaleOfferDto>(
      this.saleOffersEndpoint,
      formData
    );
  }
  getOffersByUserId(userId: string): Observable<SaleOfferType[]> {
    const params = new HttpParams()
      .set(SaleOffersQueryParamMapping.userId, userId) 
      .set(SaleOffersQueryParamMapping.pageNumber, '1')
      .set(SaleOffersQueryParamMapping.pageSize, '50');
    return this.httpClient
      .get<PagedListModel<SaleOfferType>>(this.saleOffersEndpoint, { params })
      .pipe(map(response => response.items));
  }

    getOffersByBrand(brandId: number, limit: number): Observable<SaleOfferType[]> {
      const params = new HttpParams()
        .set(SaleOffersQueryParamMapping.brandId, brandId.toString())
        .set(SaleOffersQueryParamMapping.pageSize, limit.toString())
        .set(SaleOffersQueryParamMapping.pageNumber, '1');

      return this.httpClient
        .get<PagedListModel<SaleOfferType>>(this.saleOffersEndpoint, { params })
        .pipe(map(response => response.items ?? []));
    }
}
