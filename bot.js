const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const cron = require("node-cron");

const TOKEN = "8733031342:AAEtV36Uq0DKq8CsorABkFCpJ0NVDnMNW4g";

const bot = new TelegramBot(TOKEN, { polling: true });

let CHAT_ID = null;

bot.on("message", (msg) => {
  CHAT_ID = msg.chat.id;
  console.log("Chat ID:", CHAT_ID);
});

async function sendRandomCard() {
  if (!CHAT_ID) return;

  try {
    const res = await axios.get("https://db.ygoprodeck.com/api/v7/randomcard.php");

    const card = res.data;

    const caption = `
🃏 ${card.name}

Type: ${card.type}

${card.desc}
`;

    const image = card.card_images[0].image_url;

    bot.sendPhoto(CHAT_ID, image, { caption });

  } catch (err) {
    console.log(err);
  }
}

// mỗi 1 tiếng
cron.schedule("0 * * * *", () => {
  sendRandomCard();
});

bot.onText(/\/card/, () => {
  sendRandomCard();
});