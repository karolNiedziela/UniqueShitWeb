import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { OptionSetType } from '../../../shared/components/models/option-set.model';
import {
  ItemConditionType,
  ItemCondtionArraySchema,
} from '../models/item-conditions.model';

@Injectable({
  providedIn: 'root',
})
export class ItemConditionService {
  private itemConditionsEndpointUrl: string = `${environment.apiUrl}/item-conditions`;

  itemConditionOptions = httpResource<OptionSetType[]>(
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
          })
        ),
    }
  );
}
