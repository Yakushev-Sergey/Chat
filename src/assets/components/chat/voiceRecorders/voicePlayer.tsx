import { useEffect, useRef, useState } from "react";
import style from './voice.module.css';
import play from '../../images/play.png'
import pause from '../../images/pause.png'
import voiceStyle from './voice.module.css'

interface VoicePlayerProps {
  audioUrl?: string;
  text: string;
  duration?: number;
}

export const VoicePlayer = ({ audioUrl, text, duration = 0 }: VoicePlayerProps) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0)
  // ← Таймер для обновления времени
  const progressTimerRef = useRef<number | null>(null)
  // Функция форматирования времени

  // Форматирование времени (та же функция что и в App)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const secsRemain = Math.floor(secs % 60);
    return `${mins}:${secsRemain.toString().padStart(2, '0')}`;
  };

  // Функция создания/пересоздания аудио
  const getOrCreateAudio = () => {
    if (!audioUrl) return null;

    if (!audioRef.current || audioRef.current.ended) {
      audioRef.current = new Audio(audioUrl);

      if (currentTime > 0) {
        audioRef.current.currentTime = currentTime;
      }

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        stopProgressTimer();
        audioRef.current = null;
      };

      audioRef.current.onpause = () => {
        setIsPlaying(false);
        stopProgressTimer();
      };

      audioRef.current.onplay = () => {
        setIsPlaying(true);
        startProgressTimer();
      };
    }

    return audioRef.current;
  };

  // Запуск таймера для обновления текущего времени
  const startProgressTimer = () => {
    stopProgressTimer();
    progressTimerRef.current = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused && !audioRef.current.ended) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 100);
  };

  // Остановка таймера
  const stopProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const togglePlay = () => {
    const audio = getOrCreateAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error('Ошибка воспроизведения:', e));
    }
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stopProgressTimer();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Считаем обратный отсчет
  const remainingTime = duration - currentTime;


  return (
    <>
      <div className={style.brnWrapper}>
        <button className={style.btnPlay} onClick={togglePlay}>
          {isPlaying ? <img className={voiceStyle.btnPlayImg} src={pause} /> : <img className={voiceStyle.btnPlayImg} src={play} />}
        </button>
        <div className={style.timeDisplay}>
          <span>{formatTime(remainingTime)}</span>
        </div>
        <span>
          {text}
        </span>
      </div>
    </>
  )
}