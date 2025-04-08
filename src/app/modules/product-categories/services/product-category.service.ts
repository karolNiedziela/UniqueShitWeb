import {
  ProductCategoryArraySchema,
  ProductCategoryType,
} from './../models/product-category.model';
import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { OptionSet } from '../../../shared/models/option-set.model';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private productCategoryEndpointUrl: string = `${environment.apiUrl}/product-categories`;

  productCategoriesOptions = httpResource<OptionSet[]>(
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
            viewValue: `${productCategory.id}-${productCategory.name}}`,
          })
        ),
    }
  );
}
