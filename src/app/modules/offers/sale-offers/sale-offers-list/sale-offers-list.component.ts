import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SaleOfferService } from '../services/sale-offer.service';
import { SaleOfferCardComponent } from '../sale-offer-card/sale-offer-card.component';
import { SaleOffersListFiltersComponent } from '../sale-offers-list-filters/sale-offers-list-filters.component';

@Component({
  selector: 'app-sale-offers-list',
  imports: [
    MatButtonModule,
    SaleOfferCardComponent,
    SaleOffersListFiltersComponent,
  ],
  templateUrl: './sale-offers-list.component.html',
  styleUrls: ['./sale-offers-list.component.scss'],
  standalone: true,
})
export class SaleOffersListComponent {
  filtersVisible = signal<boolean>(false);

  saleOfferService = inject(SaleOfferService);

  toggleFilters() {
    this.filtersVisible.update((filtersVisible) => !filtersVisible);
  }
}
