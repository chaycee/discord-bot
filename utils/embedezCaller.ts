import { ezResponse } from "@/@types";
import axios from "axios";
import { APIEmbed } from "discord.js";

export default async (id: number, type:string) => {
  const ez = await axios.get<ezResponse>(
    `https://tiktokez.com/api/info/${id}?type=${type}`,
    { validateStatus: () => true }
  );

  if ("reason" in ez.data || !ez.data)
    return (ez.data.reason || "Something went wrong");
  if (ez.data.incorrectId)
    return ("This post might be random/private/removed");
  // check if the response is only photos if so send them as embeds, if they are video send them as https://tiktokez.com/embed/:id?type=${type}

  const isPhoto = ez.data.content.media.every((m) => m.type === "photo");

  const embeds: APIEmbed[] = [];
  const hasVideo = ez.data.content.media.some((m) => m.type === "video");

  // embed multiple photos
  for (const media of ez.data.content.media) {
    embeds.push(
      (() => {
        if (media.type === "photo")
          return {
            url: `https://tiktokez.com/embed/${id}?type=${type}`,
            image: { url: media.url },
          };
        else return {};
      })()
    );
  }

  embeds[0] = {
    url: `https://tiktokez.com/embed/${id}?type=${type}`,
    title: `${ez.data.user.displayName} (@${ez.data.user.name})`,
    ...embeds[0],
  };

  if (embeds.length > 10)
    embeds[0].description = `Too many photos to show go to https://tiktokez.com/embed/${id}?type=${type} to see them all`;

  return (() => {
      if (isPhoto) return { embeds: embeds.splice(0, 10) };
      else if (hasVideo)
        return {
          content: `https://tiktokez.com/embed/${id}?type=${type}`,
        };
      else
        return {
          content: "Something went wrong",
        };
  })()

}