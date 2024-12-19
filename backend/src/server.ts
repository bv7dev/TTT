import express from 'express'
import sqlite3 from 'sqlite3'

import { fetchCats } from './api'

const app = express()
const port = 3000

app.get('/cats', (req, res) => {
  res.send('Hello World!') // send all cats from db
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
      stmt.run(cat.id, cat.width, cat.height, cat.url)
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
