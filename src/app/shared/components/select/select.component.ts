import { NgIf } from '@angular/common';
import { Component, input, signal, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

export type SelectOptionType = {
  id: number;
  value: string;
};

@Component({
  selector: 'app-select',
  imports: [MatSelectModule, NgIf],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
})
export class SelectComponent {
  label = input.required<string>();
  options = input.required<SelectOptionType[]>();
  hidden = input<boolean>(false);

  selectionChange = output<number | null>();

  selectedId = signal<number | null>(null);
  selectedValue = signal<string | null>(null);

  onSelectionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedId.set(
      selectElement.value ? Number(selectElement.value) : null
    );
    const selectedOption = this.options().find(
      (opt: SelectOptionType) => opt.id === this.selectedId()
    );
    this.selectedValue.set(selectedOption ? selectedOption.value : null);
    this.selectionChange.emit(this.selectedId());
  }

  clearSelection() {
    this.selectedId.set(null);
    this.selectedValue.set(null);
    this.selectionChange.emit(this.selectedId());
  }
}
