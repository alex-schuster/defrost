import { Extracted, Reactive } from '../../lib/src/parser/types';
import { removeDuplicateExtracteds, extractedToReactive, unpackData } from '../../lib/src/parser/utility';
import { parseSimpleString } from '../../lib/src/parser/index';

test('Should remove duplicate extracted variables', () => {
  const input: Array<Extracted> = [
    { key: 'foo', value: 'Foo value' },
    { key: 'bar', value: 'Bar value' },
    { key: 'foo', value: 'Foo value' },
    { key: 'foobar', value: 'Foobar value' }
  ];
  const expectedOutput: Array<Extracted> = [
    { key: 'foo', value: 'Foo value' },
    { key: 'bar', value: 'Bar value' },
    { key: 'foobar', value: 'Foobar value' }
  ];
  expect(removeDuplicateExtracteds(input)).toEqual(expectedOutput);
});

test('Should convert an Extracted to a Reactive', () => {
  const input: Extracted = { key: 'foo', value: 'Foo value' };
  const renderFunction = (renderData: object) => { console.log(renderData) };
  const expectedOutput: Reactive = { key: 'foo', value: 'Foo value', renderFunction };
  expect(extractedToReactive(input, renderFunction)).toEqual(expectedOutput);
});

test('Should unpack Reactives', () => {
  const input: Array<Reactive> = [
    { key: 'foo', value: 'Foo value', renderFunction: (renderData: object) => { console.log(renderData) } },
    { key: 'bar', value: 'Bar value', renderFunction: (renderData: object) => { console.log(renderData) } },
    { key: 'foobar', value: 5, renderFunction: (renderData: object) => { console.log(renderData) } }
  ];
  const expectedOutput = {
    foo: 'Foo value',
    bar: 'Bar value',
    foobar: 5
  };
  expect(unpackData(input)).toEqual(expectedOutput);
});

test('Should parse a simple string', () => {
  const template = 'A {{foo:string}} and another {{ bar:number }}.';
  const rendering = 'A value and another 1.';
  const expectedOutput: Array<Extracted> = [
    { key: 'foo', value: 'value' },
    { key: 'bar', value: 1 }
  ];
  expect(parseSimpleString(rendering, template)).toEqual(expectedOutput);
});
