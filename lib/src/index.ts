import { unpackData } from './parser/utility';
import { parseNode } from './parser/index';
import { render, renderNode } from './renderer/index';

/**
 * Make an element reactive.
 * @param {Element} element - The DOM element to be made reactive.
 * @param {string} template - The template to be used to parse the element.
 * @return {object} An object representing the reactive element's data.
 */
function init(element: Element, template: string): object {
  const domParser = new DOMParser();
  const templateDocument = domParser.parseFromString(template, 'text/html');
  const data = parseNode(element, templateDocument.firstElementChild);
  const unpackedData = unpackData(data);
  return new Proxy(unpackedData, {
    set: (o, property, value) => {
      if (o[property] === value) {
        return true;
      }
      o[property] = value;
      data.forEach((item) => {
        if (item.key === property) {
          item.renderFunction(o);
        }
      });
      return true;
    }
  });
}

module.exports = { init, render, renderNode };
