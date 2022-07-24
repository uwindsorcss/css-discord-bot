import { logger } from "../logger";
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {
  CommandInteraction,
  CacheType,
  MessageAttachment,
} from "discord.js";
import { CommandType } from "../types";
import { Santinize } from "../helpers/LatexHelpers";

import katex from 'katex';
const nodeHtmlToImage = require('node-html-to-image')


const equationnModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("equationn")
    .setDescription("Say something?")
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName("equationn")
        .setDescription("The equationn you want me to say")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    try {
      let message = interaction.options.getString("equationn")!;
      let cleanedMessage = Santinize(message)

      let outputs: string = katex.renderToString(cleanedMessage, {
        displayMode: true,
        output: 'html'
      }) as string;
      //console.log({ outputs })

      const _htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
      body {
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        background: white;
        width: fit-content;
        color:black;
      }

      .app {
        width: fit-content;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 20px;
        padding: 0 0.5em;
    }
      }

      img {
        margin-right: 20px;
        border-radius: 50%;
        border: 1px solid #fff;
        padding: 5px;
      }
    </style>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous">

  </head>
  <body>
    <div class="app">
      ${outputs.toString()}
    </div>
  </body>
</html>
`
      //console.log({ _htmlTemplate })

      await interaction.deferReply()

      const images = await nodeHtmlToImage({
        html: _htmlTemplate,
        quality: 100,
        type: 'jpeg',
        puppeteerArgs: {
          args: ['--no-sandbox'],
        },
        encoding: 'buffer',
      })
      //console.log({images})
      // const parser = new DOMParser();
      // const document = parser.parseFromString(_htmlTemplate, "text/html");

      //const image = await html2canvas(document.body, { scale: 2 })

      //console.log({image})

      let img = new MessageAttachment(images, `haha.jpeg`)

      // let base64_img = image.toDataURL()
      // const sfbuff = Buffer.from(base64_img.split(",")[1], "base64");
      // const sfattach = new MessageAttachment(sfbuff, "output.png");


      //await interaction.reply({ files: [img], attachments:[sfattach] });
      
      await interaction.editReply({ files: [img] });


    } catch (error) {
      // await interaction.reply({ content:`Sorry, I'm struggling with this error: ${error}` });

      logger.error(`Equation command failed: ${error}`);
    }
  },
};

export { equationnModule as command };
