import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/webhook", async (req, res) => {
    try {
        const update = req.body;

        // Если нет сообщения — игнорируем
        if (!update.message || !update.message.text) {
            return res.sendStatus(200);
        }

        const chatId = update.message.chat.id;
        const userText = update.message.text;

        // Запрос к OpenAI
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
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                }
            }
        );

        const reply = aiResponse.data.choices[0].message.content;

        // Отправка сообщения в Telegram
        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
            {
                chat_id: chatId,
                text: reply
            }
        );

        return res.sendStatus(200);
    } catch (err) {
        console.error("BOT ERROR:", err.response?.data || err.message);
        return res.sendStatus(500);
    }
});

// Render port
app.listen(process.env.PORT || 10000, () => {
    console.log("BOT SERVER RUNNING");
});
