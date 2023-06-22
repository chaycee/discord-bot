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

import extractId from "../../utils/extractId";
import axios from "axios";
import embedezCaller from "../../utils/embedezCaller";

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
  data.push(extractId("https://www.tiktok.com/@:user/video/:id", link));
  data.push({
    type: "https://vt.tiktok.com/",
    ...extractId("https://vt.tiktok.com/:id/", link),
  });
  data.push({
    type: "https://vm.tiktok.com/",
    ...extractId("https://vm.tiktok.com/:id/", link),
  });
  data.push({
    type: "https://m.tiktok.com/v/",
    ...extractId("https://m.tiktok.com/v/:id", link),
  });
  data.push({
    type: "https://www.tiktok.com/t/",
    ...extractId("https://www.tiktok.com/t/:id/", link),
  });

  const found = data.find((d) => d?.id !== undefined);
  if (!found) return null;

  if (found.type) {
    const data = await axios.get(found.type + found.id, {
      validateStatus: () => true,
    });
    return await logic({ link: data?.request?.res?.responseUrl }, client);
  } else {
    return data?.find((d) => d?.id !== undefined)?.id || null;
  }
};

export const handler: HandlerFunction<boolean> = async (
  interaction: Interaction | Message,
  client: Client<boolean>,
  alwaysReply = true
) => {
  if (interaction instanceof Message) {
    console.log("making request");

    const res = await logic({ link: interaction.content }, client);

    console.log("made request", res);

    if (!res) {
      if (alwaysReply) return interaction.reply("Please provide a link");
      else return;
    }

    const data = await embedezCaller(res, "tiktok");
    if (typeof data == "string") return interaction.reply({ content: data });
    interaction.reply(data);
  } else {
    if (!interaction.isCommand()) return;
    interaction.deferReply();

    const link = interaction.options.get("link")?.value;
    if (!link || typeof link !== "string")
      return interaction.editReply("Please provide a link");

    const id = await logic({ link: link }, client);
    if (!id) {
      if (alwaysReply) return interaction.editReply("Please provide a link");
      else return;
    }

    const data = await embedezCaller(id, "tiktok");

    interaction.editReply(data);
  }
};

export const messageCreateHandler: MessageCreateHandler = (
  msg: Message,
  client
) => {
  if (msg.author.bot) return;
  handler(msg, client, false);
};
