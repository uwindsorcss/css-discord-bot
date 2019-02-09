class BuildingService
  $buildings = {
    "AC" => "Assumption Chapel",
    "BB" => "Biology Building",
    "CE" => "Centre for Engineering Innovation",
    "CEI" => "Centre for Engineering Innovation",
    "CH" => "Cartier Hall",
    "CN" => "Chrysler Hall North",
    "CS" => "Chrysler Hall South",
    "DB" => "Drama Building",
    "DH" => "Dillon Hall",
    "ED" => "Neal Education Building",
    "EH" => "Essex Hall",
    "ER" => "Erie Hall",
    "JC" => "Jackman Dramatic Art Centre",
    "LB" => "Ianni Law Building",
    "LL" => "Leddy Library",
    "LT" => "Lambton Tower",
    "MB" => "O'Neil Medical Education Centre",
    "MC" => "Macdonald Hall",
    "MH" => "Memorial Hall",
    "MU" => "Music Building",
    "OB" => "Odette Building",
    "TC" => "Toldo Health Education Centre",
    "UC" => "C.A.W. Student Centre",
    "VH" => "Vanier Hall",
    "WC" => "Welcome Centre",
    "WL" => "West Library"
  }

  def self.find_building(building)
    building = building.upcase
    return building if $buildings[building]

    best_match = nil
    best_comparison_score = 0.0
    $buildings.values.each do |stored_building|
      score = compareStrings(stored_building.upcase, building)
      if score > best_comparison_score && score > 0.70
        best_match = stored_building
        best_comparison_score = score
      end
    end
    $buildings.key(best_match)
  end

  def self.get_building_name(building_code)
    $buildings[building_code]
  end

  def self.gather_building_list
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

  private

  def self.compareStrings(str1, str2)
    jaro = FuzzyStringMatch::JaroWinkler.create(:native)
    jaro.getDistance(str1, str2)
  end
end
