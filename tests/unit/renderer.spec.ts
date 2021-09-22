/**
 * @jest-environment jsdom
 */

import { render, renderNode } from '../../lib/src/renderer/index';

test('Should render a string', () => {
  const template = 'The {{ foo }} should be rendered. {{bar:number}}+{{bar:number}}';
  const data = { foo: 'value', bar: 1 };
  expect(render(template, data)).toBe('The value should be rendered. 1+1');
});

test('Should render a node', () => {
  const renderTarget = document.createTextNode('');
  const template = 'The {{ foo }} should be rendered. {{bar:number}}+{{bar:number}}';
  const data = { foo: 'value', bar: 1 };
  renderNode(renderTarget, template, data);
  expect(renderTarget.nodeValue).toBe('The value should be rendered. 1+1');
});
