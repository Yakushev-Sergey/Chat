import { useEffect, useRef, useState } from "react";
import close from '../../images/close.png';
import styleSerch from './styleSerch.module.css';
import toNext from '../../images/toNext.png';
import toPrev from '../../images/toPrev.png';


interface SerchProps {
  onSearch: (query: string) => void;
  onClose: () => void;
  isOpen: boolean;

  hasResults: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export const Serch = ({ onSearch, onClose, isOpen, hasResults, onNext, onPrev }: SerchProps) => {

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen])

  const handleSearch = (value: string) => {
    setQuery(value),
      onSearch(value)
  };

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 250)
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`${styleSerch.container} ${isClosing ? styleSerch.closing : ''} `}>

        <input
          ref={inputRef}
          className={styleSerch.inputSearch}
          placeholder="Поиск в чате..."
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className={styleSerch.wrapper}>
          {hasResults && (
            <div className={styleSerch.navigatorWrapper}>
              <button className={styleSerch.btnNav} onClick={onPrev} disabled={!hasResults}>
                <img src={toPrev} alt="prev" />
              </button>

              <button className={styleSerch.btnNav} onClick={onNext} disabled={!hasResults}>
                <img src={toNext} alt="next" />
              </button>
            </div>
          )}
        </div>

        <button className={styleSerch.btnClose} onClick={handleClose}>
          <img className={styleSerch.imgClose} src={close} alt="назад" />
        </button>
      </div>
    </>
  )
}