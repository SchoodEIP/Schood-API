const { Classes } = require("../../models/classes")
const { Questionnaires } = require("../../models/questionnaire")
const { Users } = require("../../models/users")
const Logger = require("../../services/logger")
const { createNotificationForAllStudentOfClass } = require("../../services/notification")

module.exports = async (facility) => {
    Logger.info('--------------------------------------------------')
    Logger.info('INFO: Checking defaultQuestionnaires')
    const questionnaires = await Questionnaires.find({facility: facility._id})
    const class200 = await Classes.findOne({ name: '200', facility: facility._id })
    const class201 = await Classes.findOne({ name: '201', facility: facility._id })
    const teacher1User = await Users.findOne({firstname: "Pierre", facility: facility._id})
    const teacher2User = await Users.findOne({firstname: "Marie", facility: facility._id})
    const questionnairesToInit = [
        {
            title: "Questionnaire Français",
            fromDate: new Date("2024-02-18"),
            toDate: new Date("2024-02-25"),
            questions: [
                {
                    title: "Quel age avez-vous ?",
                    type: "text"
                },
                {
                    title: "Comment vous sentez-vous ?",
                    type: "emoji"
                },
                {
                    title: "C'est temps-ci, vous êtes plutôt ?",
                    type: "multiple",
                    answers: [
                        {
                            position: 1,
                            title: "Heureux"
                        },
                        {
                            position: 2,
                            title: "Triste"
                        },
                        {
                            position: 3,
                            title: "En colère"
                        },
                        {
                            position: 4,
                            title: "Déprimé"
                        },
                    ]
                }
            ],
            classes: [class200._id, class201._id],
            createdBy: teacher1User._id,
            facility: facility._id
        },
        {
            title: "Questionnaire Mathématique",
            fromDate: new Date("2024-02-18"),
            toDate: new Date("2024-02-25"),
            questions: [
                {
                    title: "Avez-vous des questions sur la dernière leçon ?",
                    type: "text"
                },
                {
                    title: "Comment évaluez-vous la dernière leçon ?",
                    type: "emoji"
                },
            ],
            classes: [class200._id],
            createdBy: teacher2User._id,
            facility: facility._id
        }
    ]
    
    for (let index = 0; index < questionnairesToInit.length; index++) {
        const questionnaireToInit = questionnairesToInit[index];
        if (!questionnaires.find((questionnaire) => String(questionnaire.title) === questionnaireToInit.title)) {
            Logger.info('INFO: Init default questionnaire ' + questionnaireToInit.title)
            const questionnaire = new Questionnaires(questionnaireToInit)
            await questionnaire.save()

            for (let index = 0; index < questionnaireToInit.classes.length; index++) {
                const _class = questionnaireToInit.classes[index]
                const teacher = await Users.findById(questionnaireToInit.createdBy)
                const date = new Date();
                
                await createNotificationForAllStudentOfClass(_class, 'Un nouveau questionnaire est disponible', 'Le questionnaire du ' + date.toDateString() + ' par ' + teacher.firstname + ' ' + teacher.lastname + ' est disponible', 'questionnaire', questionnaire._id, facility._id)
            }
        }
    }
}