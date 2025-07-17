import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, AfterViewInit, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ControlValueAccessorDirective } from '../../../directives/control-value-accessor.directive';

@Component({
  selector: 'app-text-area',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent
  extends ControlValueAccessorDirective<string>
  implements AfterViewInit
{
  label         = input.required<string>();
  rows          = input<number>(4);
  maxLength     = input<number | undefined>();
  maxParagraphs = input<number | undefined>();

  ngAfterViewInit(): void {
    const max = this.maxParagraphs();
    if (typeof max === 'number' && this.formControl) {
      this.formControl.addValidators(
        this.maxParagraphsValidator(max)
      );
      this.formControl.updateValueAndValidity();
    }

  }
private maxParagraphsValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    const paragraphs = value
      .split(/\r?\n/)
      .filter((p: string) => p.trim() !== '');

    return paragraphs.length > max
      ? { maxParagraphs: { actual: paragraphs.length, maxAllowed: max } }
      : null;
  };
}}