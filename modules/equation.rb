require 'discordrb'

require_relative '../config'

require_relative '../services/latex_service'

module Equation
  extend Discordrb::Commands::CommandContainer

  command(:equation) do |event|
    file_name = "formula#{event.user.id}#{event.message.timestamp.to_i}.png"
    begin

      # Combine every word after 'latex' for multi word arguments (eg \frac{23 a}{32} )
      args = event.message.content.split(' ').drop(1).join(' ')

      # Clean for escaped latex characters
      clean_args = LatexService.sanitize(args)

      # if it renders properly then send the image
      # else return error
      if LatexService.render?(clean_args, Config::LATEX_DIRECTORY_RELATIVE_PATH, file_name)
        event.send_file(File.open(File.join('./', Config::LATEX_DIRECTORY_RELATIVE_PATH, file_name), 'r'))
      else
        ReturnError.return_error(event.channel, 'Formula Didnt Compile')
      end
    rescue Exception => e
      puts e.message
      puts e.backtrace.inspect
    ensure
      # cleans file even if error
      # delete the files created
      LatexService.cleanup(Config::LATEX_DIRECTORY_RELATIVE_PATH, file_name)
    end
  end
end
