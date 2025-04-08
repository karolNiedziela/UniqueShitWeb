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
import { Subject, takeUntil } from 'rxjs';
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

@Component({
  selector: 'app-offers-list-filters',
  imports: [
    MatButtonModule,
    SelectComponent,
    ReactiveFormsModule,
    CommonModule,
    ChipsComponent,
    AutocompleteComponent,
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

  appliedFilters = signal<Chip[]>([]);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      productCategory: new FormControl<OptionSet | null>(null),
      colour: new FormControl<OptionSet | null>(null),
      itemCondition: new FormControl<OptionSet | null>(null),
      size: new FormControl<OptionSet | null>(null),
      brand: new FormControl<OptionSet | null>(null),
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
    };

    this.offerService.offersQueryParameters.set(queryParameters);
    this.toggleFilters();
  }

  onChipRemoved(chip: Chip) {
    this.appliedFilters.update((filters) =>
      filters.filter((appliedFilter) => appliedFilter !== chip)
    );

    this.form.get(chip.formControlName)?.setValue(null);
  }

  private trackFormControlChanges(): void {
    const handleValueChange = (
      controlName: string,
      value: OptionSet | null
    ) => {
      if (controlName === 'productCategory') {
        this.handleProductCategoryChange(value);
      }

      if (!value) {
        this.removeFilterByControlName(controlName);
        return;
      }

      this.updateAppliedFilters(controlName, value);
    };

    Object.keys(this.form.controls).forEach((controlName) => {
      this.form
        .get(controlName)
        ?.valueChanges.pipe(takeUntil(this._onDestroy))
        .subscribe((value: OptionSet | null) =>
          handleValueChange(controlName, value)
        );
    });
  }

  private handleProductCategoryChange(value: OptionSet | null): void {
    this.sizeService.productCategoryId.set(value?.id ?? null);
    this.removeFilterByControlName('size');
  }

  private removeFilterByControlName(controlName: string): void {
    this.appliedFilters.update((appliedFilters) =>
      appliedFilters.filter(
        (appliedFilter) => appliedFilter.formControlName !== controlName
      )
    );
  }

  private updateAppliedFilters(controlName: string, value: OptionSet): void {
    if (
      !value ||
      typeof value !== 'object' ||
      !('id' in value) ||
      !('value' in value)
    ) {
      return;
    }

    this.appliedFilters.update((appliedFilters) => {
      const updatedFilters = appliedFilters.filter(
        (appliedFilter) => appliedFilter.formControlName !== controlName
      );

      updatedFilters.push({
        name: value.value,
        viewValue: value.viewValue,
        formControlName: controlName,
      });

      return updatedFilters;
    });
  }
}
