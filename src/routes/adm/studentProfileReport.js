/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace studentAnalysisReport
 */

const PDFDocument = require('pdfkit')
const { Facilities } = require('../../models/facilities')
const { Users } = require('../../models/users')
const { Roles } = require('../../models/roles')
const { Reports } = require('../../models/reports')
const { DailyMoods } = require('../../models/dailyMoods')
const { Questionnaires } = require('../../models/questionnaire')
const { Moods } = require('../../models/moods')
const { Answers } = require('../../models/answers')
const { Chats } = require('../../models/chat')
const { default: mongoose } = require('mongoose')

const regular = 'Helvetica'
const bold = 'Helvetica-Bold'
const oblique = 'Helvetica-Oblique'
// eslint-disable-next-line no-unused-vars
const boldOblique = 'Helvetica-BoldOblique'

const messages = async (doc, reports) => {
  doc.font(bold).fontSize(24).text('Analyse des messages', {
    align: 'left'
  })
  doc.moveDown()

  if (reports.length === 0) {
    doc.font(regular).fontSize(12).text('Aucun signalement lié aux messages n\'a été trouvé durant cette période.', {
      align: 'left'
    })
    return doc
  }

  doc
    .font(bold)
    .fontSize(12)
    .text(`Les messages signalés par l'analyse étudiante pour vulgarités sont au nombres de ${reports.length}.`, {
      align: 'left'
    })

  doc.moveDown()

  doc.font(regular).fontSize(12).text('Titres des conversations signalées:', {
    align: 'left'
  })

  for (const report of reports) {
    if (!report.conversation) continue
    const chat = await Chats.findById(report.conversation)

    if (!chat) continue
    doc.font(regular).fontSize(12).text(`- ${chat.title}`, {
      align: 'left',
      indent: 20
    })
  }

  return doc
}

const questionnaireAnswers = async (doc, reports) => {
  doc.font(bold).fontSize(24).text('Analyse des réponses aux questionnaires', {
    align: 'left'
  })
  doc.moveDown()

  if (reports.length === 0) {
    doc.font(regular).fontSize(12).text('Aucun signalement lié aux réponses aux questionnaires n\'a été trouvé durant cette période.', {
      align: 'left'
    })
    return doc
  }

  doc
    .font(bold)
    .fontSize(12)
    .text(`Les réponses aux questionnaires signalées par l'analyse étudiante pour vulgarités sont au nombres de ${reports.length}.`, {
      align: 'left'
    })
  doc.moveDown()

  return doc
}

const moods = async (doc, reports) => {
  doc.font(bold).fontSize(24).text('Analyse des ressentis', {
    align: 'left'
  })
  doc.moveDown()

  if (reports.length === 0) {
    doc.font(regular).fontSize(12).text('Aucun signalement lié aux ressentis n\'a été trouvé durant cette période.', {
      align: 'left'
    })
    return doc
  }
  doc
    .font(bold)
    .fontSize(12)
    .text(`Les ressentis signalées par l'analyse étudiante pour vulgarités sont au nombres de ${reports.length}.`, {
      align: 'left'
    })
  doc.moveDown()

  return doc
}

const questionnaireAnswersFrequency = async (doc, reports) => {
  doc
    .font(bold)
    .fontSize(12)
    .text(`L'analyse étudiante à relevé un manque de réponse aux questionnaires ${reports.length} fois.`, {
      align: 'left'
    })
  doc.moveDown()

  if (reports.length === 0) return doc

  doc.font(regular).fontSize(12).text('Dernier rapport daté du:', {
    align: 'left',
    continued: true
  })
  doc.font(regular).fontSize(12).text(`${reports[reports.length - 1].createdAt
    .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join(' ')
  }`, {
    align: 'right'
  })

  doc.moveDown()
  doc.moveDown()

  return doc
}

const moodRate = async (doc, reports) => {
  doc
    .font(bold)
    .fontSize(12)
    .text(`L'analyse étudiante à relevé une faible moyenne de ressentis ${reports.length} fois.`, {
      align: 'left'
    })
  doc.moveDown()

  if (reports.length === 0) return doc

  doc.font(regular).fontSize(12).text('Dernier rapport daté du:', {
    align: 'left',
    continued: true
  })
  doc.font(regular).fontSize(12).text(`${reports[reports.length - 1].createdAt
  .toISOString()
    .split('T')[0]
    .split('-')
    .reverse()
    .join(' ')
  }`, {
    align: 'right'
  })

  doc.moveDown()
  doc.moveDown()

  return doc
}

const buildAggregationDailyMood = (fromDate, toDate) => {
  const agg = { date: {} }

  const convertedFromDate = new Date(fromDate)
  if (fromDate && convertedFromDate !== null) {
    agg.date.$gte = convertedFromDate
  }

  const convertedToDate = new Date(toDate)
  if (toDate && convertedToDate !== null) {
    agg.date.$lte = convertedToDate
  }
  return agg
}

