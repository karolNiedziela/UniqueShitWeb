import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ControlValueAccessorDirective } from '../../../directives/control-value-accessor.directive';

@Component({
  selector: 'app-text-area',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent extends ControlValueAccessorDirective<string> {
  label = input.required<string>();
  rows = input<number>(4);
  maxLength = input<number | undefined>();
}
