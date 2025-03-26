import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SizesModel } from '../models/sizes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  private sizesEndpointUrl: string = `${environment.apiUrl}/sizes`;

  private defaultHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private http = inject(HttpClient);

  get(productCategoryId: number): Observable<SizesModel[]> {
    return this.http.get<SizesModel[]>(
      `${this.sizesEndpointUrl}?productCategoryId=${productCategoryId}`,
      this.defaultHttpOptions
    );
  }
}
