
export class ChatBotService {
  private response = {
    greeting: [
      "Привет! Как дела?",
      "Здравствуй! Рад тебя видеть!",
      "Приветствую! Что нового?"
    ],
    question: [
      "Интересный вопрос! Дай мне подумать...",
      "Хм, хороший вопрос. А как ты сам думаешь?",
      "Сложно сказать однозначно"
    ],
    help: [
      "Чем могу помочь?",
      "Расскажи подробнее, что тебя беспокоит",
      "Я здесь, чтобы помочь!"
    ],
    thanks: [
      "Всегда пожалуйста!",
      "Рад был помочь!",
      "Обращайся!"
    ],
    weather: [
      "Погода отличная для прогулки!",
      "На улице солнечно, как настроение?",
      "Лучший день, чтобы остаться дома с чашкой чая"
    ],
    default: [
      "Понял тебя!",
      "Интересно...",
      "Расскажи больше об этом",
      "Я слушаю",
      "Продолжай, это интересно"
    ]
  }

  private detectTopic(message: string): keyof typeof this.response {
    const msg = message.toLowerCase();
    if (msg.includes('привет') || msg.includes('здравств') || msg.includes('hi') || msg.includes('hello')) {
      return 'greeting';
    }
    if (msg.includes('?') || msg.includes('почему') || msg.includes('как') || msg.includes('что')) {
      return 'question';
    }
    if (msg.includes('спасибо') || msg.includes('благодар')) {
      return 'thanks';
    }
    if (msg.includes('помоги') || msg.includes('help') || msg.includes('нужна помощь')) {
      return 'help';
    }
    if (msg.includes('погод') || msg.includes('дожд') || msg.includes('солнц')) {
      return 'weather';
    }
    return 'default';
  }

    // Генерируем ответ
  public getResponce(userMessage: string): string {
    const topic = this.detectTopic(userMessage)
    const possibleResponses  = this.response[topic]

    return possibleResponses[Math.floor(Math.random() * possibleResponses.length)]
  }
  // Имитация "печатания" с разной скоростью
  public getTypingDelay(message: string): number {
    const length = message.length;
    // Чем длиннее сообщение, тем дольше "печатает"
    return 500 + Math.min(length * 50, 3000)
  }

}

export const chatBot = new ChatBotService();
