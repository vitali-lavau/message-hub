import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const [, , configFile, portValue, ...playwrightArguments] = process.argv;

if (!configFile || !portValue) {
    throw new Error('Usage: node scripts/run-browser-suite.mjs <config> <port> [...args]');
}

const projectRoot = resolve(import.meta.dirname, '..');
const port = Number(portValue);
const host = '127.0.0.1';
const baseUrl = `http://${host}:${port}`;
const nuxtCli = resolve(projectRoot, 'node_modules/nuxt/bin/nuxt.mjs');
const playwrightCli = resolve(projectRoot, 'node_modules/@playwright/test/cli.js');
const server = spawn(process.execPath, [nuxtCli, 'dev', `--host=${host}`, `--port=${port}`], {
    cwd: projectRoot,
    stdio: 'ignore',
    windowsHide: true,
});

let interrupted = false;

process.once('SIGINT', () => {
    interrupted = true;
    stopServer();
});

try {
    await waitForServer();

    const testProcess = spawn(
        process.execPath,
        [playwrightCli, 'test', `--config=${configFile}`, ...playwrightArguments],
        {
            cwd: projectRoot,
            stdio: 'inherit',
            windowsHide: true,
        }
    );
    const testExitCode = await waitForExit(testProcess);
    process.exitCode = interrupted ? 130 : (testExitCode ?? 1);
} finally {
    stopServer();
}

async function waitForServer() {
    const deadline = Date.now() + 120_000;

    while (Date.now() < deadline) {
        if (server.exitCode !== null) {
            throw new Error(`Nuxt dev server exited with code ${server.exitCode}.`);
        }

        try {
            const response = await fetch(baseUrl);

            if (response.ok) {
                return;
            }
        } catch {
            // The server is still starting.
        }

        await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    }

    throw new Error(`Nuxt dev server did not become ready at ${baseUrl}.`);
}

function waitForExit(childProcess) {
    return new Promise((resolveExit) => {
        childProcess.once('exit', resolveExit);
    });
}

function stopServer() {
    if (!server.pid || server.exitCode !== null) {
        return;
    }

    server.kill('SIGTERM');
    server.unref();
}
