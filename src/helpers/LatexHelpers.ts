export const Santinize = (message: string): string => {
    let cleanedMessage = message
    let res_commands = [
        [`\\text{`, `\\backslash text~{`],
        ['$', `\\$`],
        ['"', '\\"']
    ]

    let regex = /\\\\/g;
    let result = cleanedMessage.replace(regex, "\\");
    res_commands.forEach(([res, replace]) => {
        result = result.replace(res, replace)
    })
    return cleanedMessage

}

import katex from 'katex';
import * as htmlToImage from 'html-to-image';

export const EquationRender = (message: string) => {
    
}