const getLastSeptemberFirst = () => {
  const today = new Date()
  const currentYear = today.getFullYear()

  // Créer une date pour le 1er septembre de l'année en cours
  const septemberFirstThisYear = new Date(currentYear, 8, 1) // Mois 8 correspond à septembre (0-indexé)

  // Si aujourd'hui est avant le 1er septembre de cette année, retourner le 1er septembre de l'année précédente
  if (today < septemberFirstThisYear) {
    return new Date(currentYear - 1, 8, 1)
  }

  // Sinon, retourner le 1er septembre de cette année
  return septemberFirstThisYear
}

const dailyMood = async (doc, id) => {
  const fromDate = getLastSeptemberFirst()
  const toDate = new Date()

  const agg = buildAggregationDailyMood(fromDate, toDate)
  const response = {}
  const moods = await DailyMoods.find({ ...agg, user: id })
  let average = 0

  for (const mood of moods) {
    const date = (new Date(mood.date)).toISOString().split('T')[0]
    response[date] = mood.mood
    average += mood.mood
  }
  response.averagePercentage = moods.length > 0 ? average / moods.length * 20 : 'NaN'

  doc.font(bold).fontSize(30).text('Humeur quotidienne', {
    align: 'center'
  })
  doc.moveDown()

  if (moods.length === 0) {
    doc.font(regular).fontSize(12).text('Aucune humeur quotidienne n\'a été trouvé durant la dernière année scolaire.', {
      align: 'left'
    })
    return doc
  }

  doc.font(bold).fontSize(12).text('La moyenne de l\'humeur quotidienne de l\'élève depuis le début de l\'année scolaire est de ' + response.averagePercentage, {
    align: 'left'
  })
  doc.moveDown()

  return doc
}

const createdMoods = async (doc, id) => {
  const fromDate = getLastSeptemberFirst()
  const toDate = new Date()

  const agg = { date: {} }

  const convertedFromDate = new Date(fromDate)
  if (fromDate && convertedFromDate !== null) {
    agg.date.$gte = convertedFromDate
  }

  const convertedToDate = new Date(toDate)
  if (toDate && convertedToDate !== null) {
    agg.date.$lte = convertedToDate
  }
  const response = {}
  const moods = await Moods.find({ ...agg, user: id })
  let average = 0
  let numberMoods = 0

  for (const mood of moods) {
    const date = (new Date(mood.date)).toISOString().split('T')[0]
    if (!response[date]) response[date] = { moods: [], average: 0 }
    response[date].moods.push(mood.mood)
    response[date].average += mood.mood
    average += mood.mood
    numberMoods += 1
  }
  for (const date of Object.keys(response)) {
    response[date].average /= response[date].moods.length
  }
  response.averagePercentage = numberMoods > 0 ? average / numberMoods * 20 : 'NaN'

  doc.font(bold).fontSize(30).text('Ressentis', {
    align: 'center'
  })
  doc.moveDown()

  if (numberMoods === 0) {
    doc.font(regular).fontSize(12).text('Aucune ressentis n\'a été trouvé durant la dernière année scolaire.', {
      align: 'left'
    })
    return doc
  }

  doc.font(bold).fontSize(12).text('La moyenne de l\'humeur des ressentis de l\'élève depuis le début de l\'année scolaire est de ' + response.averagePercentage, {
    align: 'left'
  })
  doc.moveDown()
  doc.font(bold).fontSize(12).text('Avec ' + moods.length + ' ressentis créés. Dont ' + (moods.filter((mood) => mood.annonymous)).length + ' ressentis anonymes.', {
    align: 'left'
  })
  doc.moveDown()

  return doc
}

const answeredQuestionnaires = async (doc, student) => {
  const fromDate = getLastSeptemberFirst()
  const toDate = new Date()

  const agg = [
    {
      $match: {}
    }
  ]
  const convertedFromDate = new Date(fromDate)
  if (fromDate && convertedFromDate !== null) {
    agg[0].$match.fromDate = {
      $gte: convertedFromDate
    }
  }

  const convertedToDate = new Date(toDate)
  if (toDate && convertedToDate !== null) {
    agg[0].$match.toDate = {
      $lte: convertedToDate
    }
  }
  const questionnaires = await Questionnaires.find({
    ...agg,
    classes: student.classes[0]
  })
  const answers = await Answers.find({
    questionnaire: { $in: questionnaires.map((q) => q._id) },
    createdBy: student._id
  })

  doc.font(bold).fontSize(30).text('Questionnaires', {
    align: 'center'
  })
  doc.moveDown()

  if (answers.length === 0) {
    doc.font(regular).fontSize(12).text('Aucune réponse à des questionnaires n\'a été trouvé durant la dernière année scolaire.', {
      align: 'left'
    })
    return doc
  }

  doc.font(bold).fontSize(12).text('L\'élève depuis le début de l\'année scolaire a répondu à ' + answers.length + ' sur ' + questionnaires.length + ' questionnaires', {
    align: 'left'
  })
  doc.moveDown()

  return doc
}

