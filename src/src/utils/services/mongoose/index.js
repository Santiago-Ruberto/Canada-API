const mongoose = require('mongoose'),
    logger = require('../winston')

if (!process.env.MONGO_URI) {
    logger.error('Secrets [Mongoose]: srv not found')
}

try {
    mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }, (error) => {
        if (error) {
            logger.error('Service [Mongoose]: ', error)
        } else
         logger.info('Service [Mongoose]: Connected') ;
         
    })
} catch (error) {
    logger.error('Service [Mongoose]: ' + error)
}

const conn = mongoose.connection;
module.exports = conn;