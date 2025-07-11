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
