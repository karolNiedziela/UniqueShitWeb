import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  input,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  afterNextRender 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleOfferService } from '../../modules/offers/sale-offers/services/sale-offer.service';
import { SaleOfferCardHomeComponent } from '../../modules/offers/sale-offers/sale-offer-card-home/sale-offer-card-home.component';

@Component({
  selector: 'app-feature-sale-offers',
  imports: [CommonModule, SaleOfferCardHomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './feature-sale-offers.component.html',
  styleUrls: ['./feature-sale-offers.component.scss'],
})
export class FeatureSaleOffersComponent {
  @ViewChild('swiperRef', { static: true })
  swiperRef!: ElementRef<HTMLElement & { initialize(): void }>;

  readonly brandIdFilter = input.required<number>();
  readonly brandName = input.required<string>();
  readonly sliceLimit = input<number>(20);
  private saleOfferService = inject(SaleOfferService);

  offers = computed(() => {
    const items = this.saleOfferService.offers.value()?.items as any[] || [];
    return items
      .filter(o => o.brand.id === this.brandIdFilter())
      .slice(0, this.sliceLimit());
  });

  constructor() {
    afterNextRender(() => {
      if (this.swiperRef?.nativeElement) {
        const el = this.swiperRef.nativeElement;
        el.initialize();
        const swiper = (el as any).swiper;
      }
    });
  }
}