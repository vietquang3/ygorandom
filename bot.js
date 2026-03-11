const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");

const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

let CHAT_ID = null;

bot.onText(/\/start/, (msg) => {
  CHAT_ID = msg.chat.id;
  bot.sendMessage(CHAT_ID, "🤖 Bot Yu-Gi-Oh đang chạy!");
});

bot.onText(/\/card/, (msg) => {
  CHAT_ID = msg.chat.id;
  sendRandomCard();
});

async function sendRandomCard() {
  if (!CHAT_ID) return;

  try {
    const res = await axios.get(
      "https://db.ygoprodeck.com/api/v7/randomcard.php"
    );

    const card = res.data;

    const caption = `
🃏 ${card.name}

Type: ${card.type}

${card.desc}
`;

    const image = card.card_images?.[0]?.image_url;

    if (image) {
      await bot.sendPhoto(CHAT_ID, image, {
        caption: caption.substring(0, 1000),
      });
    } else {
      await bot.sendMessage(CHAT_ID, caption);
    }

  } catch (err) {
    console.log(err);
  }
}

setInterval(() => {
  sendRandomCard();
}, 10000);


// mở port cho Render
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(process.env.PORT || 3000);