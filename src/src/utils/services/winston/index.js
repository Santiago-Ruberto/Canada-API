const winston = require('winston'),
    { winston: winston_logger } = require('../../config/default.json'),
    { name } = require('../../../package.json')

const { combine, label, timestamp, printf } = winston.format;

const fileFormat = winston.format.combine(
    winston.format.json(),
    winston.format.printf(
        info => {
            return `${String(new Date()).toString()}  ${info.level} : ${info.message}`
        }
    ))

let today = () => {
    let now = new Date()
    return `${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`
}

const option = {
    transports: [
        new winston.transports.Console({
            level: winston_logger.level,
            json: true,
            prettyPrint: true,
            format: combine(
                label({ label: name }),
                winston.format.json(),
                timestamp(),
                printf(({ level, message, label, timestamp }) => {
                    return `[${label}] ${String(new Date(timestamp))} ${level}: ${String(message)}`;
                })),
        }),
        new winston.transports.File({
            format: fileFormat,
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV||'no-environment'}/stdout-${today()}.log`,
            json: true
        }),
        new winston.transports.File({
            format: fileFormat,
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV||'no-environment'}/info-${today()}.log`,
            json: true,
            level: 'info'
        }),
        new winston.transports.File({
            format: fileFormat,
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV||'no-environment'}/error-${today()}.log`,
            json: true,
            level: 'error'
        })
    ]
}

const logger = winston.createLogger(option)

module.exports = logger;