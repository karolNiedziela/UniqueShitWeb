import { Component, input, signal, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { OptionSetType } from '../models/option-set.model';

@Component({
  selector: 'app-select',
  imports: [MatSelectModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
})
export class SelectComponent {
  label = input.required<string>();
  options = input.required<OptionSetType[]>();
  hidden = input<boolean>(false);

  selectedOptionChanged = output<OptionSetType | null>();

  selectedOption = signal<OptionSetType | null>(null);

  onSelectedOptionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value ? Number(selectElement.value) : null;
    const selectedOption =
      this.options().find((opt: OptionSetType) => opt.id === selectedId) ||
      null;
    this.selectedOption.set(selectedOption);
    this.selectedOptionChanged.emit(selectedOption);
  }

  clear() {
    this.selectedOption.set(null);
    this.selectedOptionChanged.emit(null);
  }
}
