import {buildingType} from "@/types";
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

export const buildings: buildingType[] = [
  {
    code: "AC",
    name: "Assumption Chapel",
  },
  {
    code: "BB",
    name: "Biology Building",
  },
  {
    code: "CE",
    name: "Centre for Engineering Innovation",
  },
  {
    code: "CEI",
    name: "Centre for Engineering Innovation",
  },
  {
    code: "CH",
    name: "Cartier Hall",
  },
  {
    code: "CN",
    name: "Chrysler Hall North",
  },
  {
    code: "CS",
    name: "Chrysler Hall South",
  },
  {
    code: "DB",
    name: "Drama Building",
  },
  {
    code: "DH",
    name: "Dillon Hall",
  },
  {
    code: "ED",
    name: "Neal Education Building",
  },
  {
    code: "EH",
    name: "Essex Hall",
  },
  {
    code: "ER",
    name: "Erie Hall",
  },
  {
    code: "JC",
    name: "Jackman Dramatic Art Centre",
  },
  {
    code: "LB",
    name: "Ianni Law Building",
  },
  {
    code: "LL",
    name: "Leddy Library",
  },
  {
    code: "LT",
    name: "Lambton Tower",
  },
  {
    code: "MB",
    name: "O'Neil Medical Education Centre",
  },
  {
    code: "MC",
    name: "Macdonald Hall",
  },
  {
    code: "MH",
    name: "Memorial Hall",
  },
  {
    code: "MU",
    name: "Music Building",
  },
  {
    code: "OB",
    name: "Odette Building",
  },
  {
    code: "PA",
    name: "Parking Around Campus",
  },
  {
    code: "TC",
    name: "Toldo Health Education Centre",
  },
  {
    code: "UC",
    name: "C.A.W. Student Centre",
  },
  {
    code: "VH",
    name: "Vanier Hall",
  },
  {
    code: "WC",
    name: "Welcome Centre",
  },
  {
    code: "WL",
    name: "West Library",
  },
];
