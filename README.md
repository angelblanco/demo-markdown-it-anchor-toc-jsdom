# demo-markdown-it-anchor-toc-jsdom
Demo on how to get a table of content form markdown-it using markdown-it-anchor and jsdom with node.

In order to run the demo:

```bash
yarn install
yarn demo
```

![Demo](https://raw.githubusercontent.com/angelblanco/demo-markdown-it-anchor-toc-jsdom/master/demo.gif)

## Note
This is a demo on how to get a toc from a dom node usin Javascript and not a package. One of the usages of this approach could be to render the TOC using a custom component with your template library.

If you want to create automatic tocs with markdown-it you should consider using one of the existing packages [markdow-it-table-of-contents](https://www.npmjs.com/package/markdown-it-table-of-contents), [markdown-it-toc-done-right](https://www.npmjs.com/package/markdown-it-toc-done-right).

If you want to gen a `TOC` on top of your markdown file probably the easier solution is to append it before rendering the markdown.

```javascript
const markdownWithToc = `
[[toc]]
${markdownWithOutToc}
`.trim();

markdownItInstance.use(plugin);
markdownItInstance.render(markdownWithToc);
```

