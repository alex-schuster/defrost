/**
 * @typedef Extracted
 * @type {object}
 * @property {string} key - The extracted variable's key.
 * @property {string|number} value - The extracted variable's value.
 */
export interface Extracted {
  key: string,
  value: string|number;
}

/**
 * @typedef Reactive
 * @type {Extracted}
 * @property {(renderData: object) => undefined} renderFunction - The function to be called when the value changes.
 */
export interface Reactive extends Extracted {
  renderFunction: (renderData: object) => void;
}

/**
 * @typedef VarExtractionAcc
 * @type {object}
 * @property {Array<Extracted>} vars - The already extracted variables.
 * @property {string} remainder - The remaining part of the string to be parsed.
 */
export interface VarExtractionAcc {
  vars: Array<Extracted>;
  remainder: string;
}
