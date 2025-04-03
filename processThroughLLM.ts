import { loadExamples } from './loadExamples.ts';
import { loadPrompts } from './loadPrompts.ts';

async function processThroughLLM(initialContent: string) {
    const prompts = loadPrompts();
    const examples = loadExamples();

    const defaultPrompts = Object.entries(prompts).map(([_, value]) => {
        return {
            role: 'system',
            content: value,
        };
    });

    const examplePrompts = Object.entries(examples).map(([_, value], index) => {
        return {
            role: 'system',
            content: `Exemplo ${index}: ${value}`,
        };
    });

    const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.LLM_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat:free',
                messages: [
                    ...defaultPrompts,
                    ...examplePrompts,
                    { role: 'user', content: initialContent },
                ],
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Erro: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content ?? initialContent;
}

export { processThroughLLM };
