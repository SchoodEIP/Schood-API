const { Chats } = require("../../models/chat")
const { Messages } = require("../../models/message")
const { Users } = require("../../models/users")
const Logger = require("../../services/logger")

module.exports = async (facility) => {
    Logger.info('--------------------------------------------------')
    Logger.info('INFO: Checking defaultMessages')
    const chats = await Chats.find({facility: facility._id})
    const messages = await Messages.find({facility: facility._id})
    const student1User = await Users.findOne({firstname: "Alice", facility: facility._id})
    const student2User = await Users.findOne({firstname: "Jean-Pierre", facility: facility._id})
    const teacher1User = await Users.findOne({firstname: "Pierre", facility: facility._id})

    const messagesToInit = [
        {
            user: student1User._id,
            date: new Date("2024-02-24"),
            content: "Bonjour !",
            chat: chats.find((chat) => String(chat.title) === "Demande de soutien")._id,
            facility: facility._id
        },
        {
            user: student1User._id,
            date: new Date("2024-02-24"),
            content: "Je me permet de vous contacter afin de faire une demande de soutien sur vos cours, ayant du mal à suivre ces temps-cis.",
            chat: chats.find((chat) => String(chat.title) === "Demande de soutien")._id,
            facility: facility._id
        },
        {
            user: teacher1User._id,
            date: new Date("2024-02-24"),
            content: "Bonjour, il n'y a aucun problème de mon coté.",
            chat: chats.find((chat) => String(chat.title) === "Demande de soutien")._id,
            facility: facility._id
        },
        {
            user: student2User._id,
            date: new Date("2024-02-24"),
            content: "Bonjour.",
            chat: chats.find((chat) => String(chat.title) === "Demande d'aide concernant la leçon de mathématique")._id,
            facility: facility._id
        }
    ]
    
    for (let index = 0; index < messagesToInit.length; index++) {
        const messageToInit = messagesToInit[index];
        if (!messages.find((message) => String(message.content) === String(messageToInit.content))) {
            Logger.info('INFO: Init default message ' + messageToInit.content)
            const message = new Messages(messageToInit)
            await message.save()
            const chat = chats.find((chat) => String(chat._id) === String(messageToInit.chat))
            chat.messages.push(message._id)
            await chat.save()
        }
    }
}