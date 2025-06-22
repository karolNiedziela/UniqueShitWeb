import { SaleOfferService } from './../../../modules/offers/sale-offers/services/sale-offer.service';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModelsService } from '../../../modules/models/services/models.service';
import { ModelType } from '../../../modules/models/models/model.model';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  DefaultSaleOfferQueryParameters,
  SaleOfferQueryParameters,
  SaleOffersQueryParamMapping,
} from '../../../modules/offers/sale-offers/models/sale-offers-query-parameters.model';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  Subscription,
} from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-global-search-bar',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './global-search-bar.component.html',
  styleUrl: './global-search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchBarComponent implements OnInit, OnDestroy {
  modelService = inject(ModelsService);
  router = inject(Router);
  SaleOfferService = inject(SaleOfferService);
  destroyRef = inject(DestroyRef);

  globalSearchForm!: FormGroup;

  inputSearch = new FormControl<ModelType | null>(null);

  private resizeSub!: Subscription;
  isSmallScreen = signal(false);

  ngOnInit(): void {
    this.globalSearchForm = new FormGroup({
      inputSearch: new FormControl<ModelType | null>(null),
    });

    this.resizeSub = fromEvent(window, 'resize').subscribe(() => {
      this.checkScreenSize();
    });
    this.checkScreenSize();

    this.inputSearch.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
        filter((value) => typeof value === 'string')
      )
      .subscribe((searchTerm: string) => {
        this.modelService.modelQueryParameters.update((params) => ({
          ...params,
          searchTerm,
        }));
      });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

  onOptionSelected(model: ModelType): void {
    if (model && model.id) {
      const queryParams = {
        [SaleOffersQueryParamMapping.pageNumber]:
          DefaultSaleOfferQueryParameters.pageNumber,
        [SaleOffersQueryParamMapping.pageSize]:
          DefaultSaleOfferQueryParameters.pageSize,
        [SaleOffersQueryParamMapping.modelId]: model.id,
        [SaleOffersQueryParamMapping.brandId]: model.brandId,
        [SaleOffersQueryParamMapping.productCategoryId]:
          model.productCategoryId,
      };

      const saleOfferQueryParameters: SaleOfferQueryParameters = {
        ...DefaultSaleOfferQueryParameters,
        productCategoryId: model.productCategoryId ?? undefined,
        brandId: model.brandId ?? undefined,
        modelId: model.id ?? undefined,
      };

      this.SaleOfferService.offersQueryParameters.update((q) => ({
        ...DefaultSaleOfferQueryParameters,
        ...saleOfferQueryParameters,
      }));

      this.router.navigate(['/sale-offers'], {
        queryParams: queryParams,
      });
    }
  }

  displayFn(model: ModelType): string {
    return model ? model.name : '';
  }

  private checkScreenSize(): void {
    this.isSmallScreen.set(window.innerWidth <= 640);
  }
}
