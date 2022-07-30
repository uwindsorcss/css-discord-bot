import { CacheType, CommandInteraction, MessageAttachment } from "discord.js";
import svg2img, { ResvgRenderOptions } from "svg2img";
var mjAPI = require("mathjax-node");


export const Santinize = (message: string): string => {
    let res_commands = [
        [`\text{`, `\\backslash text~{`],
        ['$', `\\$`],
        ['"', '\\"'],
        ['\\union','\\cup']
    ]

    let cleanedMessage = message
    res_commands.forEach(([searchValue, replaceValue]) => {
        cleanedMessage = cleanedMessage.replace(searchValue, replaceValue)
    })
    return cleanedMessage

}

export const EquationRender = async (cleanedMessage: string, interaction: CommandInteraction<CacheType>) => {
    mjAPI.config({
        MathJax: {
            SVG: {
                // scale: 70,
                //font: "STIX-Web",
            },
        }
    });
    mjAPI.start();

    mjAPI.typeset({
        math: cleanedMessage,
        format: "inline-TeX", // or "Tex", "MathML"
        svg: true, // or html:true
    }, async function (data: any) {
        if (!data.errors) {
            await interaction.deferReply()
            let mySvg = data.svg
            mySvg = mySvg.replace(/"currentColor"/g, '"black"')
            let imgSizeObj: ResvgRenderOptions = {
                dpi: 96,
                background: 'white',
                fitTo: {
                    mode: 'height', // or height
                    value: 200,
                },
            }
            if (cleanedMessage.length > 20) {
                imgSizeObj.fitTo = {
                    mode: 'width',
                    value: 600,
                }
            }
            svg2img(mySvg, {
                resvg: imgSizeObj
            }, async function (error: any, buffer: any) {
                let img = new MessageAttachment(buffer, `name.jpeg`)
                await interaction.editReply({ files: [img] });
            });
        } else {
            await interaction.reply({ content: `Sorry, I'm struggling with this error: ${data.errors}` });
        }
    });

}