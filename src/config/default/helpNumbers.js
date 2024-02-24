const { HelpNumbers } = require("../../models/helpNumbers")
const { HelpNumbersCategories } = require("../../models/helpNumbersCategories")
const Logger = require("../../services/logger")

module.exports = async (facility) => {
    Logger.info('--------------------------------------------------')
    Logger.info('INFO: Checking defaultHelpNumbers')
    const helpNumbers = await HelpNumbers.find({facility: facility._id})
    const urgenceHelpNumbersCategory = await HelpNumbersCategories.findOne({facility: facility._id, name: "Numéros d'urgences"})
    const victimeHelpNumbersCategory = await HelpNumbersCategories.findOne({facility: facility._id, name: "Numéros d'aide aux victimes"})
    const addictionHelpNumbersCategory = await HelpNumbersCategories.findOne({facility: facility._id, name: "Addictions"})

    const helpNumbersToInit = [
        {
            name: "Numéro d'urgence européen",
            telephone: "112",
            helpNumbersCategory: urgenceHelpNumbersCategory._id,
            description: "Le 112 est réservé aux appels d'urgence dans l'ensemble de l'Union européenne.",
            facility: facility._id
        },
        {
            name: "Samu",
            telephone: "15",
            helpNumbersCategory: urgenceHelpNumbersCategory._id,
            description: "Le 15 est le numéro de téléphone unique par département. Il donne directement accès au Samu (service d'aide médicale urgente).",
            facility: facility._id
        },
        {
            name: "Police secours",
            telephone: "17",
            helpNumbersCategory: urgenceHelpNumbersCategory._id,
            description: "Composez le 17 sur votre téléphone en cas d'urgence concernant un accident de la route, un trouble à l'ordre public ou une infraction pénale nécessitant une intervention rapide pour protéger les personnes et/ou les biens.",
            facility: facility._id
        },
        {
            name: "Sapeurs pompiers",
            telephone: "18",
            helpNumbersCategory: urgenceHelpNumbersCategory._id,
            description: "Composez le 18 sur votre téléphone lorsqu'une ou des vies sont en danger (malaise, blessure grave, départ de feu, accident de la route, noyade, inondation, etc.).",
            facility: facility._id
        },
        {
            name: "Numéro d'urgence pour les personnes sourdes et malentendantes",
            telephone: "114",
            helpNumbersCategory: urgenceHelpNumbersCategory._id,
            description: "Le 114, numéro d’appel d’urgence français pour les sourds et malentendants, est un numéro unique, national, gratuit, accessible en permanence par visiophonie, tchat, SMS ou fax.",
            facility: facility._id
        },
        {
            name: "Alerte attentat/enlèvement",
            telephone: "197",
            helpNumbersCategory: urgenceHelpNumbersCategory._id,
            description: "Lorsque qu'une alerte est diffusée et que vous disposez d’informations pouvant aider les enquêteurs, composez le 197 (depuis la France). Lorsqu’il est activé, ce numéro gratuit est opérationnel 24h/24, 7 jours/7. Des policiers spécialisés vous répondent pour recueillir votre témoignage.",
            facility: facility._id
        },
        {
            name: "Samu social",
            telephone: "115",
            helpNumbersCategory: urgenceHelpNumbersCategory._id,
            description: "Le Samu social est un ensemble d'associations non gouvernementales venant en aide aux personnes démunies. Composez le 115 sur votre téléphone pour les contacter.",
            facility: facility._id
        },
        {
            name: "Enfance en danger",
            telephone: "119",
            helpNumbersCategory: victimeHelpNumbersCategory._id,
            description: "Préoccupé par une situation d'enfant en danger ou en risque de l'être ? Un numéro d'appel 119 totalement gratuit est à votre disposition.",
            facility: facility._id
        },
        {
            name: "Arrêtons les violences",
            telephone: "39 19",
            helpNumbersCategory: victimeHelpNumbersCategory._id,
            description: "Chantage, humiliation, injures, coups... Les femmes victimes de violences peuvent contacter ce numéro gratuit et anonyme, 39 19, désormais accessible 24h/24 et 7 jours sur 7.",
            facility: facility._id
        },
        {
            name: "Net Ecoute - Cyberharcèlement des jeunes",
            telephone: "30 18",
            helpNumbersCategory: victimeHelpNumbersCategory._id,
            description: "Le numéro 30 18 gratuit, anonyme, confidentiel, est le numéro national contre le cyberharcèlement et les problèmes des jeunes sur internet et les réseaux sociaux.",
            facility: facility._id
        },
        {
            name: "Prévention du suicide",
            telephone: "31 14",
            helpNumbersCategory: victimeHelpNumbersCategory._id,
            description: "Le 3114 est un numéro de téléphone gratuit, qui permet aux personnes en détresse psychologique d'échanger et de trouver une réponse adaptée auprès de professionnels de la psychiatrie et de la santé mentale (psychiatres, infirmiers spécialisés et psychologues). Des professionnels vous répondent 24h/24 et 7j/7.",
            facility: facility._id
        },
        {
            name: "France victimes",
            telephone: "116 006",
            helpNumbersCategory: victimeHelpNumbersCategory._id,
            description: "Vous ou un de vos proches êtes victimes de violences physiques, sexuelles ou psychologiques, au sein de la famille ou en dehors, d'un accident de la route, d'un vol ou d'une escroquerie, ou de n'importe quel autre fait qui vous porte préjudice… Composez le 116 006 disponible 7j/7.",
            facility: facility._id
        },
        {
            name: "Numéro unique d'accès au droit",
            telephone: "30 39",
            helpNumbersCategory: victimeHelpNumbersCategory._id,
            description: "Le 30 39 a été créé pour faciliter la mise en relation avec un point-justice de proximité. Ce numéro est gratuit, joignable depuis l'ensemble du territoire et accessible aux personnes sourdes et malentendantes.",
            facility: facility._id
        },
        {
            name: "Stop djihadisme",
            telephone: "0 800 00 56 96",
            helpNumbersCategory: victimeHelpNumbersCategory._id,
            description: "Un numéro vert, 0 800 00 56 96, accessible du lundi au vendredi de 9 heures à 17 heures, qui permet à toute personne ayant un doute sur une radicalisation ou un questionnement sur le sujet, de s'informer.",
            facility: facility._id
        },
        {
            name: "Infos Escroqueries",
            telephone: "0 805 80 58 17",
            helpNumbersCategory: victimeHelpNumbersCategory._id,
            description: "Composée de policiers et de gendarmes, la plateforme « Info Escroqueries » est chargée d'informer, de conseiller et d'orienter les personnes victimes d'une escroquerie, celle-ci est accessible au 0 805 80 58 17.",
            facility: facility._id
        },
        {
            name: "Drogues info services",
            telephone: "0 800 23 13 13",
            helpNumbersCategory: addictionHelpNumbersCategory._id,
            description: "Trouvez une aide et un soutien adaptés aux besoins de chacun, des informations précises sur les effets, les risques, la loi, les lieux d'accueil, des conseils de prévention, une orientation vers des professionnels compétents. Composez le 0 800 23 13 13.",
            facility: facility._id
        },
        {
            name: "Joueurs info services",
            telephone: "09 74 75 13 13",
            helpNumbersCategory: addictionHelpNumbersCategory._id,
            description: "Contactez le 09 74 75 13 13 si vous recherchez une information, une aide, un soutien pour vous ou pour un proche sur les questions d'addiction aux jeux.",
            facility: facility._id
        },
        {
            name: "Tabac info services",
            telephone: "39 89",
            helpNumbersCategory: addictionHelpNumbersCategory._id,
            description: "Faites le point sur votre consommation. Choisissez une façon d'arrêter de fumer adaptée. Retrouvez des informations et des conseils gratuits ainsi qu'un suivi au 39 89.",
            facility: facility._id
        },
        {
            name: "Alcool info services",
            telephone: "09 80 98 09 30",
            helpNumbersCategory: addictionHelpNumbersCategory._id,
            description: "Que vous soyez concerné directement ou indirectement par une consommation d'alcool, n'hésitez pas à appeler le 09 80 98 09 30 vous y trouverez : des professionnels formés aux problèmes d'usage et de dépendance à l'alcool, une écoute sans jugement et confidentielle, des informations précises, et une aide personnalisée.",
            facility: facility._id
        },
    ]

    for (let index = 0; index < helpNumbersToInit.length; index++) {
        const helpNumberToInit = helpNumbersToInit[index];
        if (!helpNumbers.find((helpNumber) => String(helpNumber.name) === helpNumberToInit.name)) {
            Logger.info('INFO: Init default helpNumbers ' + helpNumberToInit.name)
            const helpNumber = new HelpNumbers(helpNumberToInit)

            await helpNumber.save()
        }
    }
}