
export interface User {
  id: string,
  name: string,
  avatar: string,
  lastSeen?: string;
}

export interface Messages {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'voice';
  audioUrl?: string;
  duration?: number;
}

export interface Chat {
  id: string,
  user: User,
  lastMessage: string,
  unreadCount: number,
  timestamp: string,
  messages: Messages[];
  isTyping?: boolean;
}

export interface AppStatus {
  chats: Chat[];
  currentChatId: string | null;
}