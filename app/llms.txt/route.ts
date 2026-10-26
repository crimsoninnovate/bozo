import { llmsTxt } from '@/lib/llmsTxt'
import { menuBelgesiYukle } from '@/lib/menu/belgeYukle'

export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  return new Response(llmsTxt(menuBelgesiYukle()), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
