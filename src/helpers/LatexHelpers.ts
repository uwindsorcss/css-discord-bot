import { AttachmentBuilder, CacheType, CommandInteraction } from "discord.js";
import { Resvg } from "@resvg/resvg-js";
import mjAPI from "mathjax-node";

// Sanitize function optimized using a single regex replace
export const Sanitize = (message: string): string => {
  const resCommands: [RegExp, string][] = [
    [/\text{/g, `\\backslash text~{`],
    [/\$/g, `\\$`],
    [/"/g, '\\"'],
    [/\\union/g, "\\cup"],
  ];

  return resCommands.reduce(
    (acc, [searchValue, replaceValue]) => acc.replace(searchValue, replaceValue),
    message
  );
};

// Initialize MathJax only once globally
mjAPI.config({ MathJax: { SVG: { font: "TeX" } } });
mjAPI.start();

// Helper function to convert svg to img buffer using resvg-js
const svgToImgBuffer = async (svg: string): Promise<Buffer> => {
  try {
    const padding = 200;
    const equationSVGWithPadding = svg.replace(
      /viewBox\s*=\s*"([^"]*)"/,
      (_: any, viewBox: string) => {
        const [x, y, width, height] = viewBox.split(/\s*,*\s+/).map(Number);
        return `viewBox="${x - padding} ${y - padding} ${width + padding * 2} ${height + padding * 2}"`;
      }
    );

    const resvg = new Resvg(equationSVGWithPadding, {
      background: "white",
      fitTo: { mode: "zoom", value: 2.5 },
    });

    return resvg.render().asPng();
  } catch (error) {
    throw new Error(`Error in svgToImgBuffer: ${error}`);
  }
};

export const EquationRender = async (
  cleanedMessage: string,
  interaction: CommandInteraction<CacheType>
): Promise<AttachmentBuilder> => {
  try {
    await interaction.reply({ content: "Generating equation..." });

    return new Promise((resolve, reject) => {
      mjAPI.typeset(
        { math: cleanedMessage, format: "inline-TeX", svg: true },
        async (data: any) => {
          if (data.errors) {
            await interaction.editReply({
              content: `Sorry, there was an error: ${data.errors}`,
            });
            return reject(new Error(`MathJax Error: ${data.errors}`));
          }

          try {
            const equationSVG = data.svg.replace(/"currentColor"/g, '"black"');
            const buffer = await svgToImgBuffer(equationSVG);
            const attachment = new AttachmentBuilder(buffer, {
              name: `equation-${interaction.user?.username}-${Date.now()}.png`,
            });

            await interaction.editReply({ content: "", files: [attachment] });
            resolve(attachment);
          } catch (error) {
            await interaction.editReply({
              content: `Error generating image: ${(error as Error).message}`,
            });
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    throw new Error(`EquationRender error: ${(error as Error).message}`);
  }
};
