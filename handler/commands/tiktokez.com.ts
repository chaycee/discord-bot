import {
  Client,
  Interaction,
  Message,
  ApplicationCommandOptionType,
} from "discord.js";

import {
  Command,
  HandlerFunction,
  LogicFunction,
  MessageCreateHandler,
} from "./index";

import extractid from "../../utils/extractId";
import axios from "axios";

export const command: Command = {
  name: "tiktok",
  description: "Says hello to the user",
  options: [
    {
      description: "Tiktok link",
      name: "link",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export const logic: LogicFunction<any, { link: string }> = async (
  { link = "https://www.tiktok.com/@user/video/id" },
  client: Client<boolean>
) => {
  const data: any[] = [];
  data.push(extractid("https://www.tiktok.com/@:user/video/:id", link));
  data.push({ type: "https://m.tiktok.com/v/", ...extractid("https://m.tiktok.com/v/:id", link), });
  data.push({ type: "https://www.tiktok.com/t/", ...extractid("https://www.tiktok.com/t/:id/", link), });

  const found = data.find((d) => d?.id !== undefined);

  if (!found) return "No id found";
  if (found.type) {
    axios.get(found.type + found.id, {
      validateStatus: () => true,
    })
      .then(async (data) => {
        const newLink = data?.request?.res?.responseUrl;
        return await logic({ link: newLink }, client);
      });
  } else {
    console.log('this should not run at teh start')
    console.log(data?.find((d) => d?.id !== undefined)?.id);
    return data?.find((d) => d?.id !== undefined)?.id || "No id found";
  }
};

export const handler: HandlerFunction<boolean> = async (
  interaction: Interaction | Message,
  client: Client<boolean>,
  alwaysReply = true
) => {
  if (interaction instanceof Message) {
    const newLink = await logic({ link: interaction.content }, client);
    if (!newLink) {
      if (alwaysReply) return interaction.reply("Please provide a link");
      else return;
    }

    interaction.reply(newLink);
  } else {
    if (!interaction.isCommand()) return;
    const link = interaction.options.get("link")?.value;
    if (!link || typeof link !== "string")
      return interaction.reply("Please provide a link");

    interaction.reply(await logic({ link }, client));
  }
};

export const messageCreateHandler: MessageCreateHandler = (
  msg: Message,
  client
) => {
  if (msg.author.bot) return;
  handler(msg, client, false);
};
