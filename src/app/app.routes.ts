import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ProfileComponent } from './profile/profile.component';
import { WebapiComponent } from './webapi/webapi.component';
import { OffersListComponent } from './modules/offers/offers-list/offers-list.component';
import { HomeComponent } from './modules/home/home.component';

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
  {
    path: 'webapi',
    component: WebapiComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'offers-list',
    component: OffersListComponent,
  },
];
