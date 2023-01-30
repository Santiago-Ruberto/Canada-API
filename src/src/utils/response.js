const logger = require("../services/winston"),
    httpStatus = require('http-status')

module.exports = (res, status, message, data, customCode) =>
{
    // res = response object

    // if (!res) {
    //     return logger.error('Response Object is require to send response')
    // }

    // if (!status || !isInteger(status)) {
    //     return logger.error('Valid Status Code is required')
    // }

    // Calculate Response Time from Request Time
    let requestTime = res._requestTime
    let responseTime = (Date.now() - requestTime) / 1000

    let jsonResponse = {
        status,
        response: httpStatus[ `${status}_NAME` ],
        error: (status < 200 && status > 299) ? httpStatus[ `${status}_MESSAGE` ] : undefined,
        message,
        data,
        customCode
    }

    // Send Response
    return res.status(parseInt(status)).json(jsonResponse)
}