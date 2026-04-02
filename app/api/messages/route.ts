import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

  const { error } = await supabase
    .from('feedbacks')
    .insert({
      id,
      q1: feedback.q1,
      q2: feedback.q2,
      q3: feedback.q3,
      q4: feedback.q4,
      q5: feedback.q5,
      q6: feedback.q6,
      timestamp
    })

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  const { data, error } = await supabase
    .from('feedbacks')
    .select('*')
    .order('timestamp', { ascending: true })

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 })
  }

  const feedbacks: Feedback[] = data.map((row: any) => ({
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

  const { error } = await supabase
    .from('feedbacks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}