import {AttachmentBuilder, CacheType, CommandInteraction} from "discord.js";
import svg2img, {ResvgRenderOptions} from "svg2img";
var mjAPI = require("mathjax-node");

export const Santinize = (message: string): string => {
  const res_commands = [
    [`\text{`, `\\backslash text~{`],
    ["$", `\\$`],
    ['"', '\\"'],
    ["\\union", "\\cup"],
  ];

  let cleanedMessage = message;
  res_commands.forEach(([searchValue, replaceValue]) => {
    cleanedMessage = cleanedMessage.replace(searchValue, replaceValue);
  });
  return cleanedMessage;
};
export const initMathJax = async () => {
  mjAPI.start();
};

//return img
// Helper function to convert svg to img buffer
const svgToImgBuffer = (svg: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    // Add padding to the svg by modifying the viewBox
    const padding = 200;

    const equationSVGWithPadding = svg.replace(
      /viewBox\s*=\s*"([^"]*)"/,
      (_: any, viewBox: string) => {
        const [x, y, width, height] = viewBox.split(/\s*,*\s+/).map(Number);
        return `viewBox="${x - padding} ${y - padding} ${width + padding * 2} ${
          height + padding * 2
        }"`;
      }
    );

    const imgSizeObj: ResvgRenderOptions = {
      background: "white",
      fitTo: {
        mode: "zoom",
        value: 2.5,
      },
    };

    svg2img(
      equationSVGWithPadding,
      {
        resvg: imgSizeObj,
      },
      (error: string, buffer: Buffer) => {
        if (error) {
          reject(error);
        } else {
          resolve(buffer);
        }
      }
    );
  });
};

export const EquationRender = async (
  cleanedMessage: string,
  interaction: CommandInteraction<CacheType>
): Promise<AttachmentBuilder> => {
  return new Promise(async (resolve, reject) => {
    mjAPI.typeset(
      {
        math: cleanedMessage,
        format: "inline-TeX",
        svg: true,
      },
      async function (data: any) {
        if (!data.errors) {
          await interaction.deferReply();
          const equationSVG = data.svg.replace(/"currentColor"/g, '"black"');

          try {
            const buffer = await svgToImgBuffer(equationSVG);
            const attachment = new AttachmentBuilder(buffer, {
              name: `equation-${
                interaction.member?.user.username
              }-${Date.now()}.jpg`,
            });
            resolve(attachment);
          } catch (error) {
            reject(error);
          }
        } else {
          await interaction.reply({
            content: `Sorry, I'm struggling with this error: ${data.errors}`,
          });
          reject(new Error(`Error: ${data.errors}`));
        }
      }
    );
  });
};
