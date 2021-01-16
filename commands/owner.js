const { MessageType } = require("@adiwajshing/baileys")
const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType

exports.run = (bot, message, args, from, id) => {
    const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN: Gabriel ❤️✨\n' // full name
            + 'ORG:Gabriel ❤️✨;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=5511946817667:+55 11 94681-7667\n' // WhatsApp ID + phone number
            + 'END:VCARD'
            bot.sendMessage(from, {displayname: "Gabriel ❤️✨", vcard: vcard}, contact, { quoted: message })
            bot.sendMessage(from, "ele não tem namorada apenas pegue", text)
        }

exports.help = {
    name: "dono",
    description: "Mostrar o bot do dono",
    usage: "dono",
    cooldown: 5,
};
