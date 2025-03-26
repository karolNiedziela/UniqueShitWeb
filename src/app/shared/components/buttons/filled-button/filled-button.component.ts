import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

@Component({
  selector: 'app-filled-button',
  imports: [],
  templateUrl: './filled-button.component.html',
  styleUrl: './filled-button.component.scss',
  standalone: true,
})
export class FilledButtonComponent {
  text: InputSignal<string> = input.required<string>();
  type: InputSignal<string> = input<string>('button');
  disabled: InputSignal<boolean> = input<boolean>(false);
  hidden: InputSignal<boolean> = input<boolean>(false);
  buttonClick: OutputEmitterRef<void> = output<void>();

  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.buttonClick.emit();
  }
}
