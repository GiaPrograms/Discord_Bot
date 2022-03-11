//Packages - npm i dotenv discord.js discord-player @discordjs/voice @discordjs/rest @discordjs/opus @discordjs/builders
const Discord = require('discord.js')
const dotenv = require('dotenv')

const path = require('path');

//Packages that allows the commands
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

//read files
const fs = require('fs')

//manage the music queue
const { Player } = require('discord-player')

//called the dotenv file
dotenv.config()

//discord bot token
const TOKEN = 'OTQxNDY5NTAwNDIxODMyODA2.YgWZzA._P4-Y5awx2qXplSOFx_-dHccTEQ'

//check if the second argument is "load"
//node index.js load - first time only
const LOAD_SLASH = process.argv[2] == "load"

//client id for the bot
const CLIENT_ID = "941469500421832806"

//where the bot will be executable (server id)
const GUILD_ID = "392475756434948107"

//initialize the discord client
const client = new Discord.Client({
    intents: [
        "GUILDS", //check what server the bot is in
        "GUILD_VOICE_STATES" //check what voice channel is in
    ]
})

client.slashcommands = new Discord.Collection()

client.player = new Player (client, {
    ytdlOptions: { //youtube downloader
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
}) 

//command loader
let commands = []

//read all the files in the slash directory
const slashFiles = fs.readdirSync(path.join(__dirname, `/slash`)).filter(file => file.endsWith(".js"))

//loop through the files 
for (const file of slashFiles){
    const slashcmd = require(path.join(__dirname, `/slash/${file}`)) //pull the content from the file
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    // console.log(slashcmd.data.toJSON())
    if (LOAD_SLASH) {
        commands.push(slashcmd.data.toJSON())
    }
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    //gereate the url that have both the client server id, allow to deploy all commands
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
} else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if(!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction})
        }
        handleCommand()
    })
    client.login(TOKEN)
}