import Anthropic from '@anthropic-ai/sdk'
import { AISummaryResult } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateNoteSummary(
  title: string,
  content: string
): Promise<AISummaryResult> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze this note and respond with a JSON object only (no markdown, no explanation):

Title: ${title}
Content: ${content}

Respond with exactly this JSON structure:
{
  "summary": "2-3 sentence summary of the note",
  "action_items": ["action 1", "action 2"],
  "suggested_title": "a better title if needed, or the same title if it's already good"
}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  // Strip any accidental markdown code fences
  const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(cleaned) as AISummaryResult
}
