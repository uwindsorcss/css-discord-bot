import { Link, linkModel } from "../schemas/link"
import Fuse from "fuse.js";
import { SelectMenuInteraction } from "discord.js";
import { Types } from "mongoose";

var localLinks: Link[];

export const GetAllShortenLinks = async (): Promise<Link[]> => {
    let allLinks: Link[] = await linkModel.find()
    //fs.writeFileSync(path.resolve(__dirname, "./links.json"), JSON.stringify(allLinks));
    initLocalLinks(allLinks)
    return allLinks;
}

const initLocalLinks = (allLinks: Link[]) => {
    localLinks = allLinks
}


export const FindLinkByName = (pattern: string): Link[] => {
    const options = {
        includeScore: true,
        shouldSort: true,
        threshold: 0.4,
        distance: 100,
        keys: ["name"],
    };

    const fuse = new Fuse<Link>(localLinks, options);

    let filterResult = fuse.search(pattern);

    const links = filterResult.map(({ item }) => item);

    return links;
};


export const CreateNewLink = async (shorten_link: string, url: string) => {
    let shortenLinkTrim = shorten_link.trim().replace(/\s\s+/g, ' ')

    let urlTrim = url.trim()

    if (shortenLinkTrim && shortenLinkTrim?.length > 0 && urlTrim && urlTrim?.length > 0) {
        await linkModel.create({
            name: shortenLinkTrim,
            url: urlTrim
        })

        await GetAllShortenLinks()
    }

}

export const HandleSelectMenu = async (interaction: SelectMenuInteraction) => {
    if (interaction.customId === 'delete-confirmation') {
        let answer = interaction.values[0]
        if (answer == "No") {
            await interaction.reply("Uhhhhh =='")
        } else {
            await linkModel.deleteOne({ _id: new Types.ObjectId(answer) })
            await interaction.reply("Deleted! No need to thank me!")
        }
    }
}