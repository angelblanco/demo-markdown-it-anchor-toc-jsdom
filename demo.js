// Demo utils
const chalk = require('chalk');
const jsdom = require('jsdom');
const { log, dir, clear } = console;
const { Confirm } = require('enquirer');
const logJson = text => dir(text, { depth: null });

const exitDemo = () => {
    log(chalk.yellow('Exiting demo. Bye!'));
    process.exit(0);
}

const confirmOrExit = async (message) => {
    return new Confirm({ name: 'question', message, initial: true })
        .run()
        .then((answer) => {
            if (!answer) {
                exitDemo();
            }

            clear();
        })
        .catch(exitDemo);
}

const toc = require('./index');

// Run demo
(async function run() {
    const MarkdownIt = require('markdown-it');

    const md = new MarkdownIt()
        .use(require("markdown-it-anchor"));

    let markdownText = `
# First header
Some content

## Second level header
More content
### Third level header
## Another second level header
`;

    let html = md.render(markdownText);

    const logMarkdown = () => {
        log(chalk.green('Markdown : '));
        log(markdownText);
    };

    const logHtml = () => {
        log(chalk.green('Html : '));
        log(html);
    }

    logHtml();
    logMarkdown();

    // Renders the plain toc if user confirms
    await confirmOrExit('Do you want to get the plain toc of the markdown?');
    let domElement = (new jsdom.JSDOM(html)).window.document;
    logMarkdown();
    log(chalk.green('Plain toc for markdown:'));
    logJson(toc.createPlainToc(domElement));

    // Renders the tree toc if users confirm
    await confirmOrExit('Do you want to get the tree toc of the markdown?');
    logMarkdown();
    log(chalk.green('Tree toc for markdown:'));
    logJson(toc.createTreeToc(domElement));

    await confirmOrExit('Do you want to test a non nested markdown?');

    markdownText = `
# First header
## Second level header
#### I must be an **h3**
`;
    const logFailingToc = () => {
        html = md.render(markdownText);
        domElement = (new jsdom.JSDOM(html)).window.document;

        logHtml();
        logMarkdown();

        try {
            toc.createTreeToc(domElement);
        } catch (err) {
            log(chalk.red(err));
        }
    };

    logFailingToc();
    await confirmOrExit('Do you want to test another "malformed" markdown?');

    markdownText = `
## Im the first and greatest header
# I can't be a sibling if im not an **h2**
`;
    logFailingToc();

    exitDemo();
})();
