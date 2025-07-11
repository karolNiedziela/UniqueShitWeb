import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, EMPTY } from 'rxjs';
import { PurchaseOfferType } from '../../offers/purchase-offers/models/purchase-offer.model';
import { PurchaseOfferService } from '../../offers/purchase-offers/services/purchase-offer.service';
import { PurchaseOfferCardComponent } from '../../offers/purchase-offers/purchase-offer-card/purchase-offer-card.component';

@Component({
  selector: 'app-my-purchase-offers',
  imports: [CommonModule, PurchaseOfferCardComponent],
  templateUrl: './my-purchase-offers.component.html',
  styleUrl: './my-purchase-offers.component.scss'
})
export class MyPurchaseOffersComponent implements OnInit {
  userId = input.required<string>(); 
  
  private purchaseOfferService = inject(PurchaseOfferService);
  
  userOffers$: Observable<PurchaseOfferType[]> = EMPTY;

  ngOnInit(): void {
    this.userOffers$ = this.purchaseOfferService.getOffersByUserId(this.userId());
  }
}