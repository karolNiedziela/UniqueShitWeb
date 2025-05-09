import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SaleOfferService } from '../services/sale-offer.service';
import { ItemConditionService } from '../../../item-conditions/services/item-condition.service';
import { SizeService } from '../../../sizes/services/size.service';
import { ModelsService } from '../../../models/services/models.service';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { ModelsAutocompleteComponent } from '../../../models/models-autocomplete/models-autocomplete.component';
import { OptionSet } from '../../../../shared/models/option-set.model';
import { ModelType } from '../../../models/models/model.model';
import { DeliveryTypeService } from '../../../delivery-types/services/delivery-types.service';
import { PaymentTypeService } from '../../../payment-types/services/payment-types.service';
import { CreateSaleOfferDto } from '../models/create-sale-offer.dto';
import { ColourService } from '../../../colours/services/colour.service';

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
  templateUrl: './add-sale-offer-form.component.html',
  styleUrls: ['./add-sale-offer-form.component.scss'],
})
export class AddSaleOfferFormComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private saleOfferService = inject(SaleOfferService);

  itemConditionService = inject(ItemConditionService);
  sizeService = inject(SizeService);
  modelService = inject(ModelsService);
  deliveryTypeService = inject(DeliveryTypeService);
  paymentTypeService = inject(PaymentTypeService);
  colourService = inject(ColourService);

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
      priceAmount: new FormControl<number>(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      priceCurrency: new FormControl<string>('PLN', {
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
            deliveryType: new FormControl<OptionSet | null>(null, {
        validators: [Validators.required],
      }),
            paymentType: new FormControl<OptionSet | null>(null, {
        validators: [Validators.required],
      }),
  colour: new FormControl<number[]>([], {
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

    this.form.get('size')!.disable();

    this.form.get('model')!.valueChanges.subscribe((modelValue) => {
      const sizeCtrl = this.form.get('size')!;
      if (modelValue) {
        sizeCtrl.enable();
      } else {
        sizeCtrl.disable();
        sizeCtrl.reset();
      }
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

    const dto: CreateSaleOfferDto = {
      topic: this.form.value.topic!,
      description: this.form.value.description!,
      price: {
        amount: this.form.value.priceAmount!,
        currency: this.form.value.priceCurrency!,
      },
      itemConditionId: this.form.value.itemCondition?.id ?? 0,
      modelId: this.modelIdSignal() ?? 0,
      sizeId: this.sizeIdSignal() ?? 0,
      quantity: this.form.value.quantity!,
      deliveryTypeId: this.form.value.deliveryType?.id ?? 0,
      paymentTypeId: this.form.value.paymentType?.id ?? 0,
      colourIds: this.form.value.colour?.id ?? 0,
    };

    const call$ = this.selectedFile
      ? this.saleOfferService.createOfferWithFile(dto, this.selectedFile)
      : this.saleOfferService.createOffer(dto);

    call$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/saleofferform']);
      },
      error: (err) => {
        console.error('Save error:', err);
        this.saving.set(false);
      },
    });
  }

  clearForm(): void {
    this.form.reset({ priceCurrency: 'PLN' });
    this.selectedFile = null;
  }
}
