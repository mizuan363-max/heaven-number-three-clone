const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const http = require('http');

// Bot နှင့် AI ပတ်သက်သော Key များ
const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Start Command
bot.start((ctx) => ctx.reply("မင်္ဂလာပါ။ Bot အောင်မြင်စွာ အလုပ်လုပ်နေပါပြီခင်ဗျာ။"));

// Message Handling
bot.on('text', async (ctx) => {
    try {
        await ctx.sendChatAction('typing');
        const result = await model.generateContent(ctx.message.text);
        const response = await result.response;
        await ctx.reply(response.text());
    } catch (error) {
        console.error(error);
        ctx.reply("ခဏနားပြီးမှ ပြန်မေးပေးပါခင်ဗျာ။");
    }
});

// Render ရဲ့ Web Service ပိတ်မသွားအောင် Port တစ်ခုဖွင့်ထားခြင်း
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Bot is running!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    bot.launch(); // Bot ကို စတင်အသက်သွင်းခြင်း
});

// စနစ်တကျ ရပ်တန့်နိုင်ရန်
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
