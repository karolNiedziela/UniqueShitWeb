import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-regulations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './regulations.component.html',
  styleUrls: ['./regulations.component.scss']
})
export class RegulationsComponent {
  // Dodaj logikę, jeśli potrzebujesz np. obsługę przycisku powrotu
  goBack() {
    // Możesz użyć routera, jeśli chcesz nawigować np. do /home
    // Przykład (trzeba zaimportować Router):
    // this.router.navigate(['/home']);
  }
}
