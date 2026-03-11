const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");

// lấy token từ Render Environment Variable
const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

let CHAT_ID = null;

// khi user chat
bot.on("message", (msg) => {
  CHAT_ID = msg.chat.id;
  console.log("Chat ID:", CHAT_ID);
});

// lệnh start
bot.onText(/\/start/, (msg) => {
  CHAT_ID = msg.chat.id;

  bot.sendMessage(
    CHAT_ID,
    "🤖 Yu-Gi-Oh Bot đang chạy!\n\nGõ /card để nhận 1 lá bài random."
  );
});

// lệnh card
bot.onText(/\/card/, (msg) => {
  CHAT_ID = msg.chat.id;
  sendRandomCard();
});

async function sendRandomCard() {
  if (!CHAT_ID) return;

  try {
    const response = await axios.get(
      "https://db.ygoprodeck.com/api/v7/randomcard.php"
    );

    const card = response.data;

    const name = card.name || "Unknown";
    const type = card.type || "Unknown";
    const desc = card.desc || "No description";

    const caption = `🃏 ${name}

Type: ${type}

${desc}`.substring(0, 1000);

    const image = card.card_images?.[0]?.image_url;

    if (image) {
      await bot.sendPhoto(CHAT_ID, image, { caption });
    } else {
      await bot.sendMessage(CHAT_ID, caption);
    }

  } catch (error) {
    console.log("API error:", error.message);
  }
}

// gửi card mỗi 10 giây (test)
setInterval(() => {
  sendRandomCard();
}, 10000);


// mở port cho Render để service không bị kill
const app = express();

app.get("/", (req, res) => {
  res.send("Yu-Gi-Oh Bot is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});