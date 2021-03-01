# UWindsor CSS Discord Bot

**By contributing to this software in anyway, you agree to the terms layed out in CONTRIBUTING.md**

*Warning: This bot was designed to work on unix based os'*
*your milage may vary and might be a nightmare to install if you use it on windows*


## Config

you first need to copy `config.example.conf` to `config.conf`

you can do that by doing

``` sh
cp config.example.conf config.conf
```

once that is done, you have to replace or change the variables to get it up and running. a bunch of it is self explainitory.

for `features` each flag can be changed to turn on or off features. this is good for testing and for security reasons.

## Setup And Run Without Docker(not reccomended)

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
sudo apt install -y build-essential cmake make libcairo2-dev libpangox-1.0-dev flex bison libglib2.0-dev libgdk-pixbuf-2.0-dev libxml2-dev imagemagick
```


### Weird Font Issue For `~equation`

There is this weird font issue that happens sometimes

it can be easily seen by running `~equation \frac{\sqrt{32}}{3}`

this can be read more about at https://github.com/gjtorikian/mathematical/issues/79

and a solution can be found
https://github.com/gjtorikian/mathematical#fonts-and-special-notices-for-mac-os-x

for whatever reason you dont/cant read about it, il put a solution here

`cd` into the font directory for whatever OS youre using

then run 

``` sh
curl -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmex10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmmi10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmr10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/cmsy10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/esint10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/eufm10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/msam10.ttf \
     -LO http://mirrors.ctan.org/fonts/cm/ps-type1/bakoma/ttf/msbm10.ttf

```

### Dependencies For Ruby

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

## Run
to run it just do 

``` sh
ruby main.rb
```

## Setup And Run With Docker

### Dependencies

* Docker

### Build
to build just run

``` sh
docker build -t CssBot .
```

### Run

you can either run detached(in the background) or not

#### Detached
``` sh
docker run -d CssBot
```

#### Not Detached

``` sh
docker run CssBot
```

#### Stop Detached Bot

you first need to find the container id. that can be found by running 

``` sh
docker ps
```

under the first column

to kill run 

``` sh
docker stop <container id>
```


## Documentation

- discordrb version 3.4.0 - API and version we use

- ARCHITECTURE.md - a high level view of bot architecture

- CONTRIBUTING.md - things to keep in mind while contributing

## Todo

* Featurized config based gem file

* Fully implement mcping
