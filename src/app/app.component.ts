import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './modules/header/header.component';
import { FooterComponent } from './modules/footer/footer.component';
import { AuthService } from './core/auth/auth.service';
import { ChatSignalRService } from './modules/chat/services/chat-signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'unique-shit-web';

  authService = inject(AuthService);
  chatSignalRService = inject(ChatSignalRService);

  async ngOnInit(): Promise<void> {
    this.authService.initializeAuth();

    await this.chatSignalRService.startConnection();
  }
}
