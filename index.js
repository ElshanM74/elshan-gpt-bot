import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// ====== CONFIG ======
const TELEGRAM_BOT_TOKEN = "ТОКЕН_БОТА_С_@BotFather";
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
// =====================

// Главный Webhook обработчик
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || !message.chat || !message.text) {
      return res.sendStatus(200);
    }

    const chatId = message.chat.id;
    const userText = message.text;

    // Ответ бота
    const reply = `Здравствуйте!  
Я — Elshan AI Strategy Bot.  
Ваш запрос: *${userText}*  
Сейчас подготовлю решение.`;

    // Отправляем ответ
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: reply,
      parse_mode: "Markdown"
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(500);
  }
});

// Render требует указать порт
app.listen(10000, () => console.log("Bot server running on port 10000"));
