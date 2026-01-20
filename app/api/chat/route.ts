import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { message, history, userName } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // 1. Build the System Prompt
    let currentSystemPrompt = SYSTEM_PROMPT;
    
    // Add User Name context
    if (userName) {
      currentSystemPrompt += `\nThe user's name is ${userName}. Address them by name occasionally.`;
    }

    // 2. CRITICAL: Add Voice-Specific Instructions
    // This tells the LLM to avoid emojis so the voice doesn't read them.
    currentSystemPrompt += `\nIMPORTANT: You are a Voice Assistant. 
    - Do NOT use emojis, emoticons (like :)), or special characters (like ~). 
    - Keep responses concise, warm, and conversational.
    - Do not use markdown lists or bullet points unless necessary, as they are hard to listen to.`;

    const messages = [
      { role: 'system', content: currentSystemPrompt },
      ...history.slice(-8),
      { role: 'user', content: message },
    ];

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
        messages,
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter error:', error);
      return NextResponse.json(
        { error: 'AI service error' },
        { status: 500 }
      );
    }

    const data = await response.json();
    let aiResponse = data.choices[0]?.message?.content || 'Hmm, I couldn\'t think of a response.';

    // 3. Safety Net: Strip emojis just in case the LLM ignores instructions
    aiResponse = aiResponse.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}