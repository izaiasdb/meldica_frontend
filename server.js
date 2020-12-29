const path = require('path')
const express = require('express')
const app = express()

const baseDir = path.join(__dirname, 'dist')
app.use(express.static(`${baseDir}`))
app.get('*', (req,res) => res.sendFile('index.html' , { root : baseDir }))

// https://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
// https://help.heroku.com/P1AVPANS/why-is-my-node-js-app-crashing-with-an-r10-error
// const PORT = process.env.PORT || 3000 // Antes heroku
// //const PORT = '0.0.0.0' || 3000
// app.listen(PORT, () => {
//     console.log(`App listening to ${PORT}....`)
//     console.log('Press Ctrl+C to quit.')
// })

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
server.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});