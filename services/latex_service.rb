class LatexService

=begin
  def self.render(message)
    if message.strip.length == 1 or message.strip == '\\' * message.length
      return false
    end
    # first runs pdflatex on a function called formula
    # then run convert(from imagemagick) to convert to png
    #system("pdflatex -interaction=nonstopmode \"\\def\\formula{ #{message} }\\input{formula.tex}\" >>/dev/null") && system("convert -density 300 formula.pdf -alpha off -quality 90 +profile \"*\" formula.png")
    system("pdflatex \"\\def\\formula{ #{message} }\\input{formula.tex}\" ") and system("convert -density 300 formula.pdf -alpha off -quality 90 +profile \"*\" formula.png")

  end
=end

  def self.render(message, path, file)
    # stripping it so you cant just put in one letter or a string of backslashs
    if message.strip.length == 1 || message.strip == '\\' * message.length
      return false
    end

    # reading the template file
    template = File.read(File.join(path, 'template.tex'))

    File.open(File.join(path, file + '.tex'), 'w'){ |outfile|
      changed = template.gsub('__DATA__', message)
      outfile.puts changed
    }
    true
  end

  # deletes the extra files
  def self.cleanup(path, file)
    # these are the files that are created
    file_endings = ['.aux', '.log', '.pdf', '.png', '.tex']
    file_endings.each{ |fending|
      File.delete(path + file + fending) if File.exist?(path + file + fending)
    }
  end

  # sanitizes the message by putting a backslash in front of some chars
  def self.sanitize(message)
    # each symbol is a different one that could cause problems
    # $ is to enter/exit math mode which would cause compilation problems
    # \\ is obvious
    # " could cause an escape of the latex function
    res_chars = ['$', '\\', '"']
    res_chars.each{ |res|
      message = message.gsub(res, "\\#{res}")
    }
    message
  end

end
