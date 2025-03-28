import { Observable } from 'rxjs';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { BrandsService } from '../../brands/services/brands.service';
import { PagedListModel } from '../../../shared/components/models/paged-list-model';
import { ColourService } from '../../colours/services/colour.service';
import { ProductCategoryService } from '../../product-categories/services/product-category.service';
import { SizeService } from '../../sizes/services/size.service';
import { CommonModule } from '@angular/common';
import { FilledButtonComponent } from '../../../shared/components/buttons/filled-button/filled-button.component';
import { ChipsComponent } from '../../../shared/components/chips/chips.component';
import { OfferCardComponent } from '../offer-card/offer-card.component';
import { OfferModel } from '../models/offer.model';
import { OfferService } from '../services/offer.service';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { OptionSetType } from '../../../shared/components/models/option-set.model';

@Component({
  selector: 'app-offers-list',
  imports: [
    CommonModule,
    SelectComponent,
    FilledButtonComponent,
    ChipsComponent,
    OfferCardComponent,
    AutocompleteComponent,
  ],
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
  standalone: true,
})
export class OffersListComponent implements OnInit {
  @ViewChild('productCategorySelect') productCategorySelect!: SelectComponent;
  @ViewChild('brandAutocomplete') brandAutocomplete!: AutocompleteComponent;
  @ViewChild('itemConditionSelect') itemConditionSelect!: SelectComponent;
  @ViewChild('colourSelect') colourSelect!: SelectComponent;
  @ViewChild('sizeSelect') sizeSelect!: SelectComponent;

  offers$!: Observable<PagedListModel<OfferModel>>;

  offerService = inject(OfferService);
  brandService = inject(BrandsService);
  colourService = inject(ColourService);
  productCategoryService = inject(ProductCategoryService);
  sizeService = inject(SizeService);

  itemConditionOptions = signal<OptionSetType[]>([]);

  filtersVisible = signal<boolean>(false);

  appliedFilters = signal<(SelectComponent | AutocompleteComponent)[]>([]);

  ngOnInit(): void {
    this.getOffers();
  }

  onColourChange(value: number | null): void {
    this.tryAddAppliedFilter(this.colourSelect);
  }

  onProductCategoryChange(selectedOption: OptionSetType | null): void {
    this.sizeService.productCategoryId.set(selectedOption?.id ?? null);
    this.onChipRemoved(this.sizeSelect);

    if (!selectedOption) {
      return;
    }

    this.tryAddAppliedFilter(this.productCategorySelect);
  }

  onItemConditionChange(value: number | null): void {}

  onBrandSelected(selectedOption: OptionSetType | null): void {
    this.tryAddAppliedFilter(this.brandAutocomplete);
  }

  onSizeChange(selectedOption: OptionSetType | null): void {
    this.tryAddAppliedFilter(this.sizeSelect);
  }

  toggleFilters() {
    this.filtersVisible.set(!this.filtersVisible());
  }

  tryAddAppliedFilter(filter: SelectComponent | AutocompleteComponent) {
    if (filter.selectedOption() == null) {
      return;
    }

    const existingFilter = this.appliedFilters().find(
      (appliedFilter) => appliedFilter == filter
    );
    if (existingFilter) {
      return;
    }

    this.appliedFilters.update((filters) => [...filters, filter]);
  }

  onChipRemoved(filter: SelectComponent | AutocompleteComponent) {
    this.appliedFilters.update((filters) =>
      filters.filter((appliedFilter) => appliedFilter !== filter)
    );

    filter.clear();
  }

  onSearchTermChanged(searchTerm: string) {
    this.brandService.searchTerm.set(searchTerm);
  }

  private getOffers(): void {
    this.offerService.getOffers(1, 1, 50);
  }
}
