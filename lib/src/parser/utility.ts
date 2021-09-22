import { Extracted, Reactive } from './types';

/**
 * Remove duplicates from an array of extracted variables.
 * @param {Array<Extracted>} extractedVariables - The extracted variables.
 * @return {Array<Extracted>} The extracted variables without duplicates.
 */
export function removeDuplicateExtracteds(extractedVariables: Array<Extracted>): Array<Extracted> {
  return extractedVariables.filter((obj: Extracted, index: number, self: Array<Extracted>) => {
    return index === self.findIndex((el: Extracted) => {
      return el.key === obj.key;
    });
  });
}

/**
 * Convert an extracted variable to a reactive variable.
 * @param {Extracted} extracted - The extracted variable.
 * @param {(renderData: object) => undefined} renderFunction - The render function for the reactive variable.
 * @return {Reactive} The reactive variable.
 */
export function extractedToReactive(extracted: Extracted, renderFunction: (renderData: object) => void): Reactive {
  return {
    key: extracted.key,
    value: extracted.value,
    renderFunction
  };
}

/**
 * Unpack an array of reactive variables.
 * @param {Array<Reactive>} data - The data to be unpacked.
 * @return {object} The unpacked data.
 */
export function unpackData(data: Array<Reactive>): object {
  return data.reduce((acc: object, item: Reactive) => {
    return { ...acc, [item.key]: item.value };
  }, {});
}

/**
 * Escape a string for usage within a regular expression.
 * @param {string} string - The input string.
 * @return {string} The escaped string.
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
