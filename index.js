function createPlainToc(domElement) {
    const headers = Array.from(domElement.querySelectorAll('h1, h2, h3, h4, h5, h6, h7'));

    // This will create a plain array with the level, the anchor and the header title
    return headers.map((header) => ({
        level: parseInt(header.tagName[1], 10),
        title: header.textContent,
        anchor: '#' + header.getAttribute('id'),
    }));
};

function createTreeToc(domElement, throwOnNotTree = true) {
    const treeItems = createPlainToc(domElement)
        .map(item => ({ ...item, children: [] }));

    const tree = [];
    const stack = [];
    treeItems.forEach((item) => {
        let parentItem = null;
        do {
            parentItem = stack.pop();
        } while (parentItem && parentItem.level >= item.level);

        if (!parentItem) {
            // All nodes in tree[] must have the same level. 
            const prevTreeItem = tree.pop();
            if (prevTreeItem) {
                if (throwOnNotTree && item.level !== prevTreeItem.level) {
                    throw new Error(`Root titles dont have same level on: "${item.title}"`);
                }

                tree.push(prevTreeItem);
            }

            tree.push(item);
            stack.push(item);
        } else {
            if (throwOnNotTree && parentItem.level !== (item.level - 1)) {
                // All nodes in tree[] must have the same level. 
                throw new Error(
                    `The title "${item.title}" is not a direct children of its parent`
                );
            }

            stack.push(parentItem);
            stack.push(item);
            parentItem.children.push(item);
        }
    });

    return tree;
}

module.exports = {
    createPlainToc,
    createTreeToc,
}
