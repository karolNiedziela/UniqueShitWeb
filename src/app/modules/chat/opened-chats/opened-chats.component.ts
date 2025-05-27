import { MatButtonModule } from '@angular/material/button';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../services/chat.service';
import { Chat } from '../models/chat';

@Component({
  selector: 'app-opened-chats',
  imports: [FormsModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './opened-chats.component.html',
  styleUrl: './opened-chats.component.scss',
})
export class OpenedChatsComponent implements AfterViewChecked {
  openedChats = input<Chat[]>([]);
  closeChat = output<EventEmitter<string>>();

  protected readonly chatService = inject(ChatService);

  @ViewChildren('messagesContainer') messagesContainers!: QueryList<ElementRef>;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    this.messagesContainers?.forEach((container) => {
      const el = container.nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }
}
