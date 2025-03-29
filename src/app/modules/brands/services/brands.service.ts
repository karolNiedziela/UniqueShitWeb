import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { OptionSetType } from '../../../shared/components/models/option-set.model';
import { BrandArraySchema, BrandType } from '../models/brand.model';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private brandEndpointUrl: string = `${environment.apiUrl}/brands`;

  brandOptions = httpResource<OptionSetType[]>(
    () => ({
      url: `${this.brandEndpointUrl}`,
    }),
    {
      defaultValue: [],
      parse: (data) =>
        BrandArraySchema.parse(data).map((brand: BrandType) => ({
          id: brand.id,
          value: brand.name,
        })),
    }
  );
}
