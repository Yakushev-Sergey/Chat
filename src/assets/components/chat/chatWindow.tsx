import chatWindow from './chatWindow.module.css';
import search from '../images/search.png'
import call from '../images/call.png'
import iconSpeak from '../images/speak.png'
import letter from '../images/letter.png'
import onBackImg from '../images/onBack.png'
import type React from 'react';
import type { Chat } from '../type/chat.types';
import { useEffect, useRef, useState } from 'react';
import { VoiceRecorder } from './voiceRecorders/voiceRecorder';
import { VoicePlayer } from './voiceRecorders/voicePlayer';
import { Serch } from './serchMessage/serch';
import { ChatEmojiPicker } from './chatEmojiPicker/chatEmojiPicker';
import { useWindowSize } from './windowSize';

interface ChatWindowProps {
  currentChat: Chat | undefined;
  onSendMessage: (text: string) => void
  onSendVoiceMessage?: (audioBlob: Blob, duration: number) => void;
  onBack?: () => void;
}

export const ChatWindow = ({ currentChat, onSendMessage, onSendVoiceMessage, onBack }: ChatWindowProps) => {
  //  состояния для поиска 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1)
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { width } = useWindowSize();
  const isMobilSmall = width < 500;
  const isMobil = width < 1070;

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Функция подсветки найденного текста
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));

    return parts.map((part, index) => {
      return part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className={chatWindow.highLight}>{part}</mark>
      ) : (
        part
      )
    })
  }

  useEffect(() => {
    if (!searchQuery || !currentChat) {
      setSearchResults([])
      setCurrentResultIndex(-1)
      return
    }
    const results = currentChat.messages
      .filter(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(msg => msg.id);

    setSearchResults(results);
    setCurrentResultIndex(results.length > 0 ? 0 : -1)
  }, [searchQuery, currentChat])

  // Навигация  
  const goToNext = () => {
    if (searchResults.length === 0) return;
    const next = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(next)

    const element = document.getElementById(`msg-${searchResults[next]}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const goToPrev = () => {
    if (searchResults.length === 0) return;
    const prev = currentResultIndex - 1;
    const newIndex = prev < 0 ? searchResults.length - 1 : prev;
    setCurrentResultIndex(newIndex)

    const element = document.getElementById(`msg-${searchResults[newIndex]}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  // Функция для обработки отправки голосового
  const handleSendVoiceMessage = (audioBlob: Blob, duration: number) => {
    console.log('Голосовое сообщение:', {
      duration,
      size: audioBlob.size,
      type: audioBlob.type
    });
    // Скрываем панель записи
    setShowVoiceRecorder(false)
    if (onSendVoiceMessage) {
      onSendVoiceMessage(audioBlob, duration);
    }

  }
  // Функция для отмены записи
  const handleCancelRecording = () => {
    setShowVoiceRecorder(false)
  }

  const [messageText, setMessageText] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Ref для якоря в конце сообщений
  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messageEndRef.current) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }, 50)
    }
  }, [currentChat?.messages.length]);

  // Обработчик отправки сообщения
  const handleSend = () => {
    if (messageText.trim() === "") return;
    onSendMessage(messageText)

    // Очищаем поле ввода
    setMessageText('')
    if (textareaRef.current) {
      const isMobile = window.innerWidth < 1000;
      const baseHeight = isMobile ? 40 : 50;
      textareaRef.current.style.height = `${baseHeight}px `
    }
  }

  // Обработчик нажатия клавиш (Enter для отправки)
  const hendleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    window.scroll(0, 0);
    const isMobile = window.innerWidth < 1000;
    const baseHeight = isMobile ? 40 : 50;
    const maxHeight = isMobile ? 120 : 150;

    const textarea = e.currentTarget;
    textarea.style.height = ` ${baseHeight}px `;
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';

    setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 10);
  }
  // Фокус на textarea после вставки эмодзи
  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji)
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0)
  };
  return (
    <>
      <div className={chatWindow.wrapper}>
        {currentChat && (
          <>
            <div className={chatWindow.middle_header}>
              { (!isSearchOpen || !isMobilSmall) && onBack && (
                <button className={chatWindow.btnOnBack} onClick={onBack}>
                  <img className={chatWindow.btnOnBackIMG} src={onBackImg} alt="back" />
                </button>
              )}
              <div className={chatWindow.content}>
                {(!isSearchOpen || !isMobilSmall) && (
                  <div className={chatWindow.avatarUser}>
                    <img className={chatWindow.user} src={currentChat.user.avatar} alt="#" />
                  </div>
                )}
                {(!isSearchOpen || !isMobil) && (

                  <div className={chatWindow.content_text}>
                    <div className={chatWindow.info}>
                      <h3 className={chatWindow.name} >
                        {currentChat.user.name}
                      </h3>
                    </div>
                    <div className={chatWindow.subTitle}>
                      {
                        currentChat.isTyping ? (
                          <span className={chatWindow.typingDots}>Печатает... </span>
                        ) : (
                          currentChat.user.lastSeen || 'был(а) недавно'
                        )
                      }
                    </div>
                  </div>
                )}
              </div>
              <div className={chatWindow.wrapperSearch}>
                {isSearchOpen && (
                  <Serch
                    isOpen={isSearchOpen}
                    onClose={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('')
                    }}
                    onSearch={handleSearch}

                    hasResults={searchResults.length > 0}
                    onNext={goToNext}
                    onPrev={goToPrev}
                  />
                )}
              </div>
              <div className={chatWindow.header_tools}>
                {/* поиск */}
                {!isSearchOpen && (
                  <button className={chatWindow.header_tools_btn} onClick={() => setIsSearchOpen(true)} >
                    <img className={chatWindow.ican} src={search} alt="#" />
                  </button>
                )}
                {/* звонок */}
                {(!isSearchOpen || !isMobilSmall)  && (
                  <button className={chatWindow.header_tools_btn}>
                    <img className={chatWindow.ican} src={call} alt="#" />
                  </button>
                )}
              </div>
            </div>
            {/* рендеринг сообщений  */}
            <div className={chatWindow.messages_container_wrapper}>
              <div className={chatWindow.messages_container}>
                {currentChat.messages.length > 0 ? (
                  currentChat.messages.map(message => (
                    <div id={`msg-${message.id}`} key={message.id}
                      className={` ${chatWindow.message_item} 
                    ${message.isOwn ? chatWindow.message_item_user : chatWindow.message_item_friend} `}>
                      {message.type === 'voice' && message.audioUrl ? (
                        <div className={chatWindow.voiceContainer}>
                          <VoicePlayer
                            audioUrl={message.audioUrl}
                            text={message.text}
                            duration={message.duration}
                          />
                        </div>
                      ) : (
                        <>
                          <p className={chatWindow.content_messages}>
                            {highlightText(message.text, searchQuery)}
                          </p>
                          <span className={chatWindow.message_time}>
                            {message.timestamp}
                            {message.isOwn && (
                              message.status === 'read' ? '✓✓' :
                                message.status === 'delivered' ? '✓✓' : '✓'
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  ))
                ) : null}
                <div ref={messageEndRef}></div>
              </div>
            </div>
            {/* Футер ввод сообщений и кноки отправки и тут кнопка записи звука  */}
            <div className={chatWindow.messages_wrapper_footer}>
              <div className={chatWindow.inputContainer}>
                <textarea
                  className={chatWindow.input_messages}
                  placeholder='Сообщение'
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={hendleKeyDown}
                  onInput={handleInput}
                  ref={textareaRef}
                  disabled={showVoiceRecorder}
                  name="message"
                >
                </textarea>
                <ChatEmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                />
                {showVoiceRecorder ? (
                  <div className={chatWindow.voiceRecorderContainer}>
                    <VoiceRecorder
                      onSendVoiceMessage={handleSendVoiceMessage}
                      onCancel={handleCancelRecording}
                      className={chatWindow.voiceRecorder}
                    />
                  </div>
                ) : (
                  <button
                    className={chatWindow.btnMessage}
                    onClick={() => {
                      if (messageText.trim()) {
                        handleSend();
                      } else {
                        setShowVoiceRecorder(true)
                      }
                    }}
                  >
                    {!messageText.trim() ? (
                      <img className={`${chatWindow.icon_speak} `}
                        src={iconSpeak} alt="Запись" />
                    ) : (
                      <img className={` ${chatWindow.icon_letter} `}
                        src={letter} alt="Отправить" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div >
    </>
  )
}