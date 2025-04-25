import { Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
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
import { environment } from '../../../../environments/environment';

type CreateOfferDto = {
  topic: string;
  description: string;
  price: { amount: number; currency: string };
  offerTypeId: number;
  itemConditionId: number;
  modelId: number;
  sizeId: number;
  quantity: number;
};

type OfferType = CreateOfferDto & { id: number };

@Component({
  selector: 'app-saleofferform',
  standalone: true,
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
  templateUrl: './saleofferform.component.html',
  styleUrls: ['./saleofferform.component.scss'],
})
export class SaleofferformComponent implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);

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
      topic: new FormControl<string>(''),
      description: new FormControl<string>(''),
      quantity: new FormControl<number>(0),
      priceamount: new FormControl<number>(0),
      pricecurrency: new FormControl<string>('PLN'),
      offertypeid: new FormControl<number>(2),
      itemCondition: new FormControl<OptionSet | null>(null),
      model: new FormControl<ModelType | null>(null),
      size: new FormControl<OptionSet | null>(null),
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

    console.log('DTO to send:', dto);
    const url = `${environment.apiUrl}/offers`;

    const httpOptions = {
      observe: 'response' as const,
      responseType: 'text' as const,
    };

    const request$ = this.selectedFile
      ? this.buildFormDataRequest(url, dto, httpOptions)
      : this.http.post(url, dto, httpOptions);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponse<string>) => {
          let body: OfferType | null = null;
          try {
            body = JSON.parse(res.body as string) as OfferType;
          } catch {
            console.warn('Non-JSON response:', res.body);
          }
          console.log('Response status:', res.status, body);
          this.handleSuccess();
        },
        error: (err: any) => {
          console.error('Save error:', err.status, err.error);
          this.handleError(err);
        },
      });
  }

  private buildFormDataRequest(
    url: string,
    dto: CreateOfferDto,
    options: { observe: 'response'; responseType: 'text' }
  ) {
    const formData = new FormData();
    formData.append('offer', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    formData.append('file', this.selectedFile as File);
    return this.http.post(url, formData, options);
  }

  private handleSuccess(): void {
    this.saving.set(false);
    this.router.navigate(['/saleofferform']);
  }

  private handleError(error: any): void {
    this.saving.set(false);
  }

  clearForm(): void {
    this.form.reset({ pricecurrency: 'PLN', offertypeid: 2 });
    this.selectedFile = null;
  }
}