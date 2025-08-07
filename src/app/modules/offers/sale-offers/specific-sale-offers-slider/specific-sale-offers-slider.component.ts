import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  input,
  signal,
  effect,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleOfferService } from '../services/sale-offer.service';
import { SaleOfferCardHomeComponent } from '../sale-offer-card-home/sale-offer-card-home.component';
import { SaleOfferType } from '../models/sale-offer.model';


@Component({
  selector: 'app-specific-sale-offers-slider',
  imports: [CommonModule, SaleOfferCardHomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './specific-sale-offers-slider.component.html',
  styleUrl: './specific-sale-offers-slider.component.scss'
})


export class SpecificSaleOffersSliderComponent implements AfterViewInit {
  @ViewChild('swiperRef', { static: true })
  swiperRef!: ElementRef<HTMLElement & { initialize(): void }>;

  readonly brandId = input.required<number>();
  readonly brandName = input.required<string>();
  readonly sliceLimit = input<number>(20);

  private saleOfferService = inject(SaleOfferService);

  readonly offers = signal<SaleOfferType[]>([]);
  readonly isLoading = signal<boolean>(true);

  private = effect(() => {
    const currentBrandId = this.brandId();
    const currentLimit = this.sliceLimit();

    this.isLoading.set(true);

    this.saleOfferService.getOffersByBrand(currentBrandId, currentLimit).subscribe({
      next: (fetchedOffers: SaleOfferType[]) => {
        this.offers.set(fetchedOffers);
        this.isLoading.set(false);
      },
    });
  });

  ngAfterViewInit(): void {
    this.swiperRef.nativeElement.initialize();
  }
}