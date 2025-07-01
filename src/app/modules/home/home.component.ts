import { Component } from '@angular/core';
import { FeatureSaleOffersComponent } from '../../shared/feature-sale-offers/feature-sale-offers.component';
@Component({
  selector: 'app-home',
  imports: [
    FeatureSaleOffersComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
