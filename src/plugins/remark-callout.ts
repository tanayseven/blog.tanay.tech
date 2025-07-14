import { visit } from 'unist-util-visit';


const assembleText = (nodes: any): string => {
    if (!Array.isArray(nodes) || nodes.length === 0) {
        return '';
    }
    return nodes.map((child: any) => {
        if (child.type === 'paragraph') {
            return assembleText(child.children);
        } else
        if (child.type === 'text') {
            console.log(`Text node found: ${child.value}`);
            return child.value;
        } else if (child.type === 'inlineCode') {
            return `\`${child.value}\``;
        } else if (child.type === 'link') {
            return `[${child.children.map((c: any) => c.value).join('')}](${child.url})`;
        } else if (child.type === 'strong') {
            return `**${assembleText(child)}**`;
        } else if (child.type === 'emphasis') {
            return `*${assembleText(child)}*`;
        }
        return child.textContent;
    }).join('');
}

export default function remarkCallout() {
    return (tree: Node) => {
        visit(tree, (node: any) => {
            if (node.type === 'containerDirective' && node.name === 'callout') {
                const content = node.children;
                node.type = 'html';
                // node.value = `<pre class="callout">${JSON.stringify(content, null, 2)}</pre>`;
                node.value = `<pre class="callout">${assembleText(content)}</pre>`;
            }
        });
    };
}
