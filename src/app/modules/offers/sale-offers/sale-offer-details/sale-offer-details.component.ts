import { Component, inject, OnInit, signal } from '@angular/core';
import { SaleOfferService } from '../services/sale-offer.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SaleOfferDetails } from '../models/sale-offer-details.model';
import { MatButtonModule } from '@angular/material/button';
import { OpenedChatsComponent } from '../../../chat/opened-chats/opened-chats.component';
import { ChatService } from '../../../chat/services/chat.service';

@Component({
  selector: 'app-sale-offer-details',
  imports: [CommonModule, MatButtonModule, OpenedChatsComponent],
  templateUrl: './sale-offer-details.component.html',
  styleUrl: './sale-offer-details.component.scss',
})
export class SaleOfferDetailsComponent implements OnInit {
  salesOfferService = inject(SaleOfferService);

  saleOffer$!: Observable<SaleOfferDetails>;

  private readonly route = inject(ActivatedRoute);
  protected readonly chatService = inject(ChatService);

  ngOnInit() {
    const saleOfferId = this.route.snapshot.paramMap.get('id');
    this.saleOffer$ = this.salesOfferService.getOffer(Number(saleOfferId));
  }
}
