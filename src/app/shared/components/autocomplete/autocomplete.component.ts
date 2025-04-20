import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  AfterContentInit,
  Component,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  Self,
  Signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { OptionSet } from '../../models/option-set.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-autocomplete',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
})
export class AutocompleteComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  label = input.required<string>();
  options = input.required<OptionSet[]>();
  filteredOptions$!: Observable<OptionSet[]>;

  filteredOptionsSignal!: Signal<OptionSet[]>;

  onChanged!: (value: OptionSet | null) => void;
  onTouched!: () => void;

  formControl!: FormControl;

  private injector = inject(Injector);

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

  ngOnInit() {
    this.formControl = this.controlDir.control as FormControl<any>;

    let validators: ValidatorFn[] = this.formControl?.validator
      ? [this.formControl.validator]
      : [];

    this.formControl.setValidators(validators);
    this.formControl.updateValueAndValidity();

    this.filteredOptions$ = this.formControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filter(name as string)
          : this.options()?.slice() || [];
      })
    );

    this.filteredOptionsSignal = toSignal(this.filteredOptions$, {
      injector: this.injector,
      initialValue: [],
    });
  }

  ngOnDestroy(): void {
    this.formControl?.clearValidators();
    this.formControl?.markAsPristine();
    this.formControl.reset();
  }

  displayFn(optionSet: OptionSet): string {
    return optionSet && optionSet.value ? optionSet.value : '';
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

  setDisabledState(isDisabled: boolean): void {}

  private _filter(name: string): OptionSet[] {
    const filterValue = name.toLowerCase();

    return (
      this.options()?.filter((option) =>
        option.value.toLowerCase().includes(filterValue)
      ) || []
    );
  }
}
