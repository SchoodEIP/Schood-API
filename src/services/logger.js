class Logger {
  static displayed = process.env.LOGGER === 'true'

  static info (str) {
    if (this.displayed) console.log((new Date().toLocaleTimeString()), '\x1b[36m', str, '\x1b[39m')
  }

  static error (str) {
    if (this.displayed) console.log((new Date().toLocaleTimeString()), '\x1b[31m', str, '\x1b[39m')
  }

  static debug (str) {
    if (this.displayed) console.log((new Date().toLocaleTimeString()), '\x1b[35m', str, '\x1b[39m')
  }
}

module.exports = Logger
