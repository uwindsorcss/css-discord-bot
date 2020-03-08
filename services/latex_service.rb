class LatexService

  def self.render(message)
    if message.strip.length == 1 or message.strip == '\\' * message.length
      return false
    end
    # first runs pdflatex on a function called formula
    # then run convert(from imagemagick) to convert to png
    #system("pdflatex -interaction=nonstopmode \"\\def\\formula{ #{message} }\\input{formula.tex}\" >>/dev/null") && system("convert -density 300 formula.pdf -alpha off -quality 90 +profile \"*\" formula.png")
    system("pdflatex \"\\def\\formula{ #{message} }\\input{formula.tex}\" ") and system("convert -density 300 formula.pdf -alpha off -quality 90 +profile \"*\" formula.png")

  end

  def self.cleanup()
    
  end

  def self.sanitize(message)
    resChars = ['$','\\', '"']
    resChars.each{ |res|
      message.gsub!(res, "\\#{res}")
    }
    message
  end

end
