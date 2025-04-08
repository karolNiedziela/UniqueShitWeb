import {
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
  Self,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { OptionSet } from '../../models/option-set.model';

@Component({
  selector: 'app-select',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
})
export class SelectComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  label = input.required<string>();
  options = input.required<OptionSet[]>();
  isDisabled = signal<boolean>(false);

  formControlNameCleared = output<string>();

  onChanged!: (value: OptionSet | null) => void;
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
  }

  ngOnDestroy(): void {
    this.formControl?.clearValidators();
    this.formControl?.markAsPristine();
    this.formControl.reset();
  }

  writeValue(value: OptionSet | null): void {
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

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  clear(event?: MouseEvent): void {
    event?.stopPropagation();
    this.formControl.reset();
  }
}
