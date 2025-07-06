import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppUserService } from '../../../core/services/app-user.service';
import { MySaleOffersComponent } from '../../my-offers/my-sale-offers/my-sale-offers.component';

@Component({
  selector: 'app-user-sale-offers-page',
  imports: [CommonModule, MySaleOffersComponent],
  templateUrl: './user-sale-offers-page.component.html',
  styleUrl: './user-sale-offers-page.component.scss'
})
export class UserSaleOffersPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private appUserService = inject(AppUserService);

  userId: string | null = null;
  userName: string | null = null;

  ngOnInit(): void {
    const displayName = this.route.snapshot.paramMap.get('name');
    if (displayName) {
      this.userName = displayName;
      this.userId = this.appUserService.getUserIdByName(displayName) ?? null;
    }
  }
}
