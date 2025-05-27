import { ChatMessage } from './chat-message';

export interface Chat {
  id: string;
  displayName: string;
  messages: ChatMessage[];
  inputMessage?: string;
}
