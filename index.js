const { Telegraf } = require('telegraf');
const http = require('http');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Test command
bot.start((ctx) => ctx.reply("✅ Bot is working now!"));

// Test message
bot.on('text', (ctx) => {
  console.log("Message:", ctx.message.text);
  ctx.reply("✅ Alive");
});

// Web server
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("OK");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🌐 Server running on port", PORT);

  bot.launch()
    .then(() => console.log("🤖 Bot launched"))
    .catch(err => console.error("❌ Bot error:", err));
});

// Stop safely
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));