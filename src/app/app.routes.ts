import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ProfileComponent } from './profile/profile.component';
import { OffersListComponent } from './modules/offers/offers-list/offers-list.component';
import { HomeComponent } from './modules/home/home.component';
import { RegulationsComponent } from './modules/regulations/regulations.component';
import { ContactComponent } from './modules/contact/contact.component';
import { SaleOfferFormComponent } from './modules/offerform/sale-offer-form/sale-offer-form.component';

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
    path: 'offers-list',
    component: OffersListComponent,
  },
  { path: 'contact', component: ContactComponent },
  { path: 'regulations', component: RegulationsComponent },
  { path: 'saleofferform', component: SaleOfferFormComponent, canActivate: [MsalGuard] },
];
