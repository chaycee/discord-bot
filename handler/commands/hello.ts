import { Client, Interaction, Message } from "discord.js";

import { Command, HandlerFunction, LogicFunction } from "./index";

export const command: Command = {
  name: "stats",
  description: "simple stats",
};

export const logic = () => {
  return `https://tiktokez.com/api/landingImage?time=${new Date().getTime()}`;
};

export const handler: HandlerFunction = (
  interaction: Interaction | Message
) => {
  if (interaction instanceof Message) {
    interaction.channel.send(logic());
  }
};