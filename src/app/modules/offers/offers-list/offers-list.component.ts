import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OfferService } from '../services/offer.service';
import { OfferCardComponent } from '../offer-card/offer-card.component';
import { OffersListFiltersComponent } from '../offers-list-filters/offers-list-filters.component';
@Component({
  selector: 'app-offers-list',
  imports: [MatButtonModule, OfferCardComponent, OffersListFiltersComponent],
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.scss'],
  standalone: true,
})
export class OffersListComponent {
  filtersVisible = signal<boolean>(false);

  offerService = inject(OfferService);

  toggleFilters() {
    this.filtersVisible.update((filtersVisible) => !filtersVisible);
  }
}
