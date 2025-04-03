import 'dotenv/config';
import { ContextFactory } from './createContext.ts';

async function main() {
    const context = ContextFactory.createContext('./input');
    await context.processFiles();
    context.saveFiles('./output');
}

main();
