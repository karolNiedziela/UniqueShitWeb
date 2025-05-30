import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './modules/home/home.component';
import { RegulationsComponent } from './modules/regulations/regulations.component';
import { ContactComponent } from './modules/contact/contact.component';
import { AddSaleOfferFormComponent } from './modules/offers/sale-offers/add-sale-offer-form/add-sale-offer-form.component';
import { SaleOffersListComponent } from './modules/offers/sale-offers/sale-offers-list/sale-offers-list.component';
import { AddPurchaseOfferFormComponent } from './modules/offers/purchase-offers/add-purchase-offer-form/add-purchase-offer-form.component';
import { SaleOfferDetailsComponent } from './modules/offers/sale-offers/sale-offer-details/sale-offer-details.component';
import { PurchaseOffersListComponent } from './modules/offers/purchase-offers/purchase-offers-list/purchase-offers-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard],
  },
  { path: 'contact', component: ContactComponent },
  { path: 'regulations', component: RegulationsComponent },
  {
    path: 'sale-offers',
    children: [
      {
        path: '',
        component: SaleOffersListComponent,
      },
      {
        path: 'create',
        pathMatch: 'full',
        component: AddSaleOfferFormComponent,
        canActivate: [MsalGuard],
      },
      {
        path: ':id',
        component: SaleOfferDetailsComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'purchase-offers',
    children: [
      {
        path: 'create',
        component: AddPurchaseOfferFormComponent,
        canActivate: [MsalGuard],
      },
    ],
  },
  {
  path: 'purchase-offers',
  children: [
    {
      path: '',                              // ← tu
      component: PurchaseOffersListComponent
    },
    {
      path: 'create',
      component: AddPurchaseOfferFormComponent,
      canActivate: [MsalGuard],
    },
  ]}
];
