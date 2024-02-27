class Logger {
  static displayed = process.env.LOGGER

  static info (...strings) {
    if (this.displayed) {
      strings.forEach((str, index) => {
        console.log((index === 0 ? new Date().toLocaleTimeString() : ''), '\x1b[36m', str, '\x1b[39m')
      })
    }
  }

  static error (...strings) {
    if (this.displayed) {
      strings.forEach((str, index) => {
        console.log((index === 0 ? new Date().toLocaleTimeString() : ''), '\x1b[31m', str, '\x1b[39m')
      })
    }
  }

  static debug (...strings) {
    if (this.displayed) {
      strings.forEach((str, index) => {
        console.log((index === 0 ? new Date().toLocaleTimeString() : ''), '\x1b[35m', str, '\x1b[39m')
      })
    }
  }
}

module.exports = Logger
