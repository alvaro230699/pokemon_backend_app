const { createLogger, format, transports } = require('winston')
const { combine, label, timestamp, printf, colorize } = format

const myFormat = printf(({ level, label, message, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})
const pokemonLogger = () => {
  return createLogger({
    level: 'debug',
    format: combine(
      colorize(),
      label({ label: 'Development' }),
      timestamp({ format: 'HH:mm:ss' }),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'error.log', level: 'error' })
    ]
  })
}

module.exports = pokemonLogger
