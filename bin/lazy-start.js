#!/usr/bin/env node

const http = require('http');
const minimist = require('minimist');
const { spawn } = require('child_process');

const args = minimist(process.argv.slice(2));

const port = parseInt(args.p || args.port || '80', 10);
const command = args._;
const detached = Boolean(args.d || args.detached || false);
const refresh = parseInt(args.r || args.refresh || '10', 10);
const timeout = (args.t || args.timeout) ? parseInt(args.t || args.timeout, 10) : false;
const hasTimeout = timeout && Number.isInteger(timeout);

const help = () => {
    console.log(`
NAME
    lazy-start - Lazily start a web server the first time it is requested

SYNOPSIS
    lazy-start [<options>] <command>

OPTIONS
    -p, --port      Port to listen (default: 80)
    -d, --detached  Run the command in detached mode (default: false)
    -r, --refresh   Time in seconds before page refresh (default: 10)
    -t, --timeout   Run the command anyway after defined timeout in seconds (default: false)

EXAMPLES
    lazy-start yarn start
    lazy-start -p 3000 react-scripts start
    NODE_ENV=test lazy-start -t 120 cpu-intensive.sh
    lazy-start -t $(shuf -i 60-300 -n 1) run-in-random-between-1-and-5-minutes.py
    DISABLE_LAZY_START=true lazy-start run-immediate
    `);
};

if (!Number.isInteger(port)) {
    console.error('Invalid port: -p, --port option only accepts integer');
    process.exit(1);
}

if (!Number.isInteger(refresh)) {
    console.error('Invalid refresh: -r, --refresh option only accepts integer');
    process.exit(1);
}

if (command.length === 0) {
    help();
    process.exit();
}

const runCommand = () => {
    const cmd = spawn(command[0], command.slice(1), {
        env: process.env,
        detached,
    });

    cmd.stdout.pipe(process.stdout);
    cmd.stderr.pipe(process.stderr);
    cmd.stdin.pipe(process.stdin);

    cmd.on('close', (code) => {
        process.exit(code);
    })
};

if (process.env.DISABLE_LAZY_START) {
    runCommand();
    return;
}

const page = `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>lazy-start</title>
        <meta http-equiv="refresh" content="${refresh}" />
    </head>
    <body>
        <p>
            Command running:
            <pre>$ ${command.join(' ')}</pre>
            Refreshing the page in ${refresh} seconds. <a href="">Refresh now</a>
        </p>
    </body>
</html>
`;

let started = false;
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(page);

    if (!started) {
        started = true;
        start();
    }
});

let timeoutRef;
const start = () => {
    if (timeoutRef) {
        clearTimeout(timeoutRef)
    }
    console.log(`running ${command.join(' ')}`)
    runCommand();
    server.close();
};

if (hasTimeout) {
    timeoutRef = setTimeout(start, timeout * 1000);
}

server.listen(port, () => {
    console.log(`waiting to run '${command.join(' ')}' on port ${port}`);
    if (hasTimeout) {
        console.log(`or it will be run in ${timeout} seconds anyway`);
    }
});
