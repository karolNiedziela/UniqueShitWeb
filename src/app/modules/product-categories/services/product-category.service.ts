import {
  ProductCategoryArraySchema,
  ProductCategoryType,
} from './../models/product-category.model';
import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { SelectOptionType } from '../../../shared/components/select/select.component';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private productCategoryEndpointUrl: string = `${environment.apiUrl}/product-categories`;

  productCategoriesOptions = httpResource<SelectOptionType[]>(
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
