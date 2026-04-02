import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'

const dbDir = path.join(process.cwd(), 'data')
const dbFile = path.join(dbDir, 'ngl.db')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbFile)

db.prepare(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id TEXT PRIMARY KEY,
    q1 TEXT NOT NULL,
    q2 TEXT NOT NULL,
    q3 TEXT NOT NULL,
    q4 TEXT NOT NULL,
    q5 TEXT NOT NULL,
    q6 TEXT NOT NULL,
    timestamp TEXT NOT NULL
  )
`).run()

interface Feedback {
  id: string
  feedback: {
    q1: string
    q2: string
    q3: string
    q4: string
    q5: string
    q6: string
  }
  timestamp: string
}

export async function POST(request: NextRequest) {
  const { feedback } = await request.json()

  if (!feedback || Object.values(feedback).some((value: any) => !value || !value.toString().trim())) {
    return NextResponse.json({ error: 'All questions are required' }, { status: 400 })
  }

  const id = Date.now().toString()
  const timestamp = new Date().toISOString()

  db.prepare(
    `INSERT INTO feedbacks (id, q1, q2, q3, q4, q5, q6, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, feedback.q1, feedback.q2, feedback.q3, feedback.q4, feedback.q5, feedback.q6, timestamp)

  return NextResponse.json({ success: true })
}

export async function GET() {
  const rows = db.prepare(`SELECT * FROM feedbacks ORDER BY timestamp ASC`).all()
  const feedbacks: Feedback[] = rows.map((row: any) => ({
    id: row.id,
    feedback: {
      q1: row.q1,
      q2: row.q2,
      q3: row.q3,
      q4: row.q4,
      q5: row.q5,
      q6: row.q6
    },
    timestamp: row.timestamp
  }))

  return NextResponse.json(feedbacks)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  const result = db.prepare(`DELETE FROM feedbacks WHERE id = ?`).run(id)

  if (result.changes === 0) {
    return NextResponse.json({ error: 'Feedback not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}