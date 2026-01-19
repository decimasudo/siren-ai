# Siren - Voice Companion

A gentle AI voice companion built with Next.js 14, featuring voice interaction, wellness features, and games.

## Features

### 💬 Companion Mode
- Voice-to-voice conversation with AI
- Push-to-talk microphone input
- Text chat alternative
- Warm, caring AI personality

### 🧘 Thrive Mode
- **Mood Check-in**: Daily emotional wellness tracking
- **Daily Affirmations**: Encouraging messages
- **Sleep Stories**: AI-generated bedtime stories

### 🎮 Play Mode
- **Trivia**: Knowledge quiz with scoring
- **Fun Facts**: Interesting facts spoken by Siren

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenRouter API (supports multiple models)
- **Voice**: Web Speech API (browser-native)

## Getting Started

### Prerequisites
- Node.js 18+
- OpenRouter API key

### Installation

```bash
npm install
```

### Environment Setup

Create `.env.local`:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add `OPENROUTER_API_KEY` environment variable
4. Deploy

## Architecture

```
siren/
├── app/
│   ├── api/
│   │   ├── chat/route.ts    # OpenRouter proxy
│   │   └── story/route.ts   # Story generation
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── chat/               # Chat UI components
│   ├── thrive/             # Wellness features
│   ├── play/               # Games
│   └── ui/                 # Shared components
├── hooks/
│   ├── useVoice.ts         # Web Speech API
│   └── useChat.ts          # Chat state management
├── lib/
│   └── constants.ts        # Prompts, responses
└── types/
    └── index.ts            # TypeScript types
```

## License

MIT
