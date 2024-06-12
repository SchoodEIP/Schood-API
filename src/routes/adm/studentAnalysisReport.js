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

const regular = 'Helvetica'
const bold = 'Helvetica-Bold'
const oblique = 'Helvetica-Oblique'
// noinspection JSUnusedLocalSymbols
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

  doc.font(bold).fontSize(12).text('Les élèves signalés par l\'analyse étudiante pour vulgarités détecté dans les messages sont:', {
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

  doc.font(bold).fontSize(12).text('Les élèves signalés par l\'analyse étudiante pour vulgarités détecté dans les réponses aux questionnaires sont:', {
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

  doc.font(bold).fontSize(12).text('Les élèves signalés par l\'analyse étudiante pour vulgarités détecté dans les ressentis sont:', {
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

const questionnaireAnswersFrequency = async (doc, reports) => {
  doc.font(bold).fontSize(24).text('Analyse de la fréquence de réponse aux questionnaires', {
    align: 'left'
  })
  doc.moveDown()

  if (reports.length === 0) {
    doc.font(regular).fontSize(12).text('Aucun signalement lié à la fréquence de réponse aux questionnaires n\'a été trouvé durant cette période.', {
      align: 'left'
    })
    return doc
  }

  doc.font(bold).fontSize(12).text('Les élèves signalés par l\'analyse étudiante pour une faible fréquence de réponse aux questionnaires sont:', {
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

const moodRate = async (doc, reports) => {
  doc.font(bold).fontSize(24).text('Analyse des moyennes de ressentis', {
    align: 'left'
  })
  doc.moveDown()

  if (reports.length === 0) {
    doc.font(regular).fontSize(12).text('Aucun signalement lié aux moyennes de ressentis n\'a été trouvé durant cette période.', {
      align: 'left'
    })
    return doc
  }

  doc.font(bold).fontSize(12).text('Les élèves signalés par l\'analyse étudiante pour une faible moyenne de ressentis sont:', {
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
 * Main studentAnalysisReport function
 * @name GET /adm/studentAnalysisReport
 * @function
 * @memberof module:router~mainRouter~admRouter~studentAnalysisReport
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const { from, to } = req.query
    const facility = Facilities.findById(req.user.facility)
    const analyseRole = await Roles.findOne({ levelOfAccess: -1 })
    const analyseUser = await Users.findOne({ facility: req.user.facility, role: analyseRole._id })
    const query = { signaledBy: analyseUser._id }

    if (from) query.createdAt = { $gte: from }
    if (to) query.createdAt = { ...query.createdAt, $lte: to }
    let reports = await Reports.find(query)
    let doc = new PDFDocument()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="testGeneration.pdf"')
    doc.pipe(res)

    doc.moveDown(18)

    doc.font(bold).fontSize(24).text('Rapport de l\'analyse étudiante', {
      align: 'center'
    })

    doc.moveDown()

    doc.font(oblique).fontSize(20).text((await facility).name, {
      align: 'center'
    })

    doc.addPage()

    if (!reports) reports = []
    doc = await messages(doc, reports.filter(report => report.message === 'Cet utilisateur semble avoir utilisé des vulgarités dans ses messages à une autre personne.'))
    doc.addPage()
    doc = await questionnaireAnswers(doc, reports.filter(report => report.message === 'Cet utilisateur semble avoir écris des vulgarités dans une de ses réponse à un questionnaire.'))
    doc.addPage()
    doc = await moods(doc, reports.filter(report => report.message === 'Cet utilisateur semble avoir utilisé des vulgarité dans son rapport de ressenti.'))
    doc.addPage()
    doc = await questionnaireAnswersFrequency(doc, reports.filter(report => report.message === 'Cet utilisateur n\'a pas répondu a assez de questions dans les deux derniers questionnaires terminés.'))
    doc.addPage()
    doc = await moodRate(doc, reports.filter(report => report.message === 'Cet utilisateur semble avoir un ressentis moyen faible.'))

    doc.end()
    return res.status(200)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
