import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'

import { fetchCats } from './api'

const app = express()
app.use(cors())
const port = 3000

app.get('/cats', (req, res) => {
  const db = new sqlite3.Database('./backend/database/cats.db', (err) => {
    if (err) {
      console.error(err.message)
      res.status(500).send('Database connection error')
      return
    }
  })

  db.all('SELECT * FROM cats', [], (err, rows) => {
    if (err) {
      console.error(err.message)
      res.status(500).send('Error fetching cats')
      return
    }
    res.json(rows)
  })

  db.close((err) => {
    if (err) {
      console.error(err.message)
    }
  })
})

app.listen(port, async () => {
  console.log(`Server URL: http://localhost:${port}`)

  const cats = await fetchCats(10)

  const db = new sqlite3.Database('./backend/database/cats.db', (err) => {
    if (err) {
      console.error(err.message)
      return
    }
    console.log('Connected to cats DB')
  })

  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS cats (id TEXT PRIMARY KEY, img_url TEXT, img_width INTEGER, img_height INTEGER)')

    const stmt = db.prepare('INSERT INTO cats (id, img_url, img_width, img_height) VALUES (?, ?, ?, ?)')
    for (const cat of cats) {
      stmt.run(cat.id, cat.url, cat.width, cat.height)
    }
    stmt.finalize()

    console.log('Cats inserted into database')
  })

  db.close((err) => {
    if (err) {
      console.error(err.message)
      return
    }
    console.log('Closed database connection')
  })

  console.log(cats)
})
