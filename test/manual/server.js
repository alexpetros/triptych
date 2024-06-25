import fs from 'node:fs'
import express from 'express'

const PORT = 3000
const app = express()

const MISSING_PIECE = fs.readFileSync('./triptych.js').toString()


app.get('/simple-page', (_req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`
    <!DOCTYPE html>
    <title>Simple Page</title>
    <h1>Simple Page</h1>
    <p>There's not a lot going on here</p>
    <script>document.body.innerHTML+= '<p>But scripts execute properly' </script>
  `)
})

app.get('/triptych.js', (_req, res) => {
  res.setHeader('Content-Type', 'text/javascript')
  res.send(MISSING_PIECE)
})

app.all('/redirect/simple-page', (_req, res) => {
  res.setHeader('location', '/simple-page')
  res.sendStatus(303)
})

app.put('/redirect/303', (_req, res) => {
  res.setHeader('location', '/responses/text.html')
  res.sendStatus(303)
})

app.use(express.static('test/manual'))

console.log(`Serving test site on http://localhost:${PORT}`)
app.listen(PORT)
