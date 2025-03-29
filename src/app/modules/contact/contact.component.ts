import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  email: string = 'jp2gmd@buziaczek.pl';
  copiedNotificationVisible: boolean = false;

  constructor(private clipboard: Clipboard) {}

  copyEmail(): void {
    this.clipboard.copy(this.email);
    this.showNotification();
  }

  showNotification(): void {
    this.copiedNotificationVisible = true;
    setTimeout(() => {
      this.copiedNotificationVisible = false;
    }, 2000);
  }
}
