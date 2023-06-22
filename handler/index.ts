import { Client, Interaction, Message } from "discord.js";

import commands from "./commands";

export default class {
  client: Client<boolean>;
  commandArray: any[] = [];

  constructor({ client }: { client: Client<boolean> }) {
    this.client = client;

    this.client.on("ready", () => {
      this.loadCommands();
    });

    this.watch()
  }

  loadCommands() {
    Object.keys(commands).forEach((key: any, i) => {
      const { command, messageCreateHandler } = commands[key];

      this.commandArray.push(command);

      if (messageCreateHandler) {
        if (!process.env.production) {
          this.client.on("messageCreate", (msg) => {
            messageCreateHandler(msg, this.client);
          });
        }
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

  watch() {
    this.client.on("messageCreate", (msg: Message) => {
      if (msg.author.bot) return;
      
      const regex = /tiktok|instagram|twitter/g // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const check = msg.content.match(regex)

      if (check) {
        Object.keys(commands).forEach((key: any, i) => {
          const { messageCreateHandler } = commands[key];
          if (messageCreateHandler) 
            messageCreateHandler(msg, this.client);
        });
      }
    })
  }

  handleMessage(action: Interaction | Message, client: Client<boolean>) {
    if ('isCommand' in action)
    if (action.isCommand()) {
      console.log(action.commandName, commands[action.commandName]);
      const command = commands[action.commandName];
      if (!command) return;
      command.handler(action, client);
    }
  }
}
