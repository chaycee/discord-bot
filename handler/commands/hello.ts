import { Client, Interaction, Message } from "discord.js";

import { Command, HandlerFunction, LogicFunction } from "./index";

export const command: Command = {
  name: "hello",
  description: "Says hello to the user",
};

export const logic: LogicFunction<string, { user: string}> = ({ user = "unknown" }, client: Client<boolean>) => {
  return `Hello ${user}!`;
};

export const handler: HandlerFunction = (
  interaction: Interaction | Message,
  client: Client<boolean>
) => {
  if (interaction instanceof Message) {
    interaction.channel.send(
      logic({ user: interaction.author.username }, client)
    );
  }
};