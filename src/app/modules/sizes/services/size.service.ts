import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { SizeArraySchema, SizeType } from '../models/sizes.model';
import { OptionSet } from '../../../shared/models/option-set.model';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  private sizesEndpointUrl: string = `${environment.apiUrl}/sizes`;

  productCategoryId = signal<number | null>(null);

  sizeOptions = httpResource<OptionSet[]>(
    () => {
      if (this.productCategoryId() === null) {
        return undefined;
      }
      return {
        url: `${
          this.sizesEndpointUrl
        }?productCategoryId=${this.productCategoryId()}`,
      };
    },
    {
      defaultValue: [],
      parse: (data) =>
        SizeArraySchema.parse(data).map((size: SizeType) => ({
          id: size.id,
          value: size.value,
          viewValue: `${size.id}-${size.value}}`,
        })),
    }
  );
}
