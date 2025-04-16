import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { signal } from '@angular/core';
/*import { ApiService } from 'src/app/services/api.service';*/
import { Router } from '@angular/router';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-saleofferform',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    RouterLink, 
    FormsModule, 
    MatProgressSpinnerModule
  ],
  template: `
  <h2> Add sale offer </h2>
  <form (ngSubmit) ="save()">
  <div class="fields"> 
    <mat-form-field>
      <mat-label>Topic</mat-label>
      <input matInput [(ngModel)]="topic" name="topic" />
    </mat-form-field>

    <mat-form-field>
      <mat-label>Description</mat-label>
      <input matInput [(ngModel)]="description" name="description" />
    </mat-form-field>

    <mat-form-field>
      <mat-label>Price Amout</mat-label>
      <input matInput [(ngModel)]="priceamount" name="priceamout" />
    </mat-form-field>

    <mat-form-field>
      <mat-label>Currency</mat-label>
      <input matInput [(ngModel)]="pricecurrency" name="pricecurrency" />
    </mat-form-field>
 
    <mat-form-field>
      <mat-label>offerTypeId</mat-label>
      <input matInput [(ngModel)]="offertypeid" name="offertypeid"/>
    </mat-form-field>

    <mat-form-field>
      <mat-label>itemConditionId</mat-label>
      <input matInput [(ngModel)]="itemconditionid" name="itemconditionid"/>
    </mat-form-field>

    <mat-form-field>
      <mat-label>modelId</mat-label>
      <input matInput [(ngModel)]="modelid" name="modelid"/>
    </mat-form-field>

    <mat-form-field>
      <mat-label>sizeId</mat-label>
      <input matInput [(ngModel)]="sizeid" name="sizeid"/>
    </mat-form-field>

    <mat-form-field>
      <mat-label>quantity</mat-label>
      <input matInput [(ngModel)]="quantity" name="quantity"/>
    </mat-form-field>
    </div>

    <div class="actions">
      <button type ="submit" mat-flat-button> Save </button>
      <button type="button" mat-raised-button routerLink="/saleofferform"> Cancel</button>
</div>

</form>
@if (saving()) {
  <mat-progress-spiner 
  mode="indeterminate">
  </mat-progress-spiner>

}
  `,
  styles: `
  
  .host {
    padding: 16px;
    display: block;

  }
  .fields{
    max-width: 400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(1, 5fr);
    gap: 16px;
  } 

  .actions{
    display: flex;
    gap: 16px;
    justify-content: start;
  }
  `,
})
export class SaleofferformComponent {
  /*apiService = inject(ApiService);*/
  router = inject(Router);

topic = signal('');
description = signal('');
priceamount = signal('');
pricecurrency = signal('');
offertypeid = signal('');
itemconditionid = signal('');
modelid = signal('');
sizeid = signal('');
quantity = signal('');

saving = signal(false);

async save() {
  this.saving.set(true);

 /*await this.apiService.addSaleOfferForm({*/
 console.log({
  topic: this.topic(), 
  description: this.description(), 
  price: {
    amount: this.priceamount(),
    currency: this.pricecurrency()
  },
  offertypeid: this.offertypeid(), 
  itemconditionid: this.itemconditionid(), 
  modelid: this.modelid(), 
  sizeid: this.sizeid(), 
  quantity: this.quantity(),
});
this.saving.set(false);
this.router.navigate(['/saleofferform']);
}
}
