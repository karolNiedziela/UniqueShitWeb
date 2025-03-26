import { Observable } from 'rxjs';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  SelectComponent,
  SelectOptionType,
} from '../../../shared/components/select/select.component';
import { BrandsService } from '../../brands/services/brands.service';
import { BrandModel } from '../../brands/models/brand.model';
import { PagedListModel } from '../../../shared/components/models/paged-list-model';
import { ColourService } from '../../colours/services/colour.service';
import { ProductCategoryService } from '../../product-categories/services/product-category.service';
import { SizeService } from '../../sizes/services/size.service';
import { SizesModel } from '../../sizes/models/sizes.model';
import { CommonModule } from '@angular/common';
import { FilledButtonComponent } from '../../../shared/components/buttons/filled-button/filled-button.component';
import { ChipsComponent } from '../../../shared/components/chips/chips.component';
import { OfferCardComponent } from '../offer-card/offer-card.component';
import { OfferModel } from '../models/offer.model';
import { OfferService } from '../services/offer.service';

@Component({
  selector: 'app-offers-list',
  imports: [
    CommonModule,
    SelectComponent,
    FilledButtonComponent,
    ChipsComponent,
    OfferCardComponent,
  ],
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
  standalone: true,
})
export class OffersListComponent implements OnInit {
  @ViewChild('productCategorySelect') productCategorySelect!: SelectComponent;
  @ViewChild('brandSelect') brandSelect!: SelectComponent;
  @ViewChild('itemConditionSelect') itemConditionSelect!: SelectComponent;
  @ViewChild('colourSelect') colourSelect!: SelectComponent;
  @ViewChild('sizeSelect') sizeSelect!: SelectComponent;

  offers$!: Observable<PagedListModel<OfferModel>>;

  offerService = inject(OfferService);
  brandService = inject(BrandsService);
  colourService = inject(ColourService);
  productCategoryService = inject(ProductCategoryService);
  sizeService = inject(SizeService);

  itemConditionOptions = signal<SelectOptionType[]>([]);
  brandsOptions = signal<SelectOptionType[]>([]);
  sizeOptions = signal<SelectOptionType[]>([]);

  filtersVisible = signal<boolean>(false);

  appliedFilters = signal<SelectComponent[]>([]);

  ngOnInit(): void {
    this.getOffers();
    this.getBrands();
  }

  onColourChange(value: number | null): void {
    this.updateFilter(this.colourSelect);
  }

  onProductCategoryChange(value: number | null): void {
    this.sizeOptions.set([]);
    this.clearFilter(this.sizeSelect);

    if (!value) {
      return;
    }

    this.updateFilter(this.productCategorySelect);

    this.sizeService.get(value).subscribe({
      next: (sizes: SizesModel[]) => {
        this.sizeOptions.set(
          sizes.map((sizesModel: SizesModel) => ({
            id: sizesModel.id,
            value: sizesModel.value,
          }))
        );
      },
      error: (error) => {
        console.error('Error fetching sizes:', error);
      },
      complete: () => {},
    });
  }

  onItemConditionChange(value: number | null): void {}

  onBrandChanged(value: number | null): void {
    this.updateFilter(this.brandSelect);
  }

  onSizeChange(value: number | null): void {
    this.updateFilter(this.sizeSelect);
  }

  toggleFilters() {
    this.filtersVisible.set(!this.filtersVisible());
  }

  updateFilter(filter: SelectComponent) {
    if (filter.selectedValue() == null) {
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

  clearFilter(filter: SelectComponent) {
    this.appliedFilters.update((filters) =>
      filters.filter((appliedFilter) => appliedFilter !== filter)
    );

    filter.clearSelection();
  }

  private getOffers(): void {
    this.offerService.getOffers(1, 1, 50);
  }

  private getBrands(): void {
    this.brandService.get().subscribe({
      next: (brands: PagedListModel<BrandModel>) => {
        this.brandsOptions.set(
          brands.items.map((brand: BrandModel) => ({
            id: brand.id,
            value: brand.name,
          }))
        );
      },
      error: (error) => {
        console.error('Error fetching filters:', error);
      },
      complete: () => {},
    });
  }
}
