import 'dotenv/config';

// create discord js client instance token = env.discordToken

import { Client, GatewayIntentBits, Message } from "discord.js";
import CommandHandler from './handler';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
  ],
});

const commandHandler = new CommandHandler({client});

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("messageCreate", (msg: Message) => {
  if (msg.author.bot) return;
  commandHandler.handleMessage(msg, client);
});

client.on("interactionCreate", (interaction: any) => {
  if (!interaction.isCommand()) return;
  commandHandler.handleMessage(interaction, client);
});

client.login(process.env.discordToken); // token is defined in .env file