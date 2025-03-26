import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OfferModel } from '../models/offer.model';
import { PagedListModel } from '../../../shared/components/models/paged-list-model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  private offersEndpoint: string = `${environment.apiUrl}/offers`;
  private defaultHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private http = inject(HttpClient);

  private offersSignal = signal<PagedListModel<OfferModel>>({
    hasNextPage: false,
    hasPreviosPage: false,
    items: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
  });
  private loadingOffersSignal = signal<boolean>(false);

  getOffers(otid: number, pn: number, ps: number) {
    this.loadingOffersSignal.set(true);

    const url = `${this.offersEndpoint}?otid=${otid}&pn=${pn}&ps=${ps}`;
    this.http
      .get<PagedListModel<OfferModel>>(url, this.defaultHttpOptions)
      .subscribe((offers: PagedListModel<OfferModel>) => {
        this.offersSignal.set(offers);
        this.loadingOffersSignal.set(false);
      });
  }

  get offers(): Signal<PagedListModel<OfferModel>> {
    return this.offersSignal;
  }

  get isLoadingOffers(): Signal<boolean> {
    return this.loadingOffersSignal;
  }
}
