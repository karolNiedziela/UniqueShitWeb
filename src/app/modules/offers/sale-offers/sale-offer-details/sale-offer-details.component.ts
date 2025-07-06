import { Component, inject, OnInit } from '@angular/core';
import { SaleOfferService } from '../services/sale-offer.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SaleOfferDetails } from '../models/sale-offer-details.model';
import { MatButtonModule } from '@angular/material/button';
import { OpenedChatsComponent } from '../../../chat/opened-chats/opened-chats.component';
import { ChatService } from '../../../chat/services/chat.service';
import { AppUserService } from '../../../../core/services/app-user.service'; 

@Component({
  selector: 'app-sale-offer-details',
  imports: [CommonModule, MatButtonModule, OpenedChatsComponent, RouterModule],
  templateUrl: './sale-offer-details.component.html',
  styleUrl: './sale-offer-details.component.scss',
})
export class SaleOfferDetailsComponent implements OnInit {
  salesOfferService = inject(SaleOfferService);

  private appUserService = inject(AppUserService); 

  saleOffer$!: Observable<SaleOfferDetails>;

  private readonly route = inject(ActivatedRoute);
  protected readonly chatService = inject(ChatService);

  ngOnInit() {
    const saleOfferId = this.route.snapshot.paramMap.get('id');
    this.saleOffer$ = this.salesOfferService.getOffer(Number(saleOfferId)).pipe(
      tap((offer: SaleOfferDetails) => {
        if (offer && offer.user) {
          this.appUserService.cacheUserMapping(offer.user.displayName, offer.user.id);
        }
      })
    );
  }
}