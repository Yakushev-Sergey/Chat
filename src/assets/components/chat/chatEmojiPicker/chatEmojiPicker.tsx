import { useEffect, useRef, useState } from "react"
import emojiIcon from '../../images/emo.png'
import EmojiPicker from "emoji-picker-react";
import styleEmoji from './styleEmoji.module.css'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const ChatEmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {

  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне области
  useEffect(() => {
    const handleClickOutside = () => {
      if (pickerRef.current && !pickerRef.current.contains(event?.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, []);

  return (
    <>
      <div className={styleEmoji.wrapperEmoji} >
        <button className={styleEmoji.btnEmoji} onClick={() => setShowPicker(!showPicker)}>
          <img className={styleEmoji.imgBtnEmo} src={emojiIcon} alt="" />
        </button>

        {showPicker && (
          <div className={styleEmoji.pickerWrapper}>
            <EmojiPicker
              onEmojiClick={(emojiDate) => {
                onEmojiSelect(emojiDate.emoji)
                setShowPicker(false)
              }}
              autoFocusSearch={false}
              lazyLoadEmojis={true}
              skinTonesDisabled
              searchDisabled
              width={320}
              height={400}
            />
          </div>
        )}
      </div>
    </>
  )
}