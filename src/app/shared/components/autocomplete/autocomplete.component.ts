import { Component, effect, input, output, signal } from '@angular/core';
import { OptionSetType } from '../models/option-set.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-autocomplete',
  imports: [ReactiveFormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
})
export class AutocompleteComponent {
  options = input.required<OptionSetType[]>();
  label = input.required<string>();
  placeholder = input<string>('Search term...');
  minimumCharacters = input<number>(2);

  selectedOptionChanged = output<OptionSetType | null>();
  searchTerm = output<string>();

  searchInput = new FormControl('');

  selectedOption = signal<OptionSetType | null>(null);

  isOpen = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.searchInput.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((res) => {
          this.searchTerm.emit(res ? res : '');
        });
    });
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
