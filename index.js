import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Берём ключи из переменных окружения Render
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/webhook", async (req, res) => {
  try {
    const update = req.body;

    if (!update.message || !update.message.text) {
      return res.sendStatus(200);
    }

    const chatId = update.message.chat.id;
    const userText = update.message.text;

    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты умный ассистент Эльшана."},
          { role: "user", content: userText }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = openaiResponse.data.choices[0].message.content;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: botReply
      }
    );

    res.sendStatus(200);

  } catch (err) {
    console.error("BOT ERROR:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

// Render требует порт из process.env.PORT
app.listen(process.env.PORT || 10000, () => {
  console.log("BOT SERVER RUNNING");
});
