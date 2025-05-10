import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { DeliveryTypeArraySchema, DeliveryType } from '../models/delivery-types.model';
import { OptionSet } from '../../../shared/models/option-set.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryTypeService {
  private deliveryTypesEndpointUrl = `${environment.apiUrl}/delivery-types`;

  deliveryTypeOptions = httpResource<OptionSet[]>(
    () => ({ url: this.deliveryTypesEndpointUrl }),
    {
      defaultValue: [],
      parse: (data) =>
        DeliveryTypeArraySchema.parse(data).map((dt: DeliveryType) => ({
          id: dt.id,
          value: dt.name,
          viewValue: `${dt.id}-${dt.name}`,
        })),
    }
  );
}