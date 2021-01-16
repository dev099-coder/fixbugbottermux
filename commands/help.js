const { readdir } = require('fs')

const { MessageType } = require("@adiwajshing/baileys")
const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType

exports.run = (bot, message, args, from, fetchJson) => {
    let tmpFile = {}
    readdir(process.cwd() + '/commands', (err, files) => {
        if (err) throw err
        files.forEach((jsFile) => {
            const cmdFile = require(`./${jsFile}`);
            tmpFile[jsFile.replace(".js", "")] = {};
            tmpFile[jsFile.replace(".js", "")].name = cmdFile.help.name;
            tmpFile[jsFile.replace(".js", "")].description = cmdFile.help.description;
            tmpFile[jsFile.replace(".js", "")].usage = cmdFile.help.usage;
        })
        if (!args[0]) {
            bot.sendMessage(from, `*Comandos disponíveis:*\n ${Object.keys(tmpFile).join("\n ")}\n\n_Você pode correr *help <nome do comando>* para mostrar ajuda avançada._\n\n_Note: este bot tem cooldown 5 segundos_`, text, { quoted: message })
    } else {
            const commandName = args[0];
            const { name, description, usage } = require(`./${commandName}.js`).help;
            bot.sendMessage(from, `*${name}*\n\nDescrição: ${description}\nUsage: \`\`\`${usage}\`\`\``, text, { quoted: message })
        };
    })
}

exports.help = {
    name: "Help",
    description: "Mostra a lista de comandos do bot",
    usage: "help",
    cooldown: 5,
};
