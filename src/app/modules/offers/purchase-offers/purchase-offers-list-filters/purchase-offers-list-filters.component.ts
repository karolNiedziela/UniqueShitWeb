import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, filter, skip } from 'rxjs';
import { CommonModule } from '@angular/common';

import {
  DefaultOfferQueryParameters,
  OfferQueryParameters,
} from '../models/purchase-offers-query-parameters.model';
import { PurchaseOffersListFiltersControlName } from './purchase-offers-list-filters.controls';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrandsService } from '../../../brands/services/brands.service';
import { PurchaseOfferService } from '../services/purchase-offer.service';
import { ModelsService } from '../../../models/services/models.service';
import {
  Chip,
  ChipsComponent,
} from '../../../../shared/components/chips/chips.component';
import { OptionSet } from '../../../../shared/models/option-set.model';
import { ModelType } from '../../../models/models/model.model';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { ModelsAutocompleteComponent } from '../../../models/models-autocomplete/models-autocomplete.component';

@Component({
  selector: 'app-purchase-offers-list-filters',
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    ChipsComponent,
    AutocompleteComponent,
    ModelsAutocompleteComponent,
  ],
  templateUrl: './purchase-offers-list-filters.component.html',
  styleUrl: './purchase-offers-list-filters.component.scss',
})
export class PurchaseOffersListFiltersComponent implements OnInit {
  visible = input<boolean>(false);
  filtersToggled = output();

  brandService = inject(BrandsService);
  purchaseOfferService = inject(PurchaseOfferService);
  modelService = inject(ModelsService);
  destroyRef = inject(DestroyRef);

  appliedFilters = signal<Chip[]>([]);

  filterOffersForm!: FormGroup;

  ngOnInit(): void {
    this.filterOffersForm = new FormGroup({
      [PurchaseOffersListFiltersControlName.Brand]:
        new FormControl<OptionSet | null>(null),
      [PurchaseOffersListFiltersControlName.Model]:
        new FormControl<ModelType | null>(null),
    });

    this.trackFormControlChanges();
  }

  toggleFilters(): void {
    this.filtersToggled.emit();
  }

  applyFilters(): void {
    const formValues = this.filterOffersForm.value;

    const queryParameters: OfferQueryParameters = {
      ...DefaultOfferQueryParameters,
      brandId: formValues.brand?.id ?? undefined,
      modelId: formValues.model?.id ?? undefined,
    };

    this.purchaseOfferService.offersQueryParameters.set(queryParameters);
    this.toggleFilters();
  }

  clearFilters(): void {
    this.filterOffersForm.reset();
  }

  onChipRemoved(chip: Chip) {
    this.appliedFilters.update((filters) =>
      filters.filter((appliedFilter) => appliedFilter !== chip)
    );

    this.filterOffersForm.get(chip.formControlName)?.setValue(null);
  }

  private trackFormControlChanges(): void {
    Object.keys(this.filterOffersForm.controls).forEach((controlName) => {
      this.filterOffersForm
        .get(controlName)
        ?.valueChanges.pipe(
          skip(1),
          distinctUntilChanged(),
          takeUntilDestroyed(this.destroyRef),
          filter((value) => typeof value === 'object' || value === null)
        )
        .subscribe((value: OptionSet | null | ModelType) => {
          this.handleValueChange(controlName, value);
        });
    });
  }

  private handleValueChange(controlName: string, value: unknown): void {
    switch (controlName) {
      case PurchaseOffersListFiltersControlName.Model:
        this.handleModelChange(controlName, value as ModelType | null);
        break;

      case PurchaseOffersListFiltersControlName.Brand:
        this.handleBrandChange(value as OptionSet | null);
        break;
    }

    if (!value) {
      this.removeFilterByControlName(controlName);
      return;
    }

    if (controlName !== PurchaseOffersListFiltersControlName.Model) {
      this.updateAppliedFilters(controlName, value as OptionSet);
    }
  }

  private handleModelChange(controlName: string, value: ModelType | null) {
    if (!value) {
      return;
    }

    const model = value as ModelType;
    const optionSet: OptionSet = {
      id: model.id,
      value: model.name,
      viewValue: `${model.id}-${model.name}`,
    };

    this.updateAppliedFilters(controlName, optionSet);
  }

  private handleBrandChange(value: OptionSet | null): void {
    this.modelService.modelQueryParameters.update((params) => ({
      ...params,
      brandId: value?.id ?? undefined,
      searchTerm: '',
    }));

    this.removeFilterByControlName(PurchaseOffersListFiltersControlName.Model);
  }

  private removeFilterByControlName(controlName: string): void {
    this.appliedFilters.update((appliedFilters) =>
      appliedFilters.filter(
        (appliedFilter) => appliedFilter.formControlName !== controlName
      )
    );

    this.filterOffersForm.get(controlName)?.setValue(null);
  }

  private updateAppliedFilters(
    controlName: string,
    optionSet: OptionSet
  ): void {
    this.appliedFilters.update((appliedFilters) => {
      const updatedFilters = appliedFilters.filter(
        (appliedFilter) => appliedFilter.formControlName !== controlName
      );

      updatedFilters.push({
        name: optionSet?.value,
        viewValue: optionSet?.viewValue,
        formControlName: controlName,
      });

      return updatedFilters;
    });
  }
}
