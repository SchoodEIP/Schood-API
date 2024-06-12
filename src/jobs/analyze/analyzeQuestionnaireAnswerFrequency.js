const { Reports, Types } = require('../../models/reports')
const { Users } = require('../../models/users')
const { Answers } = require('../../models/answers')
const Logger = require('../../services/logger')
const { Questionnaires } = require('../../models/questionnaire')

module.exports = async (user) => {
  const toDate = new Date()
  toDate.setDate(toDate.getDate() - toDate.getDay() - 6)
  const questionnaires = await Questionnaires.find({ facility: user.facility, classes: user.classes[0], toDate: { $lte: toDate } })
    .sort({ toDate: -1 })
    .limit(2)
  const answers = await Answers.find({ facility: user.facility, createdBy: user._id, questionnaire: { $in: questionnaires } })

  if (!answers) return
  const frequency = analyzeAnswerFrequency(questionnaires, answers)
  if (frequency <= 80) createReport(user)
}

const analyzeAnswerFrequency = (questionnaires, answers) => {
  let totalQuestions = 0
  let answeredQuestions = 0

  questionnaires.forEach((questionnaire) => {
    for (const question of questionnaire.questions) {
      totalQuestions += 1
      for (const answer of answers) {
        const questionIds = answer.answers.map(a => a.question)
        if (questionIds.some(id => id.equals(question._id))) {
          answeredQuestions += 1
        }
      }
    }
  })

  return answeredQuestions / totalQuestions * 100
}

const createReport = async (user) => {
  const reporter = await Users.findOne({ facility: user.facility, firstname: 'analyse' })
  const checkReport = await Reports.findOne({
    facility: user.facility,
    signaledBy: reporter._id,
    usersSignaled: [user._id],
    message: 'Cet utilisateur n\'a pas répondu a assez de questions dans les deux derniers questionnaires terminés.',
    seen: false
  })
  if (checkReport) return

  const report = new Reports({
    usersSignaled: [user._id],
    signaledBy: reporter._id,
    createdAt: new Date(),
    message: 'Cet utilisateur n\'a pas répondu a assez de questions dans les deux derniers questionnaires terminés.',
    type: Types.OTHER,
    facility: user.facility
  })
  Logger.info('New report created.')
  await report.save()
}
