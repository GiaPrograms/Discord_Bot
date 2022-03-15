FROM node:latest

WORKDIR /MusicBot

COPY package*.json ./

RUN npm init -y

RUN npm install dotenv discord.js discord-player @discordjs/voice @discordjs/rest @discordjs/opus @discordjs/builders ffmpeg-static

COPY . .

RUN node index.js load

CMD ["node", "index.js"]