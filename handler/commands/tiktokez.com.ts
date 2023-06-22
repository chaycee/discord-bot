import { Client, Interaction, Message } from "discord.js";

import { Command, HandlerFunction, LogicFunction } from "./index";

import extractid from '../../utils/extractId'

export const command: Command = {
  name: "convertTiktok",
  description: "Says hello to the user",
  
};

export const logic: LogicFunction<any, { link: string }> = (
  { link = "https://www.tiktok.com/@user/video/id" },
  client: Client<boolean>
) => {
  const data = extractid("https://www.tiktok.com/@:user/video/:id", link);
  
  console.log(data);
  return JSON.stringify(data, null, 2);
};

export const handler: HandlerFunction = (
  interaction: Interaction | Message,
  client: Client<boolean>
) => {
  if (interaction instanceof Message) {
    interaction.channel.send(
      logic({ link: interaction.content }, client)
    );
  } else {
    if (!interaction.isCommand()) return;

    const link = interaction.options.get('link')?.value;
    if (!link || typeof link !== 'string') return interaction.reply("Please provide a link");

    interaction.reply(
      logic({ link }, client)
    );
  }
};

export const messageCreateHandler = (msg: Message, client) => {
  if (msg.author.bot) return;
  handler(msg, client);
}