# ruby version 2.7.2 using debian buster as base
FROM ubuntu:21.04
#FROM ruby:2.7.2-buster

# copy everything into home
COPY . .

# change permissions of /tmp cause it throws a fit otherwise
RUN chmod 1777 /tmp

# update repository info cache
RUN apt-get update -yqq && \
apt-get install -yqq \
apt-utils ca-certificates

# fix a weird error about apt-utils
RUN apt-get install -yqq --no-install-recommends apt-utils

# install ruby and gems
RUN apt-get install -yqq ruby2.7 rubygems ruby-dev

# install bundler
RUN gem install bundler

# this line exists cause tzdata is downloaded and asks for user input
# we obvi cant have that so this line gets rid of that
RUN DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata 

# download dependencies
RUN apt-get install -y -f build-essential cmake make libcairo2-dev libpangox-1.0-dev flex bison libglib2.0-dev libgdk-pixbuf-2.0-dev libxml2-dev 

# install imagemagick cause it throws a fit otherwise
RUN apt-get update && apt-get install -y \
    imagemagick libmagickwand-dev --no-install-recommends

# bundler throws a fit because we are root
# but thats the point of a container
RUN bundle config --global silence_root_warning 1
# download ruby dependencies
RUN bundle install
# 
# # run the bot
CMD ["ruby", "main.rb"]
