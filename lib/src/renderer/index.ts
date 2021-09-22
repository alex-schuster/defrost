import { captureVariablesRegex } from '../parser/regex';

/**
 * Render a template.
 * @param {string} template - The template to be rendered.
 * @param {object} data - The data to be used to render the template.
 * @return {string} The rendered template.
 */
export function render(template: string, data: object): string {
  const matches = [...template.matchAll(captureVariablesRegex)];
  return matches.reduce((acc: string, match: RegExpMatchArray) => {
    const returnValue = acc.replace(match[0], data[match[1]]);
    return returnValue;
  }, template);
}

/**
 * Render a node.
 * @param {Node} node - The node to be rendered.
 * @param {string} template - The template to be used to render the node.
 */
export function renderNode(node: Node, template: string, data: object): void {
  node.nodeValue = render(template, data);
}
