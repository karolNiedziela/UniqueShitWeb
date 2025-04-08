import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import {
  ItemConditionType,
  ItemCondtionArraySchema,
} from '../models/item-conditions.model';
import { OptionSet } from '../../../shared/models/option-set.model';

@Injectable({
  providedIn: 'root',
})
export class ItemConditionService {
  private itemConditionsEndpointUrl: string = `${environment.apiUrl}/item-conditions`;

  itemConditionOptions = httpResource<OptionSet[]>(
    () => ({
      url: `${this.itemConditionsEndpointUrl}`,
    }),
    {
      defaultValue: [],
      parse: (data) =>
        ItemCondtionArraySchema.parse(data).map(
          (itemCondition: ItemConditionType) => ({
            id: itemCondition.id,
            value: itemCondition.name,
            viewValue: `${itemCondition.id}-${itemCondition.name}}`,
          })
        ),
    }
  );
}
