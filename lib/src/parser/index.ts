import { Extracted, Reactive, VarExtractionAcc } from './types';
import { escapeRegExp, extractedToReactive, removeDuplicateExtracteds } from './utility';
import { renderNode } from '../renderer/index';
import { captureVariablesRegex, matchVariablesRegex } from './regex';

/**
 * Extract variable keys and values found in a string.
 * @param {string} rendering - The string containing the rendered variables.
 * @param {string} template - The template to be used to parse the rendering.
 * @return {Array<Extracted>} The extracted variables.
 */
export function parseSimpleString(rendering: string, template: string): Array<Extracted> {
  const matches = [ ...template.matchAll(captureVariablesRegex) ];
  const templateSections = template.split(matchVariablesRegex);

  const aux = templateSections.reduce((acc: VarExtractionAcc, substr: string, index: number) => {
    const variableMatch = matches[index];
    const followingSubstr = templateSections[index + 1];

    if (!variableMatch || followingSubstr === undefined) {
      return acc;
    }

    const variable = variableMatch[1];
    const hasType = !!variableMatch[3];
    const type = (hasType === true) ? variableMatch[3] : 'string';
    const regExpDefault = `^${escapeRegExp(substr)}(.*?)${escapeRegExp(followingSubstr)}.*$`;
    const regExpFinal = `^${escapeRegExp(substr)}(.*)`;
    const regExp = followingSubstr === '' ? new RegExp(regExpFinal) : new RegExp(regExpDefault);
    const match = acc.remainder.match(regExp);

    if (!match) {
      return acc;
    }

    const value = (type === 'string') ? match[1] : Number.parseFloat(match[1]);

    return {
      vars: [ ...acc.vars, { key: variable, value } ],
      remainder: acc.remainder.replace(`${substr}${match[1]}`, '')
    };
  }, { vars: [], remainder: rendering });

  return removeDuplicateExtracteds(aux.vars);
}

/**
 * Get an object of rendered variables within a node.
 * @param {Node} renderingNode - The rendered version of the node.
 * @param {Node} templateNode - The rendered node's template.
 * @param {Array<Reactive>} [data=[]] - Data to be merged into the node's own associated data.
 * @return {Array<Reactive>} The node's associated data (potentially merged with provided existing data).
 */
export function parseNode(renderingNode: Node, templateNode: Node, data: Array<Reactive> = []): Array<Reactive> {
  if (templateNode.nodeType === Node.TEXT_NODE || templateNode.nodeType === Node.ATTRIBUTE_NODE) {
    const renderFunction = (renderData: object) => {
      renderNode(renderingNode, templateNode.nodeValue, renderData);
    };
    const extractedData = parseSimpleString(renderingNode.textContent, templateNode.textContent);
    const reactiveExtractedData = extractedData.map((item) => extractedToReactive(item, renderFunction));
    return [ ...data, ...reactiveExtractedData ];
  }

  if (templateNode.nodeType === Node.ELEMENT_NODE) {
    // Attributes
    const templateElement = templateNode as Element;
    const renderingElement = renderingNode as Element;
    const templateAttributes = Array.from(templateElement.attributes);
    const renderingAttributes = Array.from(renderingElement.attributes);
    const dataWithAttributes = templateAttributes.reduce((acc: Array<Reactive>, attr: Attr, index: number) => {
      return parseNode(renderingAttributes[index], attr, acc);
    }, data);

    // Child nodes
    const templateChildNodes = Array.from(templateNode.childNodes);
    const renderingChildNodes = Array.from(renderingNode.childNodes);
    return templateChildNodes.reduce((acc: Array<Reactive>, childNode: Node, index: number) => {
      return parseNode(renderingChildNodes[index], childNode, acc);
    }, dataWithAttributes);
  }

  return data;
}
