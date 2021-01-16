var moment = require('moment-timezone')
var qrcode = require('qrcode-terminal')
var colors = require('colors/safe')
var fs = require('fs')
var _  = require('lodash')

const
{
   ChatModification,
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   waChatKey,
   GroupSettingChange
} = require("@adiwajshing/baileys")
const { connect } = require('http2')

prefix = require("./config.json").prefix

const client = new WAConnection()

const { wait, getBuffer } = require('./lib/functions')
const availableCommands = new Set();

fs.readdir("./commands", (e, files) => {
    if (e) return console.error(e);
    files.forEach((commandFile) => {
        availableCommands.add(commandFile.replace(".js", ""));
    });
});

const starts = async zef => {
    zef.on('qr', qr => {
        qrcode.generate(qr, { small: true })
        console.log(`[ ! ] Scan kode qr dengan whatsapp!`)
    })

    zef.on('credentials-updated', () => {
        const authInfo = client.base64EncodedAuthInfo()
        console.log(`credentials updated!`)

        fs.writeFileSync('./session-zefian.json', JSON.stringify(authInfo, null, '\t'))
    })

    fs.existsSync('./session-zefian.json') && client.loadAuthInfo('./session-zefian.json')

    zef.connect()

    zef.on('message-new', async message => {
        try {
            global.prefix;

            const from = message.key.remoteJid
            const ttext = message.message.conversation
            const isGroup = from.endsWith('@g.us')
            const type = Object.keys(message.message)[0]
            const id = isGroup ? message.participant : message.key.remoteJid

            const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType

            body = (type === 'conversation' && message.message.conversation.startsWith(prefix)) ? message.message.conversation : (type == 'imageMessage') && message.message.imageMessage.caption.startsWith(prefix) ? message.message.imageMessage.caption : (type == 'videoMessage') && message.message.videoMessage.caption.startsWith(prefix) ? message.message.videoMessage.caption : (type == 'extendedTextMessage') && message.message.extendedTextMessage.text.startsWith(prefix) ? message.message.extendedTextMessage.text : ''
            budy = (type === 'conversation') ? message.message.conversation : (type === 'extendedTextMessage') ? message.message.extendedTextMessage.text : ''

            const argv = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const isCmd = body.startsWith(prefix)
            mess = {
				wait: '⌛ Em processo ⌛',
                success: '✔️ Funciona ✔️',
                gagal: '❌ Falhou ❌',
                stick: '❌ Falha, ocorreu um erro ao converter a imagem em um adesivo ❌',
                Iv: '❌ Link inválido ❌',
				only: {
					group: '❌ Este comando só pode ser usado em grupos! ❌',
					ownerG: '❌ Este comando só pode ser usado pelo grupo proprietário! ❌',
					ownerB: '❌ Este comando só pode ser usado pelo bot proprietário! ❌',
					admin: '❌ Este comando só pode ser usado por administradores de grupo! ❌',
					Badmin: '❌ Este comando só pode ser usado quando o bot se torna administrador! ❌'
				}
            }
            const reply = (teks) => {
				zef.sendMessage(from, teks, text, {quoted: message})
            }
            const isBot = client.user.jid
            const owner = '5511946817667@s.whatsapp.net'  // replace owner number
            const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupId   = isGroup ? groupMetadata.jid : ''
            const isMedia   = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage')

            const content = JSON.stringify(message.message)

            const isQuotedImage     = type === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo     = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedAudio     = type === 'extendedTextMessage' && content.includes('audioMessage')
            const isQuotedSticker   = type === 'extendedTextMessage' && content.includes('stickerMessage')
            const isQuotedMessage   = type === 'extendedTextMessage' && content.includes('conversation')

//            if (isGroup && !isMedia) return console.log(`[${colors.bgYellow('GROUP CHAT')}] FROM ${colors.bgMagenta(from)} : ${colors.bgCyan(args.join(' '))}`)

            console.log(availableCommands)
            if (ttext.includes('#menu')){
                zef.sendMessage(from, "Use .menu", text, {quoted: message})
            }
            console.log(availableCommands)
            if (ttext.includes('/menu')){
                zef.sendMessage(from, "Use .menu", text, {quoted: message})
            }
            console.log(availableCommands)
            if (ttext.includes('!menu')){
                zef.sendMessage(from, "Use .menu", text, {quoted: message})
            }
            console.log(availableCommands)
            if (ttext.includes('%menu')){
                zef.sendMessage(from, "Use .menu", text, {quoted: message})
            }
            console.log(availableCommands)
            if (ttext.includes('#help')){
                zef.sendMessage(from, "Use .menu", text, {quoted: message})
            }
            console.log(availableCommands)
            if (ttext.includes('/help')){
                zef.sendMessage(from, "Use .menu", text, {quoted: message})
            }
            console.log(availableCommands)
            if (ttext.includes('!help')){
                zef.sendMessage(from, "Use .menu", text, {quoted: message})
            }
            console.log(availableCommands)
            if (ttext.includes('%help')){
                zef.sendMessage(from, "Use .menu", text, {quoted: message})
            }

            if (ttext.includes('.txtblackpink')){
                if (args.length < 1) return reply('Onde está o texto?')
					teks = body.slice(13)
					reply(mess.wait)
                    anu = (`https://docs-jojo.herokuapp.com/api/blackpink?text=${teks}`)
                    buff = await getBuffer(anu)
					zef.sendMessage(from, buff, image, {quoted: message, caption: mess.success})
            }

            if (availableCommands.has(argv))
                require(`./commands/${argv}`).run(zef, message, args, from, id, mess, reply, getBuffer)
        } catch (err) {
            throw err
        }
    })
}

( async () => {
    await starts(client)
})()
