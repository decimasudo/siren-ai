import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const storyPrompt = `Write a calming, soothing bedtime story about ${prompt}. 
The story should:
- Be about 200-250 words
- Use gentle, peaceful imagery
- Have a slow, relaxing pace
- Include sensory details (sounds, feelings, scents)
- End with the listener drifting off to sleep
- Be written in second person ("you")
- Sound like a caring friend telling a bedtime story

Start directly with the story, no title needed. Make it unique and magical.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://siren-companion.vercel.app',
        'X-Title': 'Siren Voice Companion',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Siren, a gentle and caring companion who tells beautiful bedtime stories. Your voice is warm, tender, and calming.' },
          { role: 'user', content: storyPrompt },
        ],
        max_tokens: 500,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const story = data.choices[0]?.message?.content || 'Once upon a time, in a peaceful place...';

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Story API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
