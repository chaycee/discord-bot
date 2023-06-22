import { Client, Interaction, Message } from "discord.js";

import commands from "./commands";

export default class {
  client: Client<boolean>;
  commandArray: any[] = [];

  constructor({ client }: { client: Client<boolean> }) {
    this.client = client;

    this.client.on('ready', () => {
      this.loadCommands();
    });
  }

  loadCommands() {
    Object.keys(commands).forEach((key: any, i) => {
      const { command, messageCreateHandler } = commands[key];

      this.commandArray.push(command);

      if (command.options) {
        const guild = this.client.guilds.cache.get(
          process.env.devGuild || "969025712969355275"
        );
        if (!guild) return console.log("No guild found");
        guild.commands.create(command);
      }

      if (messageCreateHandler) {
        this.client.on("messageCreate", (msg) => {
          messageCreateHandler(msg, this.client);
        });
      }
    });
  }

  handleMessage(action: Interaction | Message, client: Client<boolean>) {
    console.log(this.commandArray[1].handler);
    //this.commandArray[1].handler(action, client);
  }
}