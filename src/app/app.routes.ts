import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [MsalGuard],
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./modules/about-us/about-us.component').then(
        (m) => m.AboutUsComponent
      ),
  },
  {
    path: 'regulations',
    loadComponent: () =>
      import('./modules/regulations/regulations.component').then(
        (m) => m.RegulationsComponent
      ),
  },
  {
    path: 'sale-offers',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './modules/offers/sale-offers/sale-offers-list/sale-offers-list.component'
          ).then((m) => m.SaleOffersListComponent),
      },
      {
        path: 'create',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './modules/offers/sale-offers/add-sale-offer-form/add-sale-offer-form.component'
          ).then((m) => m.AddSaleOfferFormComponent),
        canActivate: [MsalGuard],
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './modules/offers/sale-offers/sale-offer-details/sale-offer-details.component'
          ).then((m) => m.SaleOfferDetailsComponent),
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'purchase-offers',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './modules/offers/purchase-offers/purchase-offers-list/purchase-offers-list.component'
          ).then((m) => m.PurchaseOffersListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            './modules/offers/purchase-offers/add-purchase-offer-form/add-purchase-offer-form.component'
          ).then((m) => m.AddPurchaseOfferFormComponent),
        canActivate: [MsalGuard],
      },
    ],
  },
];
