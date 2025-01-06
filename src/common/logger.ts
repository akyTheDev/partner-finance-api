import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf, colorize, errors } = format

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`
})

export const logger = createLogger({
  // level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Default log level
  level: 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    errors({ stack: true }), // Include stack trace for errors
    combine(colorize(), customFormat),
    // process.env.NODE_ENV === 'production'
    //   ? format.json()
    //   : combine(colorize(), customFormat), // Colorized for dev
  ),
  transports: [
    new transports.Console(), // Log to console
  ],
})
