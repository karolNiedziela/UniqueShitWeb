import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BrandModel } from '../models/brand.model';
import { Observable } from 'rxjs';
import { PagedListModel } from '../../../shared/components/models/paged-list-model';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private brandEndpointUrl: string = `${environment.apiUrl}/brands`;

  private defaultHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private http = inject(HttpClient);

  get(): Observable<PagedListModel<BrandModel>> {
    return this.http.get<PagedListModel<BrandModel>>(
      `${this.brandEndpointUrl}`,
      this.defaultHttpOptions
    );
  }
}
