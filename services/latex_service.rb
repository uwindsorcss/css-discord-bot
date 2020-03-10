class LatexService

  # renders the message
  def self.render?(message, path, file)
    # stripping it so you cant just put in one letter or a string of backslashs
<<<<<<< HEAD
    return false if message.strip.length == 1 || message.strip == '\\' * message.length
=======
   return false if message.strip.length == 1 || message.strip == '\\' * message.length
>>>>>>> 9861d06aaad795c8bde63e4d6c0a0ecb23f17c9b

    write2file(message, path, file)

    # latex in nonstopmode so if error it just quits
    # put output into /dev/null gets rid of output
    did_comp = system("latex -interaction=nonstopmode -output-directory=#{path} #{File.join(path, file)}.tex >>/dev/null")

    # changes the .dvi to .png 
    # -q* makes it quiet
    # -D is resolution or "density" 
    # -T is image size
    # -o is output file
    if did_comp
      system("convert -density 300 -flatten #{File.join(path, file)}.dvi #{File.join(path, file)}.png >>/dev/null")
    else
      return false
    end
  end

  # writes the message to the file
  def self.write2file(message, path, file)
    # reading the template file
    template = File.read(File.join(path, 'template.tex'))

    # changing the file template and writing it to a new file
    File.open(File.join(path, file + '.tex'), 'w') { |outfile|
      outfile.puts template.gsub('__DATA__', message)
    }
  end

  # deletes the extra files
  def self.cleanup(path, file)
    # these are the files that are created
    file_endings = ['.aux', '.log', '.dvi', '.png', '.tex']
    file_endings.each do |fending|
<<<<<<< HEAD
      File.delete(File.join(path, file + fending)) if File.exist?(File.join(path, file + fending))
    end 
=======
        File.delete(File.join(path, file + fending)) if File.exist? (File.join(path, file + fending))
    end
>>>>>>> 9861d06aaad795c8bde63e4d6c0a0ecb23f17c9b
    #have to return nil or something will be send as a message
    nil
  end

  # sanitizes the message by putting a backslash in front of some chars
  def self.sanitize(message)
    # each symbol is a different one that could cause problems
    # $ is to enter/exit math mode which would cause compilation problems
    # \\ is obvious
    # " could cause an escape of the latex function
    res_chars = ['$', '\\', '"']
    res_chars.each do |res|
      message = message.gsub(res, "\\#{res}")
    end
    message
  end
end
