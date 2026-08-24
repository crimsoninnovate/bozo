import { llmsTxt } from '@/lib/llmsTxt'

export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  return new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
