import * as fs from 'fs';
import * as path from 'path';
import { OpenRouterLLMHandler } from './handlers/LLMHandler.ts';
import { LocalKnowledgeHandler } from './handlers/KnowledgeHandler.ts';

type File = {
    path: string;
    content: string;
};

class Context {
    private files: File[];
    private newFiles: File[];
    private directory: string;

    constructor(directory: string) {
        this.files = [];
        this.newFiles = [];
        const allowedExtensions = [
            '.cs',
            '.csproj',
            '.sln',
            '.js',
            '.cjs',
            '.mjs',
            '.json',
            '.csv',
            '.sql',
            '.go',
            '.mod',
            '.md',
            '.resx',
        ];

        const loadFiles = (dir: string) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    loadFiles(fullPath);
                } else if (
                    entry.isFile() &&
                    allowedExtensions.includes(path.extname(entry.name))
                ) {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    this.files.push({
                        path: fullPath,
                        content: content,
                    });
                }
            }
        };

        this.directory = directory;
        loadFiles(directory);
    }

    async processFiles(outputDirectory: string): Promise<string[]> {
        const llmHandler = new OpenRouterLLMHandler(
            process.env.LLM_API_KEY!,
            'deepseek/deepseek-chat:free'
        );

        const knowledgeHandler = new LocalKnowledgeHandler();

        const clearDirectory = (dir: string) => {
            if (fs.existsSync(dir)) {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        clearDirectory(fullPath);
                        fs.rmdirSync(fullPath);
                    } else {
                        fs.unlinkSync(fullPath);
                    }
                }
            }
        };

        clearDirectory(outputDirectory);

        const amountRelatedToCNPJ = this.files.filter((file) =>
            this.isRelatedToCNPJ(file.content)
        );
        console.log('');
        console.log(
            `(${
                amountRelatedToCNPJ.length
            }) arquivos relacionados a CNPJ encontrados: \n${amountRelatedToCNPJ
                .map((file) => '-> ' + file.path)
                .join('\n')}`
        );
        console.log('');

        const processedFiles: string[] = [];

        for (const file of this.files) {
            if (!this.isRelatedToCNPJ(file.content)) {
                continue;
            }

            console.log(`Processando arquivo: ${file.path}`);
            const processedContent = await llmHandler.sendMessage(
                file.content,
                await knowledgeHandler.getSystemPrompts(),
                await knowledgeHandler.getExamples()
            );

            const outputPath = path.join(
                outputDirectory,
                path.relative(this.directory, file.path)
            );

            const outputDir = path.dirname(outputPath);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFileSync(outputPath, processedContent, 'utf-8');
            processedFiles.push(outputPath);
        }

        return processedFiles;
    }

    private isRelatedToCNPJ(fileContent: string): boolean {
        const cnpjKeywords = [
            'cnpj',
            'cnpjvalidation',
            'cnpjvalidator',
            'validarcnpj',
            'taxid',
            'cpfcnpj',
            'validacnpj',
            'cnpjvalidacao',
        ];

        return cnpjKeywords.some((keyword) =>
            fileContent.toLowerCase().includes(keyword)
        );
    }
}

class ContextFactory {
    static createContext(directory: string): Context {
        return new Context(directory);
    }
}

export { Context, ContextFactory };
