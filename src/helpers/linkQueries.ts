import Fuse from "fuse.js";
import { Pool } from 'pg';
import { Config } from "../config";
import { logger } from "../logger";

export interface Link {
  id: number,
  shorten_link: string,
  url: string,
}

var localLinks: Link[], pool: Pool;

const ConnectToDB = async () => {
  try {
    pool = new Pool({
      host: Config?.db_host,
      user: Config?.db_user,
      database: Config?.db_name,
      password: Config?.db_password,
      port: Config?.db_port
    });
    await pool.connect();
    await SeedingData()
  } catch (err) {
    logger.debug(err);
  }
};

const SeedingData = async () => {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS links (id bigserial primary key, shorten_link text, url text);')
  } catch (err) {
    logger.debug({ err })
  }
}
const GetAllLinks = async (): Promise<Link[]> => {
  const res = await pool.query('SELECT * FROM links')
  localLinks = res.rows
  return res.rows;
}

const FilterLinkByName = (pattern: string): Link[] => {
  const options = {
    includeScore: true,
    shouldSort: true,
    threshold: 0.4,
    distance: 100,
    keys: ["shorten_link"],
  };
  const fuse = new Fuse<Link>(localLinks, options);
  let filterResult = fuse.search(pattern);
  const links = filterResult.map(({ item }) => item);
  return links;
};

const FindLinkByName = (searchString: string): Link | undefined => {
  let res = localLinks.find(link => link.shorten_link === searchString);
  return res;
}

const CreateNewLink = async (shorten_link: string, url: string): Promise<Link | undefined> => {
  let shortenLinkTrim = shorten_link.trim().replace(/\s\s+/g, ' ')
  let urlTrim = url.trim()
  
  const result = await pool.query<Link>(
    'INSERT INTO links(shorten_link, url) VALUES ($1, $2) RETURNING *',
    [shortenLinkTrim, urlTrim]
  );
  if (result.rows.length === 0) {
    return undefined;
  }
  return result.rows[0]
}

const DeleteLinkById = async (id: string): Promise<Link | undefined> => {
  if (!isNumber(id)) {
    return undefined;
  }
  let parsedId = parseInt(id)
  const result = await pool.query("DELETE FROM links WHERE id = $1 RETURNING *",
    [parsedId])
  if (result.rows.length === 0) {
    return undefined;
  }
  return result.rows[0]
}

const FindLinkById = async (id: string): Promise<Link | undefined> => {
  if (!isNumber(id)) {
    return undefined;
  }
  let parsedId = parseInt(id)
  const result = await pool.query<Link>("SELECT * FROM links WHERE id = $1",
    [parsedId]
  )
  if (result.rows.length === 0) {
    return undefined;
  }
  return result.rows[0]
}

const isNumber = (str: string): boolean => {
  if (str.trim() === '') {
    return false;
  }
  return !Number.isNaN(Number(str));
}

export { ConnectToDB, SeedingData, GetAllLinks, FilterLinkByName, CreateNewLink, FindLinkByName, DeleteLinkById, FindLinkById };
