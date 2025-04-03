interface LLMHandler {
    sendMessage(
        message: string,
        prompts: Record<string, string>,
        examples: Record<string, string>
    ): Promise<string>;
}

class OpenRouterLLMHandler implements LLMHandler {
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string) {
        this.apiKey = apiKey;
        this.model = model;
    }

    async sendMessage(
        message: string,
        prompts: Record<string, string>,
        examples: Record<string, string>
    ): Promise<string> {
        const defaultPrompts = Object.entries(prompts).map(([_, value]) => {
            return {
                role: 'system',
                content: value,
            };
        });

        const examplePrompts = Object.entries(examples).map(
            ([_, value], index) => {
                return {
                    role: 'system',
                    content: `Exemplo ${index}: ${value}`,
                };
            }
        );

        const response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        ...defaultPrompts,
                        ...examplePrompts,
                        { role: 'user', content: message },
                    ],
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content ?? message;
    }
}

export { type LLMHandler, OpenRouterLLMHandler };
