const BOT_RESPONSE_DELAY = 700;

const keywordResponses: Array<{
    keywords: string[];
    response: string;
}> = [
    {
        keywords: ['hello', 'hi', 'hey'],
        response:
            'Hi! I am the Message Hub demo bot. Ask me about the project, channels, or frontend stack.',
    },
    {
        keywords: ['project', 'message hub', 'portfolio'],
        response:
            'Message Hub is a frontend-only messenger demo built with Nuxt, Vue, TypeScript, and Pinia.',
    },
    {
        keywords: ['stack', 'vue', 'nuxt', 'typescript'],
        response:
            'The demo uses Nuxt 3, Vue 3, TypeScript, Pinia, SCSS, Tiptap, and virtual scrolling.',
    },
    {
        keywords: ['channel', 'group'],
        response:
            'Channels help teams keep discussions organized. You can create one and choose its members from the sidebar.',
    },
    {
        keywords: ['help', 'what can you do'],
        response:
            'Try sending messages, editing them, adding reactions, searching contacts, or creating a demo channel.',
    },
];

const fallbackResponses = [
    'That is a good point. In this demo, my replies are generated locally without contacting an external API.',
    'I am a deterministic mock bot, so the project remains safe and works without a backend.',
    'Thanks for the message! This conversation is saved locally in your browser.',
];

function selectFallbackResponse(message: string): string {
    const checksum = [...message].reduce((total, character) => total + character.charCodeAt(0), 0);
    return fallbackResponses[checksum % fallbackResponses.length] ?? fallbackResponses[0] ?? '';
}

function includesKeyword(message: string, keyword: string): boolean {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escapedKeyword}(?=$|[^a-z0-9])`, 'i').test(message);
}

export async function getMockBotResponse(userMessage: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, BOT_RESPONSE_DELAY));

    const normalizedMessage = userMessage.toLowerCase();
    const matchedResponse = keywordResponses.find(({ keywords }) =>
        keywords.some((keyword) => includesKeyword(normalizedMessage, keyword))
    );

    return matchedResponse?.response ?? selectFallbackResponse(normalizedMessage);
}
