import chatList from './chatList.module.css';
import type { Chat } from '../type/chat.types';
import { useState } from 'react';
import { ContactSearch } from './contactSearch/ContactSearch';

interface ChatListProps {
  chats: Chat[];
  currentChatId: string;
  onChatSelect: (id: string) => void;
}

export const ChatList = ({ chats, currentChatId, onChatSelect }: ChatListProps) => {

  const [searchQuery, setSearchQuery] = useState('')

  // Фильтруем чаты по имени (только если есть запрос)
  const filteredChats = searchQuery
    ? chats.filter(chat =>
      chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : chats;

    const handleSearch = (query: string) => {
      setSearchQuery(query)
    }

  return (
    <>
      <div className={chatList.wrapper}>

        <div className={chatList.search_wrapper}>
          <ContactSearch
          onSearch={handleSearch}
          />
        </div>

        {filteredChats.map(chat => (
          <div key={chat.id}
            className={` ${chatList.wrapper_contact} ${chat.id === currentChatId ? chatList.active : ''}`}
            onClick={() => onChatSelect(chat.id)}
          >

            <div className={chatList.content}>

              <div className={chatList.avatarUser}>
                <img className={chatList.user} src={chat.user.avatar} alt="#" />
              </div>
              <div className={chatList.content_text}>
                <div className={chatList.info}>
                  <h3 className={chatList.name} > {chat.user.name} </h3>
                </div>
                <div className={chatList.subTitle}> {chat.lastMessage} </div>
              </div>
            </div>
            <div className={chatList.count_sms}>
              <span className={chatList.time}> {chat.timestamp} </span>
              {chat.unreadCount > 0 && (
                <span className={chatList.count}>
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}

      </div>
    </>
  )
}