import { Link, linkModel } from "../schemas/link"
import Fuse from "fuse.js";

var localLinks: Link[];

const GetAllLinks = async (): Promise<Link[]> => {
    let allLinks: Link[] = await linkModel.find()
    localLinks = allLinks
    return allLinks;
}

const FilterLinkByName = (pattern: string): Link[] => {
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

const FindLinkByName = (searchString: string): Link | undefined => {
    let res = localLinks.find(link => link.name === searchString);
    return res;
}
const CreateNewLink = async (shorten_link: string, url: string) => {
    let shortenLinkTrim = shorten_link.trim().replace(/\s\s+/g, ' ')
    let urlTrim = url.trim()
    if (shortenLinkTrim && shortenLinkTrim?.length > 0 && urlTrim && urlTrim?.length > 0) {
        await linkModel.create({
            name: shortenLinkTrim,
            url: urlTrim
        })
        await GetAllLinks()
    }
}

export { GetAllLinks, FilterLinkByName, CreateNewLink, FindLinkByName };
