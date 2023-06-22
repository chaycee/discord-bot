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

import extractId from "@/utils/extractId";
import embedezCaller from "@/utils/embedezCaller";

export const command: Command = {
  name: "instagram",
  description: "returns proper link to instagram post",
  options: [
    {
      description: "instagram link",
      name: "link",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export const logic: LogicFunction<any, { link: string }> = async (
  { link = "https://www.instagram.com/p/:id/" },
  client: Client<boolean>
) => {
  const data: any[] = [];
  data.push(extractId("https://www.instagram.com/p/:id/", link));
  data.push(extractId("https://www.instagram.com/reel/:id/", link));
  data.push(extractId("https://www.instagram.com/reels/:id/", link));

  const found = data.find((d) => d?.id !== undefined);
  if (!found) return null;

   return data?.find((d) => d?.id !== undefined)?.id || null;
};

export const handler: HandlerFunction<boolean> = async (
  interaction: Interaction | Message,
  client: Client<boolean>,
  alwaysReply = true
) => {
  if (interaction instanceof Message) {
    const res = await logic({ link: interaction.content }, client);

    if (!res) {
      if (alwaysReply) return interaction.reply("Please provide a link");
      else return;
    }

    const data = await embedezCaller(res, "instagram");
    if (typeof data == 'string') return interaction.reply({ content: data });
    interaction.reply(data);
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
