import {buildings} from "../config";
import Fuse from "fuse.js";

export const fuseOptions = {
  shouldSort: true,
  threshold: 0.1,
  distance: 100,
  isCaseSensitive: false,
  keys: ["name"],
};

export const FindBuildingByCode = (buildingCode: string): string => {
  for (let i = 0; i < buildings.length; i++) {
    if (buildings[i].code === buildingCode) return buildings[i].name;
  }
  return "";
};

export const ListAllBuildings = (): {codes: string; names: string} => {
  let codes: string = "",
    names: string = "";
  for (let i = 0; i < buildings.length; i++) {
    codes += `${buildings[i].code}\n`;
    names += `${buildings[i].name}\n`;
  }

  return {
    codes,
    names,
  };
};

export const FindBuildingByName = (pattern: string) => {
  const fuse = new Fuse(buildings, fuseOptions);

  let res = fuse.search(pattern);

  return res;
};
