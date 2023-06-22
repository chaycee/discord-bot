import { ApplicationCommandOptionData, Client, Interaction, Message } from 'discord.js';
import * as stats from './stats'
import * as tiktokezcom from './tiktokez.com'
import * as instagramezcom from './instagramez.com'
import * as twitterezcom from './twitterez.com'

export default {
  stats,
  tiktokezcom,
  instagramezcom,
  twitterezcom,
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
