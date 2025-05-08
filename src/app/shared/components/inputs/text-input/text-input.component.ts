import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from '../../../directives/control-value-accessor.directive';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-text-input',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent extends ControlValueAccessorDirective<string> {
  label = input.required<string>();
  maxLength = input<number | undefined>();
}
