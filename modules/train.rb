require 'discordrb'

require_relative '../services/utility_service'
require_relative '../services/discord_message_sender'

module Train
	extend Discordrb::Commands::CommandContainer

	# sl and train commands print the steam locomotive :)
	command(:sl, attributes={:aliases=:train}) do |event|
		draw_train(event)
	end

	def self.draw_train(event)
		train = """
```
                        (@@) (  ) (@)  ( )  @@    ()    @     O     @     O      @\n
                   (   )
               (@@@@)
            (    )
        (@@@)
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|      _________________
   /     |  |   H  |  |     |   |         ||_| |_||     _|                \_____A
  |      |  |   H  |__--------------------| [___] |   =|                        |
  | ________|___H__/__|_____/[][]~\\_______|       |   -|                        |
  |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_
 |/-=|___|=O=====O=====O=====O   |_____/~\\___/          |_D__D__D_|  |_D__D__D_|
  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/               \\_/   \\_/    \\_/   \\_/
```
		"""
		DiscordMessageSender.send(event.channel, train)
	end
end