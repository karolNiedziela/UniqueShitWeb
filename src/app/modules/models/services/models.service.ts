import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ModelArraySchema, ModelType } from '../models/model.model';
import { HttpParams, httpResource } from '@angular/common/http';
import { ModelQueryParameters } from '../models/model-query-parameters.model';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  private modelsEndpointUrl: string = `${environment.apiUrl}/models`;

  modelQueryParameters = signal<ModelQueryParameters>({});

  modelParams = computed<HttpParams>(() => {
    let params = new HttpParams();

    Object.entries(this.modelQueryParameters()).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });

    return params;
  });

  models = httpResource<ModelType[]>(
    () => {
      return {
        url: `${this.modelsEndpointUrl}?${this.modelParams()}`,
      };
    },
    {
      defaultValue: [],
      parse: (data) => ModelArraySchema.parse(data),
    }
  );
}
