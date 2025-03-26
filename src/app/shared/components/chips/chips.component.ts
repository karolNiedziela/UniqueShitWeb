import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, input, output, OutputEmitterRef } from '@angular/core';

@Component({
  selector: 'app-chips',
  imports: [NgIf, CommonModule],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
  standalone: true,
})
export class ChipsComponent {
  chips = input.required<any[]>();
  clearFilter: OutputEmitterRef<any> = output<any>();

  onClearFilter(chip: any) {
    this.clearFilter.emit(chip);
  }
}
