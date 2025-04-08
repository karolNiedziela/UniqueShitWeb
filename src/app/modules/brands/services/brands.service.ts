import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { BrandArraySchema, BrandType } from '../models/brand.model';
import { OptionSet } from '../../../shared/models/option-set.model';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private brandEndpointUrl: string = `${environment.apiUrl}/brands`;

  brandOptions = httpResource<OptionSet[]>(
    () => ({
      url: `${this.brandEndpointUrl}`,
    }),
    {
      defaultValue: [],
      parse: (data) =>
        BrandArraySchema.parse(data).map((brand: BrandType) => ({
          id: brand.id,
          value: brand.name,
          viewValue: `${brand.id}-${brand.name}`,
        })),
    }
  );
}
