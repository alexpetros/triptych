import fs from 'node:fs'
import express from 'express'

const PORT = 3000
const app = express()

const MISSING_PIECE = fs.readFileSync('./triptych.js').toString()


app.get('/triptych.js', (_req, res) => {
  res.setHeader('Content-Type', 'text/javascript')
  res.send(MISSING_PIECE)
})

app.all('/redirect/303', (_req, res) => {
  res.setHeader('location', '/responses/text.html')
  res.sendStatus(303)
})

app.put('/redirect/303', (_req, res) => {
  res.setHeader('location', '/responses/text.html')
  res.sendStatus(303)
})

app.use(express.static('test/manual'))

console.log(`Serving test site on http://localhost:${PORT}`)
app.listen(PORT)
