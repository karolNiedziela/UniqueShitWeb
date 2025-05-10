import {
  Component,
  input,
  OnDestroy,
  OnInit,
  Self,
  signal,
} from '@angular/core';
import { OptionSet } from '../../models/option-set.model';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-multiselect',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
})
export class MultiselectComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  label = input.required<string>();
  options = input.required<OptionSet[]>();
  isDisabled = signal<boolean>(false);

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

  writeValue(value: OptionSet[]): void {
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
