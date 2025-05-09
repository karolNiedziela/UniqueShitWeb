import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { PaymentTypeArraySchema, PaymentType } from '../models/payment-types.model';
import { OptionSet } from '../../../shared/models/option-set.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentTypeService {
  private PaymentTypesEndpointUrl = `${environment.apiUrl}/payment-types`;

  paymentTypeOptions = httpResource<OptionSet[]>(
    () => ({ url: this.PaymentTypesEndpointUrl }),
    {
      defaultValue: [],
      parse: (data) =>
        PaymentTypeArraySchema.parse(data).map((pt: PaymentType) => ({
          id: pt.id,
          value: pt.name,
          viewValue: `${pt.id}-${pt.name}`,
        })),
    }
  );
}