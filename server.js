const path = require('path')
const express = require('express')
const app = express()

const baseDir = path.join(__dirname, 'dist')
app.use(express.static(`${baseDir}`))
app.get('*', (req,res) => res.sendFile('index.html' , { root : baseDir }))

//const PORT = process.env.PORT || 3000
const PORT = '0.0.0.0'
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})