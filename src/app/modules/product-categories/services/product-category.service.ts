import {
  ProductCategoryArraySchema,
  ProductCategoryType,
} from './../models/product-category.model';
import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { OptionSetType } from '../../../shared/components/models/option-set.model';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private productCategoryEndpointUrl: string = `${environment.apiUrl}/product-categories`;

  productCategoriesOptions = httpResource<OptionSetType[]>(
    () => ({
      url: `${this.productCategoryEndpointUrl}`,
    }),
    {
      defaultValue: [],
      parse: (data) =>
        ProductCategoryArraySchema.parse(data).map(
          (productCategory: ProductCategoryType) => ({
            id: productCategory.id,
            value: productCategory.name,
          })
        ),
    }
  );
}
