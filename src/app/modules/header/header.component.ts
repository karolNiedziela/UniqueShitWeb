import { Component, inject, signal, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../core/services/theme.service';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ChatSidebarComponent } from '../chat/chat-sidebar/chat-sidebar.component';
import { ChatService } from '../chat/services/chat.service';
import { GlobalSearchBarComponent } from '../../shared/components/global-search-bar/global-search-bar.component';
import { CommonModule } from '@angular/common';
import { AppUserService, AppUser } from '../../core/services/app-user.service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    ChatSidebarComponent,
    GlobalSearchBarComponent,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isIframe = false;
  loginDisplay = false;
  showChatSidebar = signal(false);
  userDisplayName = signal<string | null>(null);

  private readonly _destroying$ = new Subject<void>();
  protected readonly themeService = inject(ThemeService);
  protected readonly authService = inject(AuthService);
  protected readonly chatService = inject(ChatService);

  private readonly appUserService = inject(AppUserService);
  private readonly cdr = inject(ChangeDetectorRef);

   async ngOnInit(): Promise<void> {
    this.isIframe = window !== window.parent && !window.opener;

    this.authService.loginDisplay$
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (isLoggedIn) => {
        this.loginDisplay = isLoggedIn;
          if (isLoggedIn) {
          const userId = this.authService.userId();
          if (userId) {
            this.appUserService.getUser(userId).subscribe((user: AppUser) => {
              this.userDisplayName.set(user.displayName);
              this.cdr.detectChanges(); 
            });
          }
        } else {
          this.userDisplayName.set(null);
        }
        this.cdr.detectChanges();
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