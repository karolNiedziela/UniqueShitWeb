import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PurchaseOfferService } from '../services/purchase-offer.service';
import { ModelsAutocompleteComponent } from '../../../models/models-autocomplete/models-autocomplete.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { TextAreaComponent } from '../../../../shared/components/inputs/text-area/text-area.component';
import { ModelType } from '../../../models/models/model.model';
import { CreatePurchaseOfferDto } from '../models/create-purchase-offer.dto';

@Component({
  selector: 'app-purchaseoffer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ModelsAutocompleteComponent,
    TextInputComponent,
    TextAreaComponent,
  ],
  templateUrl: './add-purchase-offer-form.component.html',
  styleUrls: ['./add-purchase-offer-form.component.scss'],
})
export class AddPurchaseOfferFormComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private purchaseOfferService = inject(PurchaseOfferService);

  modelIdSignal = signal<number | null>(null);
  saving = signal<boolean>(false);

  form!: FormGroup;

  ngOnInit(): void {
    const maxParagraphs: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value ?? '';
      const paragraphs = value.split(/\r?\n/);
      return paragraphs.length > 4
        ? { maxParagraphs: { actual: paragraphs.length, maxAllowed: 4 } }
        : null;
    };

    this.form = new FormGroup({
      topic: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(30)],
      }),
      description: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(150),
          maxParagraphs,
        ],
      }),
      model: new FormControl<ModelType | null>(null, {
        validators: [Validators.required],
      }),
    });

    // Rezygnujemy z ręcznego dzielenia tekstu – teraz przeglądarka zadba o zawijanie
    // this.form.controls['description'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((rawText: string) => { ... });

    this.form.controls['model'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((m: ModelType | null) => {
        this.modelIdSignal.set(m?.id ?? 0);
      });
  }

  save(): void {
    if (this.form.invalid) return;

    this.saving.set(true);

    const dto: CreatePurchaseOfferDto = {
      topic: this.form.value.topic!,
      description: this.form.value.description!,
      modelId: this.modelIdSignal() ?? 0,
    };

    this.purchaseOfferService.createPurchaseOffer(dto).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/purchase-offers/create']);
      },
      error: (err) => {
        console.error('Save error:', err);
        this.saving.set(false);
      },
    });
  }

  clearForm(): void {
    this.form.reset();
  }
}
