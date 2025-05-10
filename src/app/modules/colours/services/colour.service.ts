import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { httpResource } from '@angular/common/http';
import { ColourArraySchema, ColourType } from '../models/colour.model';
import { OptionSet } from '../../../shared/models/option-set.model';

@Injectable({
  providedIn: 'root',
})
export class ColourService {
  private colourEndpointUrl: string = `${environment.apiUrl}/colours`;

  colourOptions = httpResource<OptionSet[]>(
    () => ({
      url: `${this.colourEndpointUrl}`,
    }),
    {
      defaultValue: [],
      parse: (data) =>
        ColourArraySchema.parse(data).map((colour: ColourType) => ({
          id: colour.id,
          value: colour.name,
          viewValue: `${colour.id}-${colour.name}}`,
        })),
    }
  );
}
