import { ModelType } from './../../models/models/model.model';
import { OptionSet } from './../../../shared/models/option-set.model';
import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProductCategoryService } from '../../product-categories/services/product-category.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, filter, skip, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  Chip,
  ChipsComponent,
} from '../../../shared/components/chips/chips.component';
import { ItemConditionService } from '../../item-conditions/services/item-condition.service';
import { SizeService } from '../../sizes/services/size.service';
import { OfferService } from '../services/offer.service';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { ColourService } from '../../colours/services/colour.service';
import { BrandsService } from '../../brands/services/brands.service';
import {
  DefaultOfferQueryParameters,
  OfferQueryParameters,
} from '../models/offers-query-parameters.model';
import { ModelsAutocompleteComponent } from '../../models/models-autocomplete/models-autocomplete.component';
import { ModelsService } from '../../models/services/models.service';

@Component({
  selector: 'app-offers-list-filters',
  imports: [
    MatButtonModule,
    SelectComponent,
    ReactiveFormsModule,
    CommonModule,
    ChipsComponent,
    AutocompleteComponent,
    ModelsAutocompleteComponent,
  ],
  templateUrl: './offers-list-filters.component.html',
  styleUrl: './offers-list-filters.component.scss',
})
export class OffersListFiltersComponent implements OnInit, OnDestroy {
  private _onDestroy = new Subject<void>();

  visible = input<boolean>(false);
  filtersToggled = output();

  productCategoryService = inject(ProductCategoryService);
  colourService = inject(ColourService);
  itemConditionService = inject(ItemConditionService);
  sizeService = inject(SizeService);
  brandService = inject(BrandsService);
  offerService = inject(OfferService);
  modelService = inject(ModelsService);

  appliedFilters = signal<Chip[]>([]);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      productCategory: new FormControl<OptionSet | null>(null),
      colour: new FormControl<OptionSet | null>(null),
      itemCondition: new FormControl<OptionSet | null>(null),
      size: new FormControl<OptionSet | null>(null),
      brand: new FormControl<OptionSet | null>(null),
      model: new FormControl<ModelType | null>(null),
    });

    this.trackFormControlChanges();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  toggleFilters(): void {
    this.filtersToggled.emit();
  }

  applyFilters(): void {
    const formValues = this.form.value;

    const queryParameters: OfferQueryParameters = {
      ...DefaultOfferQueryParameters,
      productCategoryId: formValues.productCategory?.id ?? undefined,
      itemConditionId: formValues.itemCondition?.id ?? undefined,
      brandId: formValues.brand?.id ?? undefined,
      sizeId: formValues.size?.id ?? undefined,
      modelId: formValues.model?.id ?? undefined,
    };

    this.offerService.offersQueryParameters.set(queryParameters);
    this.toggleFilters();
  }

  clearFilters(): void {
    this.form.reset();
  }

  onChipRemoved(chip: Chip) {
    this.appliedFilters.update((filters) =>
      filters.filter((appliedFilter) => appliedFilter !== chip)
    );

    this.form.get(chip.formControlName)?.setValue(null);
  }

  private trackFormControlChanges(): void {
    Object.keys(this.form.controls).forEach((controlName) => {
      this.form
        .get(controlName)
        ?.valueChanges.pipe(
          skip(1),
          distinctUntilChanged(),
          takeUntil(this._onDestroy),
          filter((value) => typeof value === 'object' || value === null)
        )
        .subscribe((value: OptionSet | null | ModelType) => {
          this.handleValueChange(controlName, value);
        });
    });
  }

  private handleValueChange(
    controlName: string,
    value: OptionSet | null | ModelType
  ) {
    switch (controlName) {
      case 'productCategory':
        this.handleProductCategoryChange(value);
        break;

      case 'model':
        this.handleModelChange(controlName, value);
        break;

      case 'brand':
        this.handleBrandChange(value);
        break;
    }

    if (!value) {
      this.removeFilterByControlName(controlName);
      return;
    }

    if (controlName !== 'model') {
      this.updateAppliedFilters(controlName, value as OptionSet);
    }
  }

  private handleProductCategoryChange(
    value: OptionSet | null | ModelType
  ): void {
    this.sizeService.productCategoryId.set(value?.id ?? null);
    this.modelService.modelQueryParameters.update((params) => ({
      ...params,
      productCategoryId: value?.id ?? undefined,
    }));

    this.removeFilterByControlName('size');
    this.removeFilterByControlName('model');
  }

  private handleModelChange(
    controlName: string,
    value: OptionSet | null | ModelType
  ) {
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

  private handleBrandChange(value: OptionSet | null | ModelType): void {
    this.modelService.modelQueryParameters.update((params) => ({
      ...params,
      brandId: value?.id ?? undefined,
    }));

    this.removeFilterByControlName('model');
  }

  private removeFilterByControlName(controlName: string): void {
    this.appliedFilters.update((appliedFilters) =>
      appliedFilters.filter(
        (appliedFilter) => appliedFilter.formControlName !== controlName
      )
    );

    this.form.get(controlName)?.setValue(null);
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
