import { Component, inject } from '@angular/core'; 
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ChatSidebarComponent } from '../chat/chat-sidebar/chat-sidebar.component';
import { ChatService } from '../chat/services/chat.service';
import { GlobalSearchBarComponent } from '../../shared/components/global-search-bar/global-search-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule, 
    MatToolbar,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    ChatSidebarComponent,
    GlobalSearchBarComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent { 

  private readonly authService = inject(AuthService);
  public readonly chatService = inject(ChatService);
  
  public user = this.authService.currentUser;

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
