import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  Self,
} from '@angular/core';
import { ModelsService } from '../services/models.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { ModelType } from '../models/model.model';
import {
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-models-autocomplete',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './models-autocomplete.component.html',
  styleUrl: './models-autocomplete.component.scss',
})
export class ModelsAutocompleteComponent implements OnInit, OnDestroy {
  modelService = inject(ModelsService);
  destroyRef = inject(DestroyRef);

  onChanged!: (value: ModelType | null) => void;
  onTouched!: () => void;

  formControl!: FormControl;

  get isRequired(): boolean {
    if (this.formControl?.validator) {
      const validator = this.formControl?.validator(this.formControl)!;
      if (validator && validator['required']) {
        return true;
      }
    }

    return false;
  }

  constructor(@Self() private controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    this.formControl = this.controlDir.control as FormControl<any>;

    let validators: ValidatorFn[] = this.formControl?.validator
      ? [this.formControl.validator]
      : [];

    this.formControl.setValidators(validators);
    this.formControl.updateValueAndValidity();

    this.formControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
        filter((value) => typeof value === 'string')
      )
      .subscribe((searchTerm: string) => {
        this.modelService.modelQueryParameters.update((params) => ({
          ...params,
          searchTerm,
        }));
      });
  }

  ngOnDestroy(): void {
    this.formControl?.clearValidators();
    this.formControl?.markAsPristine();
    this.formControl.reset();
  }

  displayFn(model: ModelType): string {
    return model ? model.name : '';
  }

  writeValue(value: ModelType | null): void {
    if (this.formControl?.value != value) {
      this.controlDir.control?.setValue(value);
    }
  }

  registerOnChange(onChanged: (value: any) => void): void {
    this.onChanged = onChanged;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {}
}
