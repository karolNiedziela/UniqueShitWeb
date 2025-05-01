import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ItemConditionService } from '../../item-conditions/services/item-condition.service';
import { SizeService } from '../../sizes/services/size.service';
import { ModelsService } from '../../models/services/models.service';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { ModelsAutocompleteComponent } from '../../models/models-autocomplete/models-autocomplete.component';
import { OptionSet } from '../../../shared/models/option-set.model';
import { ModelType } from '../../models/models/model.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreateOfferDto } from '../../offers/models/offer.dto';
import { OfferService } from '../../offers/services/offer.service';

@Component({
  selector: 'app-saleoffer-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    SelectComponent,
    ModelsAutocompleteComponent,
  ],
  templateUrl: './sale-offer-form.component.html',
  styleUrls: ['./sale-offer-form.component.scss'],
})
export class SaleOfferFormComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private offerService = inject(OfferService);

  itemConditionService = inject(ItemConditionService);
  sizeService = inject(SizeService);
  modelService = inject(ModelsService);

  modelIdSignal = signal<number | null>(null);
  sizeIdSignal = signal<number | null>(null);
  saving = signal<boolean>(false);

  form!: FormGroup;
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.form = new FormGroup({
      topic: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      description: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      quantity: new FormControl<number>(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      priceamount: new FormControl<number>(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      pricecurrency: new FormControl<string>('PLN', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      offertypeid: new FormControl<number>(2, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      itemCondition: new FormControl<OptionSet | null>(null, {
        validators: [Validators.required],
      }),
      model: new FormControl<ModelType | null>(null, {
        validators: [Validators.required],
      }),
      size: new FormControl<OptionSet | null>(null, {
        validators: [Validators.required],
      }),
    });

    this.form.controls['model'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((m: ModelType | null) => {
        this.modelIdSignal.set(m?.id ?? 0);
        this.sizeService.productCategoryId.set(m?.productCategoryId ?? null);
        this.form.controls['size'].setValue(null);
      });

    this.form.controls['size'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((opt: OptionSet | null) => {
        this.sizeIdSignal.set(opt?.id ?? 0);
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const dto: CreateOfferDto = {
      topic: this.form.value.topic!,
      description: this.form.value.description!,
      price: {
        amount: this.form.value.priceamount!,
        currency: this.form.value.pricecurrency!,
      },
      offerTypeId: this.form.value.offertypeid!,
      itemConditionId: this.form.value.itemCondition?.id ?? 0,
      modelId: this.modelIdSignal() ?? 0,
      sizeId: this.sizeIdSignal() ?? 0,
      quantity: this.form.value.quantity!,
    };

    const call$ = this.selectedFile
      ? this.offerService.createOfferWithFile(dto, this.selectedFile)
      : this.offerService.createOffer(dto);

    call$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/saleofferform']);
        },
        error: err => {
          console.error('Save error:', err);
          this.saving.set(false);
        },
      });
  }

  clearForm(): void {
    this.form.reset({ pricecurrency: 'PLN', offertypeid: 2 });
    this.selectedFile = null;
  }
}