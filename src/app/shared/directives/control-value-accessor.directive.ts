import { Directive, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ValidatorFn,
} from '@angular/forms';
import { distinctUntilChanged, startWith, Subject, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[appControlValueAccessor]',
})
export class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit, OnDestroy
{
  formControl: FormControl | undefined;

  protected _isDisabled!: boolean;

  private _destroy$ = new Subject<void>();
  private _onTouched!: () => T;

  constructor(@Optional() @Self() private ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }
  ngOnInit(): void {
    this.setFormControl();
    this.updateValidators();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  setFormControl() {
    this.formControl = this.ngControl.control as FormControl<T>;

    this.setDisabledState(this._isDisabled);
  }

  updateValidators(): void {
    if (this.formControl) {
      let validators: ValidatorFn[] = this.formControl?.validator
        ? [this.formControl.validator]
        : [];
      this.formControl.setValidators(validators);

      this.formControl.updateValueAndValidity();
    }
  }

  writeValue(value: T): void {
    if (this.formControl?.value != value) {
      this.formControl?.setValue(value);
    }
  }

  registerOnChange(fn: (val: T | null) => T): void {
    this.formControl?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        startWith(this.formControl.value),
        distinctUntilChanged(),
        tap((val) => fn(val))
      )
      .subscribe();
  }

  registerOnTouched(fn: () => T): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled == this.formControl?.disabled) {
      return;
    }
    this._isDisabled = isDisabled;

    if (this.formControl) {
      isDisabled ? this.formControl.disable() : this.formControl.enable();
    }
  }

  protected isValid(): boolean {
    if (!this.formControl) {
      return true;
    }

    if (!this.formControl.touched) {
      return true;
    }

    return this.formControl.valid;
  }
}
