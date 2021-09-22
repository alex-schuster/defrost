/**
 * A regular expression for capturing variables in templates.
 * @type {RegExp}
 */
export const captureVariablesRegex: RegExp = /\{\{\s?([a-z]+)(\s?:\s?(number|string))?\s?\}\}/ig;

/**
 * A regular expression for matching variables in templates.
 * @type {RegExp}
 */
export const matchVariablesRegex: RegExp = /\{\{\s?[^}]+\s?\}\}/ig;
