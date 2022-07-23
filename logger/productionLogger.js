const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, colorize } = format

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})
const productionLogger = () => {
  return createLogger({
    level: 'info',
    format: combine(
      colorize(),
      timestamp(),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'error.log', level: 'error' })
    ]
  })
}

module.exports = productionLogger
