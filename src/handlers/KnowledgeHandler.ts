import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface KnowledgeHandler {
    getSystemPrompts(): Promise<Record<string, string>>;
    getExamples(): Promise<Record<string, string>>;
}

class LocalKnowledgeHandler implements KnowledgeHandler {
    async getSystemPrompts() {
        const folderPath = './assets/prompts';
        const filesAsText: Record<string, string> = {};

        const files = readdirSync(folderPath);

        files.forEach((file) => {
            const filePath = join(folderPath, file);
            const fileContent = readFileSync(filePath, 'utf-8');
            filesAsText[file] = fileContent;
        });

        return filesAsText;
    }

    async getExamples() {
        const folderPath = './assets/examples';
        const filesAsText: Record<string, string> = {};

        const files = readdirSync(folderPath);

        files.forEach((file) => {
            const filePath = join(folderPath, file);
            const fileContent = readFileSync(filePath, 'utf-8');
            filesAsText[file] = fileContent;
        });

        return filesAsText;
    }
}

export { type KnowledgeHandler, LocalKnowledgeHandler };
