import Fuse from "fuse.js";
import {Pool} from "pg";
import {Config, logger} from "@/config";

export interface Link {
  shorten_link: string;
  url: string;
}

var localLinks: Link[], pool: Pool;

const ConnectToDB = async () => {
  try {
    pool = new Pool({
      host: Config?.db_host,
      user: Config?.db_user,
      database: Config?.db_name,
      password: Config?.db_password,
      port: Config?.db_port,
    });
    await pool.connect();
    await SeedingData();
  } catch (err) {
    logger.debug(err);
  }
};

const SeedingData = async () => {
  try {
    await pool.query(
      "CREATE TABLE IF NOT EXISTS links (shorten_link text primary key, url text);"
    );
  } catch (err) {
    logger.fatal({err});
  }
};
const GetAllLinks = async (): Promise<Link[]> => {
  const res = await pool.query("SELECT * FROM links");
  localLinks = res.rows;
  return res.rows;
};

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
  const links = filterResult.map(({item}) => item);
  return links;
};

const FindLinkByName = (searchString: string): Link | undefined => {
  let res = localLinks.find((link) => link.shorten_link === searchString);
  return res;
};

const CreateNewLink = async (
  shorten_link: string,
  url: string
): Promise<Link | undefined> => {
  let shortenLinkTrim = shorten_link.trim().replace(/\s\s+/g, " ");
  let urlTrim = url.trim();
  const linkExistsQuery = await pool.query(
    "SELECT exists(SELECT 1 FROM links where shorten_link=$1)",
    [shortenLinkTrim]
  );
  let linkExistsValue = linkExistsQuery.rows[0].exists;
  let result;

  if (linkExistsValue) {
    //update
    result = await pool.query<Link>(
      "UPDATE links SET url = $1 WHERE shorten_link = $2 RETURNING *",
      [urlTrim, shortenLinkTrim]
    );
  } else {
    //create
    result = await pool.query<Link>(
      "INSERT INTO links(shorten_link, url) VALUES ($1, $2) RETURNING *",
      [shortenLinkTrim, urlTrim]
    );
  }
  if (result.rows.length === 0) {
    return undefined;
  }
  return result.rows[0];
};

const DeleteLinkByName = async (
  shorten_link: string
): Promise<Link | undefined> => {
  const result = await pool.query(
    "DELETE FROM links WHERE shorten_link = $1 RETURNING *",
    [shorten_link]
  );
  if (result.rows.length === 0) {
    return undefined;
  }
  return result.rows[0];
};

export {
  ConnectToDB,
  SeedingData,
  GetAllLinks,
  FilterLinkByName,
  CreateNewLink,
  DeleteLinkByName,
  FindLinkByName,
};
