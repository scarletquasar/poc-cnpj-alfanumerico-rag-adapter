import * as fs from 'fs';
import * as path from 'path';
import { processThroughLLM } from './processThroughLLM.ts';

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

    async processFiles(): Promise<void> {
        for (const file of this.files) {
            const processedContent = await processThroughLLM(file.content);
            this.newFiles.push({
                path: file.path,
                content: processedContent,
            });
        }
    }

    saveFiles(outputDirectory: string): void {
        console.log(this.newFiles);
        for (const file of this.newFiles) {
            const outputPath = path.join(
                outputDirectory,
                path.relative(this.directory, file.path)
            );
            const outputDir = path.dirname(outputPath);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFileSync(outputPath, file.content, 'utf-8');
        }
    }
}

class ContextFactory {
    static createContext(directory: string): Context {
        return new Context(directory);
    }
}

export { Context, ContextFactory };
