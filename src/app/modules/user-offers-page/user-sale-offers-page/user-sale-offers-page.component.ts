import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { MySaleOffersComponent } from '../../my-offers/my-sale-offers/my-sale-offers.component';

@Component({
  selector: 'app-user-sale-offers-page',
  imports: [CommonModule, MySaleOffersComponent],
  templateUrl: './user-sale-offers-page.component.html',
  styleUrl: './user-sale-offers-page.component.scss'
})
export class UserSaleOffersPageComponent implements OnInit {
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