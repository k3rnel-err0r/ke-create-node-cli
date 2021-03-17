const ora = require('ora');
const execa = require('execa');
const path = require('path');
const copy = require('copy-template-dir');
const { green: g, dim: d, yellow: y } = require('chalk');
const alert = require('ke-cli-alerts');

const spinner = ora({ text: '' });
const questions = require('./questions');

module.exports = async () => {
    const vars = await questions();

    const inDirPath = path.join(__dirname, '../template');
    const outDirPath = path.join(process.cwd(), vars.name);

    copy(inDirPath, outDirPath, vars, async (err, createdFiles) => {
        if (err) throw err;

        console.log(d(`\nCreating files in ${g(`./${vars.name}`)}\n`));

        createdFiles.forEach(filePath => {
            const fileName = path.basename(filePath);
            console.log(`${g(`Created`)} ${fileName}`);
        });

        spinner.start(
            `\n${y('DEPENDENCIES')} installing... \n\n${d(
                'It may take a moment...'
            )}`
        );
        process.chdir(outDirPath);

        const pkgs = [
            'chalk',
            'cli-handle-error',
            'cli-handle-unhandled',
            'cli-meow-help',
            'cli-welcome',
            'ke-cli-alerts',
            'meow'
        ];

        await execa('npm', ['install', ...pkgs]);
        await execa('npm', ['install', 'prettier', '-D']);
        await execa('npm', ['dedupe']);
        spinner.succeed(`${g('DEPENDENCIES')} installed!`);

        alert({
            type: `success`,
            name: `ALL DONE!`,
            msg: `\n\n${createdFiles.length} files created in ${d(
                `./${vars.name}`
            )} directory`
        });
    });
};
