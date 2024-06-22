import fs from 'node:fs'
import express from 'express'

const PORT = 3000
const app = express()

const MISSING_PIECE = fs.readFileSync('./missing-piece.js').toString()


app.get('/missing-piece.js', (req, res) => {
  res.setHeader('Content-Type', 'text/javascript')
  res.send(MISSING_PIECE)
})

app.use(express.static('test'))

console.log(`Serving test site on http://localhost:${PORT}`)
app.listen(PORT)
