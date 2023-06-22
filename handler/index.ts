import { Client, Interaction, Message } from "discord.js";

import commands from "./commands";

export default class {
  client: Client<boolean>;
  commandArray: any[] = [];

  constructor({ client }: { client: Client<boolean> }) {
    this.client = client;

    this.loadCommands();
  }

  loadCommands() {
    Object.keys(commands).forEach((key: any, i) => {
      this.commandArray.push(commands[key]);
    });
  }

  handleMessage(action: Interaction | Message, client: Client<boolean>) {
    console.log(this.commandArray[1].handler);
    this.commandArray[1].handler(action, client);
  }
}