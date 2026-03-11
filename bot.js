const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

let CHAT_ID = null;


// khi người dùng gửi /start
bot.onText(/\/start/, (msg) => {
  CHAT_ID = msg.chat.id;

  bot.sendMessage(
    CHAT_ID,
    "🤖 Bot Yu-Gi-Oh đã hoạt động!\n\nGõ /card để nhận 1 lá bài."
  );

  console.log("Chat ID:", CHAT_ID);
});


// khi người dùng gửi /card
bot.onText(/\/card/, (msg) => {
  CHAT_ID = msg.chat.id;
  sendRandomCard();
});


// lấy card random
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

    const image = card.card_images[0].image_url;

    await bot.sendPhoto(CHAT_ID, image, {
      caption: caption.substring(0, 1000) // tránh caption quá dài
    });

  } catch (err) {
    console.log("Error:", err.message);
  }
}


// gửi card mỗi 10 giây (test)
setInterval(() => {
  sendRandomCard();
}, 10000);