export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
  isMe?: boolean;
}
