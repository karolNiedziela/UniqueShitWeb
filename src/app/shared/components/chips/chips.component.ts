import { CommonModule, NgIf } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { SelectComponent } from '../select/select.component';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

export type ChipType = {
  name: string;
};

@Component({
  selector: 'app-chips',
  imports: [NgIf, CommonModule],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
  standalone: true,
})
export class ChipsComponent {
  chips = input.required<SelectComponent[] | AutocompleteComponent[]>();
  removed = output<SelectComponent | AutocompleteComponent>();

  removeChip(chip: SelectComponent | AutocompleteComponent) {
    this.removed.emit(chip);
  }
}
