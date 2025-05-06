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
import { distinctUntilChanged, filter, skip, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import {
  DefaultOfferQueryParameters,
  OfferQueryParameters,
} from '../models/sale-offers-query-parameters.model';
import { SaleOfferListFiltersControlName } from './sale-offers-list-filters.controls';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductCategoryService } from '../../../product-categories/services/product-category.service';
import { ColourService } from '../../../colours/services/colour.service';
import { ItemConditionService } from '../../../item-conditions/services/item-condition.service';
import { SizeService } from '../../../sizes/services/size.service';
import { BrandsService } from '../../../brands/services/brands.service';
import { SaleOfferService } from '../services/sale-offer.service';
import { ModelsService } from '../../../models/services/models.service';
import {
  Chip,
  ChipsComponent,
} from '../../../../shared/components/chips/chips.component';
import { OptionSet } from '../../../../shared/models/option-set.model';
import { ModelType } from '../../../models/models/model.model';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { ModelsAutocompleteComponent } from '../../../models/models-autocomplete/models-autocomplete.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';

@Component({
  selector: 'app-sale-offers-list-filters',
  imports: [
    MatButtonModule,
    SelectComponent,
    ReactiveFormsModule,
    CommonModule,
    ChipsComponent,
    AutocompleteComponent,
    ModelsAutocompleteComponent,
  ],
  templateUrl: './sale-offers-list-filters.component.html',
  styleUrl: './sale-offers-list-filters.component.scss',
})
export class SaleOffersListFiltersComponent implements OnInit {
  visible = input<boolean>(false);
  filtersToggled = output();

  productCategoryService = inject(ProductCategoryService);
  colourService = inject(ColourService);
  itemConditionService = inject(ItemConditionService);
  sizeService = inject(SizeService);
  brandService = inject(BrandsService);
  saleOfferService = inject(SaleOfferService);
  modelService = inject(ModelsService);
  destroyRef = inject(DestroyRef);

  appliedFilters = signal<Chip[]>([]);

  filterOffersForm!: FormGroup;

  ngOnInit(): void {
    this.filterOffersForm = new FormGroup({
      [SaleOfferListFiltersControlName.ProductCategory]:
        new FormControl<OptionSet | null>(null),
      [SaleOfferListFiltersControlName.Colour]:
        new FormControl<OptionSet | null>(null),
      [SaleOfferListFiltersControlName.ItemCondition]:
        new FormControl<OptionSet | null>(null),
      [SaleOfferListFiltersControlName.Size]: new FormControl<OptionSet | null>(
        null
      ),
      [SaleOfferListFiltersControlName.Brand]:
        new FormControl<OptionSet | null>(null),
      [SaleOfferListFiltersControlName.Model]:
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
      productCategoryId: formValues.productCategory?.id ?? undefined,
      itemConditionId: formValues.itemCondition?.id ?? undefined,
      brandId: formValues.brand?.id ?? undefined,
      sizeId: formValues.size?.id ?? undefined,
      modelId: formValues.model?.id ?? undefined,
    };

    this.saleOfferService.offersQueryParameters.set(queryParameters);
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
      case SaleOfferListFiltersControlName.ProductCategory:
        this.handleProductCategoryChange(value as OptionSet | null);
        break;

      case SaleOfferListFiltersControlName.Model:
        this.handleModelChange(controlName, value as ModelType | null);
        break;

      case SaleOfferListFiltersControlName.Brand:
        this.handleBrandChange(value as OptionSet | null);
        break;
    }

    if (!value) {
      this.removeFilterByControlName(controlName);
      return;
    }

    if (controlName !== SaleOfferListFiltersControlName.Model) {
      this.updateAppliedFilters(controlName, value as OptionSet);
    }
  }

  private handleProductCategoryChange(value: OptionSet | null): void {
    this.sizeService.productCategoryId.set(value?.id ?? null);
    this.modelService.modelQueryParameters.update((params) => ({
      ...params,
      productCategoryId: value?.id ?? undefined,
      searchTerm: '',
    }));

    this.removeFilterByControlName(SaleOfferListFiltersControlName.Size);
    this.removeFilterByControlName(SaleOfferListFiltersControlName.Model);
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

    this.removeFilterByControlName(SaleOfferListFiltersControlName.Model);
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
