/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace studentAnalysisIndividualReport
 */

const PDFDocument = require('pdfkit')
const { Facilities } = require('../../models/facilities')
const { Users } = require('../../models/users')
const { Roles } = require('../../models/roles')
const { Reports } = require('../../models/reports')
const mongoose = require('mongoose')
const { Chats } = require('../../models/chat')

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

/**
 * Main studentAnalysisIndividualReport function
 * @name GET /adm/studentAnalysisIndividualReport
 * @function
 * @memberof module:router~mainRouter~admRouter~studentAnalysisIndividualReport
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
