/**
 * This is a little server to support local development and proxying of requests to external APIs that have tight CORS rules
 */

import express from 'express'

const app = express()
const port = 9000

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

app.get('/hydro1/*', (req, res) => {
    // get the actual URL to hydro1, we'll access it from the backend to get around CORS
    const url =
        'https://hydro1.gesdisc.eosdis.nasa.gov' + req.url.replace('/hydro1', '')

    fetch(url)
        .then(res => res.text())
        .then(text => {
            res.send(text)
        })
        .catch(err => {
            console.error(err)
            res.send('Failed to fetch')
        })
})

app.get('/variables', (req, res) => {
    fetch('https://dev.gesdisc.eosdis.nasa.gov/~baforshe/collection+variable.json')
        .then(res => res.json())
        .then(text => {
            res.send(text)
        })
        .catch(err => {
            console.error(err)
            res.send('Failed to fetch')
        })
})

app.listen(port, '127.0.0.1', () => {
    console.log('Server is running on http://127.0.0.1:' + port)
})
