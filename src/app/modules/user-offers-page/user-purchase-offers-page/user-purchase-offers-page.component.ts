import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppUserService } from '../../../core/services/app-user.service';
import { MyPurchaseOffersComponent } from '../../my-offers/my-purchase-offers/my-purchase-offers.component';

@Component({
  selector: 'app-user-purchase-offers-page',
  imports: [CommonModule, MyPurchaseOffersComponent],
  templateUrl: './user-purchase-offers-page.component.html',
  styleUrl: './user-purchase-offers-page.component.scss'
})
export class UserPurchaseOffersPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private appUserService = inject(AppUserService);

  userId: string | null = null;
  userName: string | null = null;

ngOnInit(): void {
  const userIdFromRoute = this.route.snapshot.paramMap.get('id');
  if (userIdFromRoute) {
    this.userId = userIdFromRoute;

    this.appUserService.getUser(this.userId).subscribe(user => {
      this.userName = user.displayName;
    });

  } else {
    console.error("User ID not found in route parameters!");
    this.userId = null;
    this.userName = 'Unknown User';
  }
}}
