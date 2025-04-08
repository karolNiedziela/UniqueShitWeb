import { CommonModule, NgIf } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { SelectComponent } from '../select/select.component';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

export interface Chip {
  name: string;
  viewValue: string;
  formControlName: string;
}

@Component({
  selector: 'app-chips',
  imports: [NgIf, CommonModule],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
  standalone: true,
})
export class ChipsComponent {
  chips = input.required<Chip[]>();
  removed = output<Chip>();

  removeChip(chip: Chip) {
    this.removed.emit(chip);
  }
}
