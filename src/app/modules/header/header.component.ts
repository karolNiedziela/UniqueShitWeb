import { Component, inject, signal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ChatSidebarComponent } from '../chat/chat-sidebar/chat-sidebar.component';
import { ChatService } from '../chat/services/chat.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModelType } from '../models/models/model.model';
import { GlobalSearchBarComponent } from '../../shared/components/global-search-bar/global-search-bar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    NgIf,
    ChatSidebarComponent,
    GlobalSearchBarComponent,
    GlobalSearchBarComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isIframe = false;
  loginDisplay = false;
  showChatSidebar = signal(false);
  private readonly _destroying$ = new Subject<void>();

  protected readonly themeService = inject(ThemeService);
  protected readonly authService = inject(AuthService);
  protected readonly chatService = inject(ChatService);

  async ngOnInit(): Promise<void> {
    this.isIframe = window !== window.parent && !window.opener;

    this.authService.loginDisplay$
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (isLoggedIn) => {
        this.loginDisplay = isLoggedIn;
      });
  }

  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
    this.authService.destroy();
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleChatSidebar(): void {
    this.chatService.sidebarOpened.set(!this.chatService.sidebarOpened());
    if (!this.chatService.sidebarOpened()) {
      this.chatService.closeAllChats();
    }
  }
}