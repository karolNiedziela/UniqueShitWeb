import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, EMPTY } from 'rxjs';
import { SaleOfferType } from '../../offers/sale-offers/models/sale-offer.model';
import { SaleOfferService } from '../../offers/sale-offers/services/sale-offer.service';
import { SaleOfferCardComponent } from '../../offers/sale-offers/sale-offer-card/sale-offer-card.component';

@Component({
  selector: 'app-my-sale-offers',
  imports: [CommonModule, SaleOfferCardComponent],
  templateUrl: './my-sale-offers.component.html',
  styleUrls: ['./my-sale-offers.component.scss']
})
export class MySaleOffersComponent implements OnInit {
  userId = input.required<string>(); 
  private saleOfferService = inject(SaleOfferService);
  
  userOffers$: Observable<SaleOfferType[]> = EMPTY;

  ngOnInit(): void {
this.userOffers$ = this.saleOfferService.getOffersByUserId(this.userId());
      
  }
}