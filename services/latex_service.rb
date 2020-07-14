require 'mathematical'
require 'mini_magick'

class LatexService

  def self.render?(message, path, file)
    # stripping it so you cant just put in one letter or a string of backslashs
    return false if message.strip.length == 1 || message.strip == '\\' * message.length

    # return a png
    # pixels per inch is 300
    tex2dirty = Mathematical.new(format: :png, ppi: 300.0)

    # renders the image but it needs to be cleaned
    dirtyFile = tex2dirty.render("$#{message}$")

    return false unless dirtyFile[:exception].nil?

    # puts that image into mini_magick to be cleaned
    cleanFile = MiniMagick::Image.read(dirtyFile[:data])

    # get rid of alpha channel
    cleanFile.flatten
    # add padding of 10 px of white pixels
    cleanFile.combine_options do |img|
      img.border 10
      img.bordercolor 'white'
    end
    # add a black border around the image
    cleanFile.combine_options do |img|
      img.border 3
      img.bordercolor 'black'
    end
    # write img
    cleanFile.write File.join(path, file)

    true
  end

  # renders the message
  # deletes the extra files
  def self.cleanup(path, file)
    # these are the files that are created
    File.delete(File.join(path, file)) if File.exist? (File.join(path, file))
    # have to return nil or something will be send as a message
    nil
  end

  # sanitizes the message by putting a backslash in front of some chars
  def self.sanitize(message)
    # these are restricted commands
    # commands need to end with a { or it will match all commands that start with it
    # \text because it can let people put text in math mode and bog down it system
    # \text is replaced with \backslash text
    # $ is to enter/exit math mode which would cause compilation problems
    # \\ is replaced with \ to make latex rendering work
    # " could cause an escape of the latex function
    res_commands = [
      ['\\text{', '\\backslash text~{'],
      ['\\\\', '\\'],
      ['$', '\\$'],
      ['"', '\\"']
    ]

    res_commands.each do |res, replace|
      message = message.gsub(res, replace)
    end

    message
  end
end
