FROM node:latest
RUN apt-get update && apt-get upgrade -y
#RUN apt-get install -y sudo
RUN apt-get install -y gnupg
RUN apt-get install -y curl
RUN apt-get install -y gconf-service libx11-xcb1
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs
RUN apt install -y gconf-service libgbm1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
RUN DEBIAN_FRONTEND=noninteractive apt-get -yq install php php-curl
RUN apt remove cmdtest
RUN apt remove yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get install yarn
RUN apt-get -o Dpkg::Options::="--force-overwrite" install -y yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN npm install express child-process string_decoder http request underscore fs cli-color
#RUN npm install puppeteer --unsafe-perm --allow-root
RUN npm install dotenv
RUN npm i amqplib 
RUN npm install express
RUN mkdir srv/newser
RUN cd /
RUN cd srv/newser
RUN touch logs.txt
WORKDIR /src/
RUN npm i

EXPOSE 3000


