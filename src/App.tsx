
import { ChatWindow } from './assets/components/chat/chatWindow'
import { ChatList } from './assets/components/chat/chatList'
import { mockChats } from './assets/components/data/mockChats'
import { useEffect, useRef, useState } from 'react'
import type { Chat } from './assets/components/type/chat.types';
import './style/global.css'
import { chatBot } from './assets/components/services/chatBot';
import { useWindowSize } from './assets/components/chat/windowSize';

function App() {

  // Состояние всех чатов (всегда отображаем)
  const [chats, setChats] = useState<Chat[]>(mockChats)

  // Состояние текущего выбранного чата (ID)
  const [currentChatId, setCurrentChatId] = useState<string>('')

  // Для мобилки: показывать чат
  const [showChat, setShowChat] = useState(false);

  const { width } = useWindowSize();
  const isMobile = width < 830;

  // Функция выбора чата
  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    markChatAsRead(chatId);
    if (isMobile) {
      setShowChat(true)
    }
  };

  // Функция возврата к списку
  const handleBackToList = () => {
    setShowChat(false)
  }

  // Находим текущий чат по ID
  const currentChat = chats.find(chat => chat.id === currentChatId)

  const currentChatIdRef = useRef<string>(currentChatId)
  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId])

  // Функция для добавления сообщения
  const hendleSendMessage = (chatId: string, text: string, isOwn: boolean = true) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          const newMessage = {
            id: `${chatId}_${Date.now()}`,
            text,
            timestamp: new Date().toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn,
            status: 'sent' as const
          };
          return {
            ...chat,
            lastMessage: text,
            unreadCount: !isOwn && chatId !== currentChatIdRef.current ? chat.unreadCount + 1 : chat.unreadCount,
            messages: [...chat.messages, newMessage]
          };
        }
        return chat
      })
    })
    if (isOwn) {
      // 1. Показываем "печатает..."
      setChats(prev => prev.map(chat =>
        chat.id === chatId ? { ...chat, isTyping: true } : chat
      ));
      // 2. Генерируем "умный" ответ
      const botResponse = chatBot.getResponce(text);
      const typingDelay = chatBot.getTypingDelay(botResponse);
      // 3. Имитируем печатание с реалистичной задержкой

      setTimeout(() => {
        setChats(prev => prev.map(chat => chat.id === chatId ?
          { ...chat, isTyping: false } : chat));
        hendleSendMessage(chatId, botResponse, false);
      }, typingDelay + 3000);
    }
  }

  // функция для голосовых
  const handleSendVoiceMessage = (chatId: string, audioBlob: Blob, duration: number) => {

    const audioUrl = URL.createObjectURL(audioBlob);
    const messageText = `голосовое сообщение`

    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          const newMessage = {
            id: `${chatId}_voice_${Date.now()}`,
            text: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true,
            status: 'sent' as const,
            type: 'voice' as const,
            audioUrl: audioUrl,
            duration: duration
          };
          return {
            ...chat,
            lastMessage: messageText,
            messages: [...chat.messages, newMessage]
          };
        }
        return chat;
      })
    })
  }

  // функция для сброса счетчика 
  const markChatAsRead = (chatId: string) => {
    setChats(prevChat =>
      prevChat.map(chat =>
        chat.id === chatId
          ? { ...chat, unreadCount: 0 } : chat
      )
    )
  };


  return (
    <>
      <div className="container">
        {(!isMobile || !showChat) && (
          <ChatList
            chats={chats}
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
          />
        )}
        {(!isMobile || showChat) && (
          <ChatWindow
            currentChat={currentChat}
            onSendMessage={(text) => currentChatId && hendleSendMessage(currentChatId, text)}
            onSendVoiceMessage={(audioBlob, duration) =>
              currentChatId && handleSendVoiceMessage(currentChatId, audioBlob, duration)
            }
            onBack={isMobile ? handleBackToList : undefined}
          />
        )}
      </div>
    </>
  )
}

export default App
