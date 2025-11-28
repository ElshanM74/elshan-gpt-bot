import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Проверка что всё загружено
if (!TOKEN) console.error("❌ TELEGRAM_TOKEN отсутствует!");
if (!OPENAI_KEY) console.error("❌ OPENAI_API_KEY отсутствует!");

// Главный Webhook
app.post(`/webhook/${TOKEN}`, async (req, res) => {
  try {
    const chatId = req.body.message.chat.id;
    const userText = req.body.message.text;

    // Запрос в OpenAI
    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты умный ассистент Эльшана." },
          { role: "user", content: userText }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = aiResponse.data.choices[0].message.content;

    // Ответ в Telegram
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: reply
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error("BOT ERROR:", err.response?.data || err.message);
    return res.sendStatus(500);
  }
});

// порт для Render
app.listen(10000, () => {
  console.log("BOT SERVER RUNNING");
});
