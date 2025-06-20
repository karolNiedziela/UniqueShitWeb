import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SaleOfferService } from '../../../modules/offers/sale-offers/services/sale-offer.service';

@Component({
  selector: 'app-sale-offers-shoes',
  templateUrl: './sale-offers-shoes.component.html',
  styleUrls: ['./sale-offers-shoes.component.scss']
})
export class SaleOffersShoesComponent {
  constructor(
    private router: Router,
    private saleOfferService: SaleOfferService
  ) {}

  applyAndGo() {
    this.saleOfferService.offersQueryParameters.update(q => ({
      ...q,
      productCategoryId: 1
    }));
    this.router.navigate(['/sale-offers']);
  }
}