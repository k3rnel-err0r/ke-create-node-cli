#!/usr/bin/env node

const init = require('./utils/init');
const cli = require('./utils/cli');
const generate = require('./utils/generate');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
    init({ clear });

    input.includes('help') && cli.showHelp(0);

    await generate();

    debug && log(flags);
})();
