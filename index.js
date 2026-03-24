require('dotenv').config(); // 'r' အသေးဖြစ်ရပါမယ်
const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Heaven_number_three_clone bot is active!\n');
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on ${port}`));

const bot = new Telegraf(process.env.BOT_TOKEN);
// Key နာမည်ကို GEMINI_API_KEY လို့ပဲ အတည်ပြုလိုက်မယ်နော်
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

bot.start((ctx) => ctx.reply("မင်္ဂလာပါ။ Heaven_number_three_clone bot မှ ကြိုဆိုပါတယ်။"));

bot.on('text', async (ctx) => {
    try {
        await ctx.sendChatAction('typing');
        const result = await model.generateContent(ctx.message.text);
        const response = await result.response;
        await ctx.reply(response.text(), { parse_mode: 'Markdown' });
    } catch (e) {
        console.error(e);
        ctx.reply("ခဏနားပြီးမှ ပြန်မေးပေးပါခင်ဗျာ။");
    }
});

// စနစ်တကျ Launch လုပ်ခြင်း
bot.launch().then(() => {
    console.log('>> Heaven_number_three_clone bot is Started! <<');
});

// လုံခြုံစွာ ရပ်တန့်နိုင်ရန် (Render အတွက် အရေးကြီးသည်)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
