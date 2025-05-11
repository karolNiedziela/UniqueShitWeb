import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { CreatePurchaseOfferDto } from '../models/create-purchase-offer.dto';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOfferService {
  private httpClient = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/purchase-offers`;

  createPurchaseOffer(dto: CreatePurchaseOfferDto): Observable<CreatePurchaseOfferDto> {
    return this.httpClient
      .post<CreatePurchaseOfferDto>(this.endpoint, dto)
      .pipe(tap(() => console.log('Purchase offer created')));
  }
}
