import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PurchaseOfferService } from '../services/purchase-offer.service';
import { PurchaseOfferCardComponent } from '../purchase-offer-card/purchase-offer-card.component';
import { PurchaseOffersListFiltersComponent } from '../purchase-offers-list-filters/purchase-offers-list-filters.component';

@Component({
  selector: 'app-purchase-offers-list',
  imports: [
    MatButtonModule,
    PurchaseOfferCardComponent,
    PurchaseOffersListFiltersComponent,
  ],
  templateUrl: './purchase-offers-list.component.html',
  styleUrls: ['./purchase-offers-list.component.scss'],
})

export class PurchaseOffersListComponent {
  filtersVisible = signal<boolean>(false);

  purchaseOfferService = inject(PurchaseOfferService);

  toggleFilters() {
    this.filtersVisible.update((filtersVisible) => !filtersVisible);
  }
}
