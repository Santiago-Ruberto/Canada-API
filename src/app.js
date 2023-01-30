const express = require('express'),
    app = express(),
    httpStatus = require('http-status'),
    response = require('./src/utils/response'),
    packageInfo = require('./package.json'),
    mongoose = require('mongoose'),
    cors=require('cors');

require('dotenv').config({ override: false })

require('./src/services/mongoose')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

app.use(express.json(),express.urlencoded({ extended: true }),cors(corsOptions))


//Import router
const routes=require('./src/routes/index.js');
app.use(routes);

const serverUpTime = new Date()
app.get('/', (req,res) => {
    return res.status(httpStatus.OK).json({
        message: "Health: OK",
        app: packageInfo.name,
        database_status: mongoose.STATES[mongoose.connection.readyState],
        version: packageInfo.version,
        description: packageInfo.description,
        environment: process.env.NODE_ENV,
        time_info: {
            timezone: serverUpTime.toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4),
            server_uptime: { Date: serverUpTime, locale_string: serverUpTime.toLocaleString() },
            server_time: { Date: new Date(), locale_string: new Date().toLocaleString() }
        }
    })
});




app.use((req, res) => { return response(res, httpStatus.METHOD_NOT_ALLOWED, 'Invalid API/Method. Please check HTTP Method.') })
module.exports = app;