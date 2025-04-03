import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

function loadPrompts() {
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

export { loadPrompts };