const createdReports = async (doc, id) => {
  const fromDate = getLastSeptemberFirst()
  const toDate = new Date()

  const agg = { createdAt: {} }

  const convertedFromDate = new Date(fromDate)
  if (fromDate && convertedFromDate !== null) {
    agg.createdAt.$gte = convertedFromDate
  }

  const convertedToDate = new Date(toDate)
  if (toDate && convertedToDate !== null) {
    agg.createdAt.$lte = convertedToDate
  }
  const reports = await Reports.find({ ...agg, signaledBy: id })

  doc.font(bold).fontSize(30).text('Signalements Créés', {
    align: 'center'
  })
  doc.moveDown()

  if (reports.length === 0) {
    doc.font(regular).fontSize(12).text('Aucun signalement n\'a été trouvé durant cette période.', {
      align: 'left'
    })
    return doc
  }

  doc.font(bold).fontSize(12).text('Les signalements de l\'élève sont:', {
    align: 'left'
  })
  doc.moveDown()

  for (const report of reports) {
    const user = await Users.findById(report.usersSignaled[0]).populate('classes')

    if (!user) continue
    if (user.classes.length === 0) continue
    doc.font(regular).fontSize(12).text(`${user.firstname} ${user.lastname} en classe ${user.classes[0].name}`, {
      align: 'left'
    })
  }

  return doc
}

/**
 * Main studentProfileReport function
 * @name GET /adm/studentProfileReport
 * @function
 * @memberof module:router~mainRouter~admRouter~studentProfileReport
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const { from, to } = req.query
    const facility = Facilities.findById(req.user.facility)
    const analyseRole = await Roles.findOne({ levelOfAccess: -1 })
    const [analyseUser, student] = await Promise.all([
      Users.findOne({ facility: req.user.facility, role: analyseRole._id }),
      Users.findOne({ facility: req.user.facility, _id: id }).populate('classes')
    ])
    if (!student || student.length === 0) return res.status(404).json({ message: `User not found: ${id}.` })

    const query = { signaledBy: analyseUser._id, usersSignaled: id }

    if (from) query.createdAt = { $gte: from }
    if (to) query.createdAt = { ...query.createdAt, $lte: to }
    let reports = await Reports.find(query)
    let doc = new PDFDocument()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="testGeneration.pdf"')
    doc.pipe(res)

    doc.moveDown(18)

    doc
      .font(bold)
      .fontSize(24)
      .text(`Rapport de l'analyse étudiante à propos de ${student.firstname} ${student.lastname} en classe ${student.classes[0].name}`, {
        align: 'center'
      })

    doc.moveDown()

    doc.font(oblique).fontSize(20).text((await facility).name, {
      align: 'center'
    })

    doc.addPage()

    // Dailymood part
    doc = await dailyMood(doc, id)
    doc.addPage()

    // Mood part
    doc = await createdMoods(doc, id)
    doc.addPage()

    // Questionnaires part
    doc = await answeredQuestionnaires(doc, student)
    doc.addPage()

    // Created report part
    doc = await createdReports(doc, id)
    doc.addPage()

    // Assigned report part
    doc.font(bold).fontSize(30).text('Signalements assignés', {
      align: 'center'
    })
    if (!reports) reports = []
    doc = await messages(doc, reports.filter(report => report.message === 'Cet utilisateur semble avoir utilisé des vulgarités dans ses messages à une autre personne.'))
    doc.addPage()
    doc = await questionnaireAnswers(doc, reports.filter(report => report.message === 'Cet utilisateur semble avoir écris des vulgarités dans une de ses réponse à un questionnaire.'))
    doc.addPage()
    doc = await moods(doc, reports.filter(report => report.message === 'Cet utilisateur semble avoir utilisé des vulgarité dans son rapport de ressenti.'))
    doc.addPage()
    doc.font(bold).fontSize(24).text('Analyse des fréquence de réponse et ressentis moyen', {
      align: 'left'
    })
    doc.moveDown()
    doc = await questionnaireAnswersFrequency(doc, reports.filter(report => report.message === 'Cet utilisateur n\'a pas répondu a assez de questions dans les deux derniers questionnaires terminés.'))
    doc = await moodRate(doc, reports.filter(report => report.message === 'Cet utilisateur semble avoir un ressentis moyen faible.'))

    doc.end()
    return res.status(200)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
