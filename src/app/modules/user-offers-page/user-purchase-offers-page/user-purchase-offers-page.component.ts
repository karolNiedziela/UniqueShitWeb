import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { MyPurchaseOffersComponent } from '../../my-offers/my-purchase-offers/my-purchase-offers.component';

@Component({
  selector: 'app-user-purchase-offers-page',
  imports: [CommonModule, MyPurchaseOffersComponent],
  templateUrl: './user-purchase-offers-page.component.html',
  styleUrl: './user-purchase-offers-page.component.scss'
})
export class UserPurchaseOffersPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly appUserService = inject(LoggedUserService);

  userId: string | null = null;

  ngOnInit(): void {
    const userIdFromRoute = this.route.snapshot.paramMap.get('id');

    if (userIdFromRoute) {
      this.userId = userIdFromRoute;
      this.appUserService.loadUser(this.userId);
    } else {
      console.error("User ID not found in route parameters!");
    }
  }
}