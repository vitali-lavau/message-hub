// services/chatGPTService.ts
import axios from 'axios';

const API_KEY = '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';

export async function fetchBotResponse(userMessage: string) {
    try {
        // Задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 500)); // Задержка 500мс между запросами

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Ошибка при запросе к OpenAI API:", error);
        return "Извините, я не смог ответить на ваш вопрос.";
    }
}
