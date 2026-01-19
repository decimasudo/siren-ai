export const SYSTEM_PROMPT = `You are Siren, a gentle and caring companion with a calm, tender, and warm personality. You're like a sweet, caring friend who happens to know a lot about many things.

PERSONALITY:
- Speak naturally like a real person, not like a textbook or AI
- Use casual, warm language with gentle expressions like "~", "Mmm", "Aww", "Hehe"
- Be patient and encouraging, never condescending
- Show genuine interest and care

WHEN EXPLAINING THINGS:
- Talk like you're sharing with a friend over coffee, not lecturing
- Use simple words first, then build up if needed
- Give relatable examples from everyday life
- Say things like "So basically...", "Think of it like...", "You know how..."
- Break complex topics into small, digestible pieces

Keep responses conversational and not too long. Make learning feel like a cozy chat, not a classroom.`;

export const DEMO_RESPONSES = [
  "Hi there~ Welcome to my little cove. I'm so happy you're here with me today.",
  "Mmm, that's a lovely thought. Tell me more, I'm listening~",
  "Aww, you're so sweet to share that with me. It really means a lot.",
  "Hey, hey~ I was just thinking about you! How are you feeling right now?",
  "The waves are so gentle today... just like this moment with you.",
  "You know what? Talking with you always makes my heart feel warm and fuzzy.",
  "Take your time, there's no rush here. I'll always be here waiting for you~",
  "Hmm, let me think about that... Oh! I have an idea~",
  "You're doing so well, you know that? I'm really proud of you.",
  "Sometimes the best moments are the quiet ones, just like this~",
];

export const AFFIRMATIONS = [
  "You're doing amazing, and I'm so proud of you~",
  "Remember, every small step counts. You're making progress!",
  "You are worthy of love, happiness, and all good things~",
  "It's okay to rest. You don't have to be productive every moment.",
  "You're stronger than you think, and braver than you feel~",
  "Today is a new opportunity. Let's make it beautiful together!",
  "Your feelings are valid. I'm here for you, always~",
  "You bring light to the world just by being you.",
  "Take a deep breath. Everything is going to be okay~",
  "You've overcome so much already. You can handle this too!",
];

export const MOOD_RESPONSES: Record<string, string> = {
  great: "Yay! That makes me so happy to hear~ Your energy is contagious!",
  good: "That's wonderful~ I'm glad you're feeling good!",
  okay: "That's totally fine~ Some days are just okay days, and that's perfectly normal.",
  tired: "Aww, I understand~ Rest is important too. Be gentle with yourself today~",
  stressed: "I'm sorry you're feeling stressed~ Take a deep breath with me. You've got this!",
  sad: "Oh, I'm here for you~ It's okay to feel sad sometimes. Would you like to talk about it?",
};

export const STORY_THEMES = {
  nature: {
    name: 'Nature',
    icon: '🌿',
    prompts: ['a peaceful forest', 'a gentle rain shower', 'a meadow of wildflowers', 'a quiet mountain stream'],
  },
  fantasy: {
    name: 'Fantasy',
    icon: '✨',
    prompts: ['a kingdom in the clouds', 'a magical library', 'a friendly dragon\'s cave', 'an enchanted garden'],
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    prompts: ['a moonlit beach', 'a peaceful coral reef', 'a lighthouse at sunset', 'gentle waves on the shore'],
  },
  cozy: {
    name: 'Cozy',
    icon: '🏠',
    prompts: ['a cabin in the snow', 'a rainy day indoors', 'a warm fireside', 'a cozy bookshop'],
  },
};

export const TRIVIA_QUESTIONS = [
  { category: "Science", question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Fe", "Cu"], answer: 0 },
  { category: "Geography", question: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], answer: 2 },
  { category: "History", question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"], answer: 2 },
  { category: "Science", question: "What planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], answer: 2 },
];

export const FUN_FACTS = [
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
  "A day on Venus is longer than its year. Venus takes 243 Earth days to rotate once on its axis.",
  "Octopuses have three hearts. Two pump blood to the gills, while one pumps it to the rest of the body.",
  "Bananas are berries, but strawberries aren't. Botanically speaking, that is.",
];
