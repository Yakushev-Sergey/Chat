import { useEffect, useRef, useState } from "react"
import voiceStyle from './voice.module.css'
import letter from '../../images/letter.png'
import basket from '../../images/basket.png'
import play from '../../images/play.png'
import pause from '../../images/pause.png'


interface VoiceRecorderProps {
  onSendVoiceMessage: (audioBlod: Blob, duration: number) => void;
  onCancel?: () => void;
  className: string;
}
export const VoiceRecorder = ({ onSendVoiceMessage, onCancel, className }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 1. Очистка ресурсов (везде обнуляем timerRef!)
  const stopRecordingCleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null; // ОБЯЗАТЕЛЬНО обнуляем!
    }
    // Остановка записи
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    // Остановка потока микрофона
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setIsRecording(false);
    setIsPaused(false);
  };


  // 2. Старт записи (проверяем все состояния!)
  const startRecording = async () => {
    // Если уже идёт запись или таймер активен — не стартуем
    if (isRecording || mediaRecorderRef.current || timerRef.current) return;

    try {
      //Шаг 1: Запрашиваем доступ к микрофону у пользователя
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        }
      });
      streamRef.current = stream;
      let mimeType = 'audio/webm';
      const supportedTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus'
      ];
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      // Шаг 2: Создаем MediaRecorder - объект для записи аудио
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      //Шаг 3: Настраиваем обработчик данных

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      // Шаг 4: Настраиваем обработчик окончания записи

      mediaRecorder.onstop = () => { }; // Пустой обработчик

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      // Шаг 7: Запускаем таймер для отсчета секунд
      // Запускаем таймер ТОЛЬКО если его нет
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setRecordingTime(t => t + 1);
        }, 1000);
      }
    } catch (error) {
      console.error('Микрофон недоступен:', error);
      alert('Проверьте разрешения микрофона.');
      stopRecordingCleanup();
      onCancel?.();
    }
  };

  // 3. Пауза/возобновление (критично: обнуление timerRef)
  const togglePauseRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    if (isPaused) {
      // Возобновляем
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      // Запускаем таймер, только если его нет
      if (!timerRef.current) {
        timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
      }
    } else {
      // Пауза
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      // Останавливаем и ОБНУЛЯЕМ таймер
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // 4. Остановка и отправка
  const stopRecordingAndSend = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    // Останавливаем таймер и обнуляем
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    mediaRecorderRef.current.stop();
    // Останавливаем поток микрофона
    setTimeout(() => {
      if (audioChunksRef.current.length > 0) {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onSendVoiceMessage(blob, recordingTime);
      }
      audioChunksRef.current = [];
      stopRecordingCleanup();
    }, 100);
  };

  // 5. Отмена записи
  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopRecordingCleanup();
    onCancel?.();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startRecording();
    }, 300); // Даем время на отрисовку

    return () => {
      clearTimeout(timer);
      stopRecordingCleanup();
    };
  }, []);
  // 7. Форматирование времени
  const formatTime = (secs: number) =>
    `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')
    }`;

  return (
    <div className={`${voiceStyle.wrapper} ${className}`}>
      <div className={voiceStyle.recordinfPanel}>
        <div className={voiceStyle.controls}>
          <div className={voiceStyle.timer}>
            {formatTime(recordingTime)}
            {isPaused && <span> (пауза) </span>}
          </div>
          {!isPaused && (
            <div className={voiceStyle.recordingIndicator}>
              <div className={voiceStyle.recordingDot}></div>
            </div>
          )}
          <button
            className={`${voiceStyle.controlButton} ${voiceStyle.controlPause}`}
            onClick={togglePauseRecording}
          >
            {isPaused ? <img className={voiceStyle.play} src={play} /> : <img className={voiceStyle.pause} src={pause} />}
          </button>
          <button
            className={`${voiceStyle.controlButton} ${voiceStyle.cancleButton}`}
            onClick={cancelRecording}
          >
            <img className={voiceStyle.backet} src={basket} alt="" />
          </button>
          {!isPaused && (
            <button
              className={`${voiceStyle.controlButton} ${voiceStyle.btnMessage}`}
              onClick={stopRecordingAndSend}
            >
              <img className={voiceStyle.letter} src={letter} alt="" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
