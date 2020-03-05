class LatexService

  def self.render(message)
  system("pdflatex \"\\def\\formula{ #{message} }\\input{formula.tex}\" ") && system("convert -density 300 formula.pdf -alpha off -quality 90 +profile \"*\" formula.png")
  end

  def self.cleanup()
  end

  def self.sanitize(message)

  end

end
