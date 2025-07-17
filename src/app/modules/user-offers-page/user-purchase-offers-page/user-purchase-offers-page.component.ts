// C:\Users\KRUL\test22.06\UniqueShitWeb\src\app\modules\user-offers-page\user-purchase-offers-page\user-purchase-offers-page.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { MyPurchaseOffersComponent } from '../../my-offers/my-purchase-offers/my-purchase-offers.component';

@Component({
  selector: 'app-user-purchase-offers-page',
  // standalone: true, // Jeśli używasz standalone components
  imports: [CommonModule, MyPurchaseOffersComponent],
  templateUrl: './user-purchase-offers-page.component.html',
  styleUrl: './user-purchase-offers-page.component.scss'
})
export class UserPurchaseOffersPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  // Udostępniamy serwis w szablonie jako 'protected'
  protected readonly appUserService = inject(LoggedUserService);

  // Lokalne zmienne `userId` i `userName` nie są już potrzebne.
  // Stan jest w całości zarządzany przez serwis.

  ngOnInit(): void {
    const userIdFromRoute = this.route.snapshot.paramMap.get('id');

    if (userIdFromRoute) {
      // Zlecamy serwisowi załadowanie danych. Komponent nie przechowuje już stanu.
      this.appUserService.loadUser(userIdFromRoute);
    } else {
      console.error("User ID not found in route parameters!");
      // Widok sam zareaguje na brak danych w serwisie.
    }
  }
}