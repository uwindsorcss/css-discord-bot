# UWindsor CSS Discord Bot

*Warning: This bot was designed to work on unix based os'*
*your milage may vary and might be a nightmare to install if you use it on windows*

## Setup

### Dependencies Before Ruby

* GNU make
* glib-2.0
* gdk-pixbuf-2.0
* xml2
* cairo
* pango
* CMake
* GNU Bison
* Flex
* ImageMagick

all of these dependencies is for the `~equation` command

to install them you can run(if you use ubuntu) 
``` sh
sudo apt install build-essential make libglib2.0-dev libgdk-pixbuf2.0-0 libxml2 cairo libcogl-pango20 flex bison imagemagick
```

if you notice, we arent installing CMake, im assuming that your system has it by default. if it doesnt then uhhhh sorry you have to install it yourself.

### Dependencies for Ruby

this part is easier, you just need to install

* Ruby version 2.7.0
* Bundle
* Gem
* rbenv(optional but highly reccomended by Ryan Prairie, seriously, itll make your life much easier)

once those are all installed and setup

run while in the <Main> directory

``` sh
bundle install
```

## Config

you first need to copy `config.example.conf` to `config.conf`

you can do that by doing

``` sh
cp config.example.conf config.conf
```

once that is done, you have to replace or change the variables to get it up and running. a bunch of it is self explainitory.

for `features` each flag can be changed to turn on or off features. this is good for testing and for security reasons.


## Run
to run it just do 

``` sh
ruby main.rb
```


## Todo

* Docker 

* featurized config based gem file

* Fully implement mcping
