import { ChatMessage } from './../models/chat-message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, output, inject, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChatPreview } from '../models/chat-preview';
import { AuthService } from '../../../core/auth/auth.service';
import { OpenedChatsComponent } from '../opened-chats/opened-chats.component';
import { ChatSignalRService } from '../services/chat-signalr.service';
import { ChatService } from '../services/chat.service';
import { Chat } from '../models/chat';
import { Observable } from 'rxjs';
import { PagedListModel } from '../../../shared/models/paged-list-model';

@Component({
  selector: 'app-chat-sidebar',
  imports: [CommonModule, FormsModule, MatIconModule, OpenedChatsComponent],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss',
})
export class ChatSidebarComponent implements OnInit {
  close = output<void>();

  chatPreviews$!: Observable<PagedListModel<ChatPreview>>;

  authService = inject(AuthService);
  chatSignalRService = inject(ChatSignalRService);
  chatService = inject(ChatService);

  async ngOnInit(): Promise<void> {
    this.chatPreviews$ = this.chatService.getChatPreviews();

    this.chatSignalRService.messageReceived$.subscribe(
      (msg: ChatMessage | null) => {
        if (!msg) return;

        const opened = this.chatService
          .openedChats()
          .find((c: Chat) => c.id === msg.chatId);
        if (opened) {
          opened.messages.push({
            ...msg,
            isMe: msg.senderId === this.authService.userId(),
          });
          this.chatService.openedChats.set([...this.chatService.openedChats()]);
        }
      }
    );
  }
}
