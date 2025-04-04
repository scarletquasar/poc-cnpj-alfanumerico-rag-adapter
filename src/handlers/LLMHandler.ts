import axios, { type AxiosRequestConfig } from 'axios';

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

        const maxRetries = 5;
        const timeout = 1000;
        const attemptRequest = async (attempt: number): Promise<string> => {
            try {
                console.log(`Tentativa ${attempt + 1} de ${maxRetries}...`);
                const config: AxiosRequestConfig = {
                    method: 'POST',
                    url: 'https://openrouter.ai/api/v1/chat/completions',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    data: {
                        model: this.model,
                        messages: [
                            ...defaultPrompts,
                            ...examplePrompts,
                            { role: 'user', content: message },
                        ],
                    },
                    timeout,
                };

                const response = await axios(config);

                return response.data.choices[0].message.content ?? message;
            } catch (error: any) {
                console.error(
                    `Tentativa ${attempt + 1} falhou: ${error.message}`
                );
                if (attempt >= maxRetries - 1) {
                    throw new Error(
                        `Falhou após ${maxRetries} tentativas: ${error}`
                    );
                }
                return attemptRequest(attempt + 1);
            }
        };

        return attemptRequest(0);
    }
}

export { type LLMHandler, OpenRouterLLMHandler };
