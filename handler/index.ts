import { Client, Interaction, Message } from "discord.js";

import commands from "./commands";

export default class {
  client: Client<boolean>;
  commandArray: any[] = [];

  constructor({ client }: { client: Client<boolean> }) {
    this.client = client;

    this.client.on("ready", () => {
      this.loadCommands();
      this.watchnew()
    });
  }

  loadCommands() {
    Object.keys(commands).forEach((key: any, i) => {
      const { command, messageCreateHandler } = commands[key];

      this.commandArray.push(command);

      if (messageCreateHandler) {
        this.client.on("messageCreate", (msg) => {
          messageCreateHandler(msg, this.client);
        });
      }
    });
    if (process.env.production) {
      // set the commands for the production bot
      this.client.application?.commands.set(this.commandArray);
    } else {
      const guild = this.client.guilds.cache.get(
        process.env.devGuild || "969025712969355275"
      );
      if (!guild) return console.log("No guild found");
      guild.commands.set(this.commandArray);
    }
  }

  watchnew() {
    // if the bot joins a new guild create a messageCreate handler for it
    this.client.on("guildCreate", (guild) => {
      console.log("Joined a new guild: " + guild.name);
      this.commandArray.forEach((command) => {
        if (command.messageCreateHandler) {
          guild.client.on("messageCreate", (msg) => {
            command.messageCreateHandler(msg, this.client);
          });
        }
      });
    });

    this.client.on("guildDelete", (guild) => {
      console.log("Left a guild: " + guild.name);
    });
  }

  handleMessage(action: Interaction | Message, client: Client<boolean>) {
    if ('isCommand' in action)
    if (action.isCommand()) {
      console.log(action.commandName, commands[action.commandName]);
      const command = this.commandArray.find((c) => c.command.name === action.commandName);
      if (!command) return;
      command.handler(action, client);
    }
  }
}
