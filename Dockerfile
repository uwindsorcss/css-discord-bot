# using ubuntu 21.04 as a base and building from there
FROM ubuntu:21.04

# copy everything into home
COPY . .

# change permissions of /tmp cause it throws a fit otherwise
RUN chmod 1777 /tmp

# update repository info cache
RUN apt-get update -yqq && \
apt-get install -yqq apt-utils ca-certificates curl

############
# installing ruby
############

# fix a weird error about apt-utils
# RUN apt-get install -yqq --no-install-recommends apt-utils

# install ruby and gems
RUN apt-get install -yqq ruby2.7 rubygems ruby-dev

# install bundler
RUN gem install bundler

############
# installing dependencies not relating to ruby
############
 
# this line exists cause tzdata is downloaded and asks for user input
# we obvi cant have that so this line gets rid of that
RUN DEBIAN_FRONTEND="noninteractive" apt-get -yqq install tzdata 

# download dependencies
RUN apt-get install -yqq build-essential cmake make libcairo2-dev libpangox-1.0-dev flex bison libglib2.0-dev libgdk-pixbuf-2.0-dev libxml2-dev 

# install imagemagick cause it throws a fit otherwise
RUN apt-get update -yqq && apt-get install -yqq \
    imagemagick libmagickwand-dev --no-install-recommends

############
# installing ruby dependencies
############

# bundler throws a fit because we are root
# but thats the point of a container
RUN bundle config --global silence_root_warning 1

# download ruby dependencies
RUN bundle install

############
# installing the correct fonts for `~equation`
############
 
# make fonts directory
RUN mkdir ~/.fonts

# install mtex2mml fonts that mathematical needs
RUN  cd ~/.fonts && curl -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmex10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmmi10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmr10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmsy10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/esint10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/eufm10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/msam10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/msbm10.ttf

############
# running the bot
############

# run the bot
CMD ["ruby", "main.rb"]
