import { Client, Interaction, Message } from 'discord.js';
import * as hello from './hello'
import * as tiktokezcom from './tiktokez.com'

export default {
  hello,
  tiktokezcom,
} as {
  [key: string]: {
    command: Command;
    logic: LogicFunction<any, any>;
    handler: HandlerFunction;
  };
}

export interface Command {
  name: string;
  description: string;
}

export type LogicFunction<Response, Options> = (
  options: Options,
  client: Client<boolean>
) => Response;

export type HandlerFunction = (
  interaction: Interaction | Message,
  client: Client<boolean>
) => void;