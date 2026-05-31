const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const API_URL = 'http://localhost:3001/api/webhooks/whatsapp';

console.log('Initializing WhatsApp Client...');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('\n--- SCAN THIS QR CODE WITH WA ---');
    qrcode.generate(qr, { small: true });
    console.log('---------------------------------');
});

client.on('ready', () => {
    console.log('✅ Client is ready! The bot is now securely connected to WhatsApp.');
});

client.on('message', async msg => {
    const chat = await msg.getChat();
    
    // Only process group messages for scraping
    const isGroup = chat.isGroup;
    const groupName = isGroup ? chat.name : "Direct Message";

    console.log(`\n📬 [New Message Received]`);
    console.log(`From: ${msg.from} (${groupName})`);
    console.log(`Body: ${msg.body}`);

    // Forward to Sierra Blu API
    try {
        await axios.post(API_URL, {
            from: msg.from,
            Body: msg.body,
            groupName: groupName,
            timestamp: msg.timestamp
        });
        console.log('🚀 Forwarded to Sierra Blu Intelligence Engine');
    } catch (error) {
        console.error('❌ Failed to forward message:', error.message);
    }

    if (msg.body === '!status') {
        msg.reply('🤖 Sierra Blu Intelligence Bot: Online & Syncing.');
    }
});

client.initialize();
