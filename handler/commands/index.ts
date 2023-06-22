import { ApplicationCommandOptionData, Client, Interaction, Message } from 'discord.js';
import * as stats from './stats'
import * as tiktok from './tiktok'
import * as instagram from "./instagram";
import * as twitter from "./twitter";

export default {
  stats,
  tiktok,
  instagram,
  twitter,
} as {
  [key: string]: {
    command: Command;
    logic: LogicFunction<any, any>;
    handler: HandlerFunction;
    messageCreateHandler?: MessageCreateHandler;
  };
};

export interface Command {
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
}

export type LogicFunction<Response, Options> = (
  options: Options,
  client: Client<boolean>
) => Response;

export type HandlerFunction<settings = any> = (
  interaction: Interaction | Message,
  client: Client<boolean>,
  settings?: settings
) => void;

export type MessageCreateHandler = {
  (msg: Message, client: Client<boolean>): void;
};
