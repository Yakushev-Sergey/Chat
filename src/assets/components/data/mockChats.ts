import type { Chat } from "../type/chat.types";
import bot from '../images/avatar/bot.jpg'
import doris from '../images/avatar/doris.jpg'
import sara from '../images/avatar/sara.jpg'

export const mockChats: Chat[] = [
  {
    id: '1',
    user: {
      id: 'Настя',
      name: 'Настя Какошка',
      avatar: sara,
    },
    lastMessage: 'Ты можешь угостить меня ужином? или я умру голодной смертью',
    unreadCount: 0,
    timestamp: '12:35',
    isTyping: false,
    messages: [
      {
        id: '1_1',
        text: 'Ты можешь угостить меня ужином? или я умру голодной смертью',
        timestamp: '12:35',
        isOwn: false,
        status: 'read'
      },
      {
        id: '1_2',
        text: 'Привет! Да, конечно. Где встретимся?',
        timestamp: '12:36',
        isOwn: true,
        status: 'read'
      },
      {
        id: '1_3',
        text: 'Давай в центре, у того ресторана с итальянской кухней',
        timestamp: '12:37',
        isOwn: false,
        status: 'read'
      },
      {
        id: '1_4',
        text: 'Отлично! В 19:00?',
        timestamp: '12:38',
        isOwn: true,
        status: 'delivered'
      }
    ]
  },
  {
    id: '2',
    user: {
      id: 'ai_bot',
      name: 'Помощник',
      avatar: bot,
    },
    lastMessage: 'Готов помочь!',
    unreadCount: 0,
    timestamp: '12:00',
    isTyping: false,
    messages: [
      {
        id: '3_1',
        text: 'Привет! Я помощник. Спроси меня о чем угодно!',
        timestamp: '12:00',
        isOwn: false,
        status: 'read'
      }
    ]
  },
  {
    id: '3',
    user: {
      id: 'Даша',
      name: 'Даша Компотик',
      avatar: doris,
    },
    lastMessage: 'Прочтите эту статью, она такая потрясающая... о смерти маленьких кроликов',
    unreadCount: 0,
    timestamp: '12:35',
    isTyping: false,
    messages: [
            {
        id: '1_1',
        text: 'Прочтите эту статью, она такая потрясающая... о смерти маленьких кроликов',
        timestamp: '11:35',
        isOwn: false,
        status: 'read'
      },
    ]
  },
]

