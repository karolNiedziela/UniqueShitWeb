import { Component, inject, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { ChatSidebarComponent } from '../chat/chat-sidebar/chat-sidebar.component';
import { ChatService } from '../chat/services/chat.service';
import { GlobalSearchBarComponent } from '../../shared/components/global-search-bar/global-search-bar.component';
import { CommonModule } from '@angular/common';

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
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  loginDisplay = false;
  userDisplayName = '';

  private readonly destroying$ = new Subject<void>();
  private readonly authService = inject(AuthService);
  public readonly chatService = inject(ChatService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroying$))
      .subscribe(user => {
        this.loginDisplay = !!user;
        this.userDisplayName = user?.displayName ?? '';
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
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
