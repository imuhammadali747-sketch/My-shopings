require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files

// Nodemailer transporter
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// Contact form handler
app.post('/contact', async (req, res) => {
    const { name, phone, message } = req.body;

    try {
        // Faqat database ga saqlaymiz yoki logga yozamiz
        console.log('Yangi xabar qabul qilindi:');
        console.log(`Ism: ${name}, Telefon: ${phone}, Xabar: ${message}`);

        // (Optional) Email yubor - agar .env to'ldirgan bo'lsangiz
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: 'info@qurilish.uz',
                    subject: 'Yangi kontakt xabari',
                    text: `Ism: ${name}\nTelefon: ${phone}\nXabar: ${message}`
                };
                await transporter.sendMail(mailOptions);
                console.log('Email sent');
            } catch (emailError) {
                console.log('Email yuborilmadi (toldirmang)');
            }
        }

        // (Optional) Telegram - agar .env to'ldirgan bo'lsangiz
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
            try {
                const telegramMessage = `Yangi xabar:\nIsm: ${name}\nTelefon: ${phone}\nXabar: ${message}`;
                await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, telegramMessage);
                console.log('Telegram sent');
            } catch (telegramError) {
                console.log('Telegram yuborilmadi (toldirmang)');
            }
        }

        res.json({ success: true, message: 'Xabar qabul qilindi!' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Xatolik yuz berdi.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishlamoqda`);
});