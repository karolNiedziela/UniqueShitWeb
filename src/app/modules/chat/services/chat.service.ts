import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { SendMessageToUser } from '../models/send-message-to-user.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Chat } from '../models/chat';
import { ChatSignalRService } from './chat-signalr.service';
import { fromEvent, max, Observable, Subscription } from 'rxjs';
import { ChatMessage } from '../models/chat-message';
import { ChatPreview } from '../models/chat-preview';
import { PagedListModel } from '../../../shared/models/paged-list-model';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private _chatsEndpoints = `${environment.apiUrl}/private-chats`;

  public openedChats = signal<Chat[]>([]);

  public sidebarOpened = signal(false);

  chatSignalRService = inject(ChatSignalRService);
  authService = inject(AuthService);
  httpClient = inject(HttpClient);

  private resizeSub: Subscription;

  constructor() {
    this.resizeSub = fromEvent(window, 'resize').subscribe(() => {
      this.openedChats.update((chats) => this.enforceChatLimit(chats));
    });

    this.openedChats.update((chats) => this.enforceChatLimit(chats));
  }

  ngOnDestroy() {
    this.resizeSub.unsubscribe();
  }

  public startChat(receiverId: string, displayName: string): void {
    const result = this.httpClient.post<Chat>(
      `${this._chatsEndpoints}/get-or-create`,
      {
        receiverId,
        displayName,
      }
    );

    result.subscribe((response: Chat) => {
      this.openedChats.update((chats) => {
        const existing = chats.find((c) => c.id === response.id);
        if (existing) return chats;

        const newChats = [
          ...chats,
          {
            ...response,
            messages: (response.messages ?? []).map((msg: ChatMessage) => ({
              ...msg,
              isMe: msg.senderId === this.authService.userId(),
            })),
          },
        ];

        return this.enforceChatLimit(newChats);
      });
    });
  }

  public addChat(chatId: string): void {
    const existing = this.openedChats().find((c) => c.id === chatId);
    if (existing) return;

    let params = new HttpParams();
    params = params.append('pn', 1);

    this.httpClient
      .get<Chat>(`${this._chatsEndpoints}/${chatId}/messages`, {
        params: params,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (chat: Chat) => {
          this.openedChats.update((chats) => {
            const newChats = [
              ...chats,
              {
                ...chat,
                messages: (chat.messages ?? []).map((msg: ChatMessage) => ({
                  ...msg,
                  isMe: msg.senderId === this.authService.userId(),
                })),
              },
            ];

            return this.enforceChatLimit(newChats);
          });
        },
        error: (err) => {
          console.error('Error fetching chat:', err);
        },
      });
  }

  public getChatPreviews(): Observable<PagedListModel<ChatPreview>> {
    let params = new HttpParams();
    params = params.append('pn', 1);

    return this.httpClient.get<PagedListModel<ChatPreview>>(
      `${this._chatsEndpoints}/previews`,
      { params }
    );
  }

  public removeChat(chatId: string): void {
    this.openedChats.update((chats) => chats.filter((c) => c.id !== chatId));
  }

  public closeAllChats(): void {
    this.openedChats.update(() => []);
  }

  public updateInput(chatId: string, value: string): void {
    this.openedChats.update((chats) =>
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, inputMessage: value } : chat
      )
    );
  }

  public sendMessage(chatId: string): void {
    const opened = this.openedChats().find((c) => c.id === chatId);
    if (!opened || !opened.inputMessage?.trim()) return;

    const message: SendMessageToUser = {
      chatId: opened.id,
      content: opened.inputMessage!,
    };

    this.sendMessageToUser(message).subscribe({
      next: (chatMessageResponse: ChatMessage) => {
        this.addMessage(chatMessageResponse);
        this.updateInput(chatMessageResponse.chatId, '');
      },
    });
  }

  private sendMessageToUser(
    message: SendMessageToUser
  ): Observable<ChatMessage> {
    return this.httpClient.post<ChatMessage>(
      `${this._chatsEndpoints}/send-message`,
      message
    );
  }

  private addMessage(message: ChatMessage): void {
    this.openedChats.update((chats) =>
      chats.map((chat) =>
        chat.id === message.chatId
          ? { ...chat, messages: [...(chat.messages ?? []), message] }
          : chat
      )
    );
  }

  private getMaxChats(): number {
    const width = window.innerWidth;
    if (width <= 1200) return 1;

    return 3;
  }

  private enforceChatLimit(chats: Chat[]): Chat[] {
    const maxChats = this.getMaxChats();
    if (chats.length <= maxChats) return chats;
    return chats.slice(-maxChats);
  }
}
