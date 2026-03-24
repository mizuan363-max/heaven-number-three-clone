const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const http = require('http');

// Tokens
const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ FIXED MODEL NAME
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest" 
});

// Start Command
bot.start((ctx) => 
  ctx.reply("Hello! Bot is now working 🤖")
);

// Message Handling
bot.on('text', async (ctx) => {
  try {
    await ctx.sendChatAction('typing');

    const result = await model.generateContent(ctx.message.text);

    // ✅ safer response handling
    const text = result.response.text();

    await ctx.reply(text || "No response generated 😅");
  } catch (error) {
    console.error("ERROR:", error.message);

    ctx.reply("❌ Error occurred... Please try again later.");
  }
});

// Keep-alive server (Render)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot is running!");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  bot.launch();
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
