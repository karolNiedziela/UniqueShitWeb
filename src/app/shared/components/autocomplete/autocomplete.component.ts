import {
  Component,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { OptionSetType } from '../models/option-set.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  imports: [ReactiveFormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
})
export class AutocompleteComponent implements OnChanges {
  options = input.required<OptionSetType[]>();
  label = input.required<string>();
  placeholder = input<string>('Search term...');
  minimumCharacters = input<number>(2);

  selectedOptionChanged = output<OptionSetType | null>();
  searchTerm = output<string>();

  searchInput = new FormControl('');
  filteredOptions = signal<OptionSetType[]>([]);

  selectedOption = signal<OptionSetType | null>(null);

  isOpen = signal<boolean>(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions.set(this.options());
    }
  }

  onInputChange(event: any) {
    const value = event.target.value;
    this.filteredOptions.set(
      this.options().filter((option) =>
        option.value.toLowerCase().startsWith(value.toLowerCase())
      )
    );

    this.isOpen.set(this.filteredOptions().length > 0);
  }

  onSelectedOptionChange(option: OptionSetType): void {
    this.isOpen.set(false);
    this.selectedOption.set(option);
    this.selectedOptionChanged.emit(option);
  }

  toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
  }

  clear(): void {
    this.selectedOption.set(null);
    this.selectedOptionChanged.emit(null);
    this.searchTerm.emit('');
  }
}
