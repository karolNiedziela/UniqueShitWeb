import { SaleOfferService } from './../../../modules/offers/sale-offers/services/sale-offer.service';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
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
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-global-search-bar',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  templateUrl: './global-search-bar.component.html',
  styleUrl: './global-search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchBarComponent implements OnInit, OnDestroy {
  modelService = inject(ModelsService);
  router = inject(Router);
  SaleOfferService = inject(SaleOfferService);

  @ViewChild('inputSearch') inputSearch!: ElementRef<HTMLInputElement>;

  private resizeSub!: Subscription;
  isSmallScreen = signal(false);

  ngOnInit(): void {
    this.resizeSub = fromEvent(window, 'resize').subscribe(() => {
      this.checkScreenSize();
    });
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

  onOptionSelected(model: ModelType): void {
    if (model && model.id) {
      console.log('Selected model:', model);
      this.inputSearch.nativeElement.value = '';

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
