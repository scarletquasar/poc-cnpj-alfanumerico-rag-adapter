import 'dotenv/config';
import { ContextFactory } from './Context.ts';
import { execSync } from 'child_process';
import { existsSync, readdirSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

function copyDirectorySync(src: string, dest: string) {
    if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
    }

    const entries = readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectorySync(srcPath, destPath);
        } else if (entry.isFile()) {
            copyFileSync(srcPath, destPath);
        }
    }
}

async function main() {
    const args = process.argv.slice(2);
    const repoUrl = args[0];
    const inputDir = './input';
    let branchCreated = false;
    let dataProcessed = false;

    if (repoUrl) {
        const gitFolderPath = join(inputDir, '.git');
        if (existsSync(gitFolderPath)) {
            console.log('Removing .git folder.');
            try {
                execSync(`rm -rf ${gitFolderPath}`, {
                    stdio: 'ignore',
                });
            } catch {
                if (existsSync(gitFolderPath)) {
                    execSync(`Remove-Item -Recurse -Force "${gitFolderPath}"`, {
                        shell: 'powershell.exe',
                        stdio: 'ignore',
                    });
                }
            }
        }

        if (existsSync(inputDir)) {
            console.log('Diretório input não está vazio, apagando conteúdo.');
            try {
                if (process.platform === 'win32') {
                    execSync(`Remove-Item -Recurse -Force ${inputDir}`, {
                        shell: 'powershell.exe',
                        stdio: 'ignore',
                    });
                } else {
                    execSync(`rm -rf ${inputDir}`, { stdio: 'ignore' });
                }
            } catch (error) {
                console.error('Erro ao apagar o diretório input:', error);
            }
        }

        mkdirSync(inputDir, { recursive: true });

        try {
            console.log(`Cloning repository: ${repoUrl}`);
            execSync(`git clone ${repoUrl} .`, {
                cwd: inputDir,
                stdio: 'inherit',
            });
        } catch (error) {
            console.error('Error cloning repository:', error);
            return;
        }

        try {
            console.log('Verificando default branch (master ou main).');
            const defaultBranch = execSync(
                'git symbolic-ref refs/remotes/origin/HEAD',
                { cwd: inputDir }
            )
                .toString()
                .trim()
                .split('/')
                .pop();

            const newBranchName = `feature/cpfCnpjAlfanumerico_${randomUUID().replace(
                /-/g,
                ''
            )}`;
            console.log(`Criando branch: ${newBranchName}`);
            execSync(`git checkout -b ${newBranchName} ${defaultBranch}`, {
                cwd: inputDir,
                stdio: 'inherit',
            });

            console.log('Pushing branch to remote.');
            execSync(`git push -u origin ${newBranchName}`, {
                cwd: inputDir,
                stdio: 'inherit',
            });

            branchCreated = true;
        } catch (error) {
            console.error('Um erro ocorreu ao criar a branch:', error);
            return;
        }
    }

    let processedResult: string[] = [];
    if (branchCreated) {
        try {
            const context = ContextFactory.createContext('./input');
            processedResult = await context.processFiles('./output');
            dataProcessed = true;
        } catch (error) {
            console.error('Erro ao processar os dados:', error);
            return;
        }
    }

    if (branchCreated && dataProcessed) {
        try {
            console.log(
                'Copiando arquivos da pasta output para a pasta input.'
            );
            copyDirectorySync('./output', './input');

            console.log('Arquivos copiados com sucesso.');

            console.log('Gerando commit com atualizações.');
            const commitMessageTitle =
                'chore: atualização para CNPJ alfanumérico';
            const commitMessageDescription = processedResult.join('\n');

            execSync(`git add . -f`, { cwd: inputDir, stdio: 'inherit' });
            execSync(
                `git commit -m "${commitMessageTitle}" -m "${commitMessageDescription}"`,
                { cwd: inputDir, stdio: 'inherit' }
            );

            console.log('Commit realizado.');

            console.log('Realizando push.');
            execSync(`git push`, { cwd: inputDir, stdio: 'inherit' });
        } catch (error) {
            console.error('Erro criando o commit:', error);
        }
    }
}

main();
