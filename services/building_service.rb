class BuildingService
  $buildings = {
    "AC" => "Assumption Chapel",
    "AR" => "Centre for Automotive Research",
    "BB" => "Biology Building",
    "CC" => "Canterbury College",
    "CE" => "Centre for Engineering Innovation",
    "CN" => "Chrysler Hall North",
    "CS" => "Chrysler Hall South",
    "DB" => "Drama Building",
    "DH" => "Dillon Hall",
    "ED" => "Neal Education Building",
    "ER" => "Erie Hall",
    "HK" => "HK Building",
    "JC" => "Jackman Dramatic Art Centre",
    "LB" => "Ianni Law Building",
    "LE" => "Lebel Building",
    "LL" => "Leddy Library",
    "LT" => "Lambton Tower",
    "MB" => "O'Neil Medical Education Centre",
    "MH" => "Memorial Hall",
    "MU" => "Music Building",
    "OB" => "Odette Building",
    "SD" => "St. Denis Center",
    "TC" => "Toldo Health Education Centre",
    "UC" => "C.A.W. Student Centre",
    "WL" => "West Library"
  }

  def getBuilding(building)
    #run service to match string to code?
    return $buildings[building]
  end

  def gatherBuildingList
    codes, full_names = "", ""
    $buildings.each do |code, full_name|
      codes += "#{code}\n"
      full_names += "#{full_name}\n"
    end
    {
      codes: codes,
      full_names: full_names,
    }
  end
end
