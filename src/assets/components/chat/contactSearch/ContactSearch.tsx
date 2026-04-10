import React, { useEffect, useRef, useState } from "react";
import styleConSer from './style.module.css';
import cloce from '../../images/close.png'

interface ContactSearchProps {
  onSearch: (query: string) => void;
}

export const ContactSearch = ({ onSearch }: ContactSearchProps) => {

  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      onSearch(value);
    } else {
      onSearch('')
    }
  }
  const handleClear = () => {
    setQuery('');
    onSearch('');
    setIsActive(false)
  }

  const handleFocus = () => {
    setIsActive(true)
  }

  return (
    <>
      <div className={styleConSer.search_wrapper}>
        <input
          className={styleConSer.search}
          value={query}
          ref={inputRef}
          onChange={handleChange}
          onFocus={handleFocus}
          type="text"
          placeholder='Поиск'
        />
        {query && (
          <button className={styleConSer.btnClose} onClick={handleClear}>
            <img className={styleConSer.imgCloce} src={cloce} alt="назад" />
          </button>
        )}
      </div>
    </>
  )
}