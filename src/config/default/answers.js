const { Answers } = require("../../models/answers")
const { Questionnaires } = require("../../models/questionnaire")
const { Users } = require("../../models/users")
const Logger = require("../../services/logger")

module.exports = async (facility) => {
    Logger.info('--------------------------------------------------')
    Logger.info('INFO: Checking defaultAnswers')
    const answers = await Answers.find({facility: facility._id})
    const questionnaireFR = await Questionnaires.findOne({title: "Questionnaire Français", facility: facility._id})
    const questionnaireMA = await Questionnaires.findOne({title: "Questionnaire Mathématique", facility: facility._id})
    const student1User = await Users.findOne({firstname: "Alice", facility: facility._id})
    const student2User = await Users.findOne({firstname: "Jean-Pierre", facility: facility._id})
    
    const answersToInit = [
        {
            questionnaire: questionnaireFR._id,
            date: new Date("2024-02-12"),
            answers: [
                {
                    question: questionnaireFR.questions[0]._id,
                    answers: ["22 ans"]
                },
                {
                    question: questionnaireFR.questions[1]._id,
                    answers: ["2"]
                },
                {
                    question: questionnaireFR.questions[2]._id,
                    answers: ["Heureux"]
                },
            ],
            createdBy: student1User._id,
        },
        {
            questionnaire: questionnaireMA._id,
            date: new Date("2024-02-13"),
            answers: [
                {
                    question: questionnaireFR.questions[0]._id,
                    answers: ["21 ans"]
                },
                {
                    question: questionnaireFR.questions[1]._id,
                    answers: ["3"]
                },
                {
                    question: questionnaireFR.questions[2]._id,
                    answers: ["Déprimé"]
                },
            ],
            createdBy: student2User._id,
        },
        {
            questionnaire: questionnaireMA._id,
            date: new Date("2024-02-20"),
            answers: [
                {
                    question: questionnaireMA.questions[0]._id,
                    answers: ["Je, n'ai pas très bien compris le dernier exercice"]
                },
                {
                    question: questionnaireMA.questions[1]._id,
                    answers: ["2"]
                },
            ],
            createdBy: student1User._id,
        },
    ]
    
    for (let index = 0; index < answersToInit.length; index++) {
        const answerToInit = answersToInit[index];
        if (!answers.find((answer) => String(answer.questionnaire) === String(answerToInit.questionnaire))) {
            Logger.info('INFO: Init default answer ' + answerToInit.questionnaire)
            const answer = new Answers(answerToInit)
            await answer.save()
        }
    }
}