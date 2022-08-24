import {jest} from '@jest/globals';
import {get_required_data, get_optional_data, strictly_float, get_sampler, get_formatter, get_delay_ms, get_updater} from './uncertaintext.js';
import {format} from "d3-format";


/**
* Add a <div> to the test DOM and set the input attributes
*/
function get_div(attributes) {
  document.body.innerHTML = `<div id=test-element ${attributes}></div>`;
  return document.getElementById('test-element');
};


test('get_required_data happy path', () => {
  let element = get_div('data-uct-distrib=normal');
  let result = get_required_data(element, 'uctDistrib') 
  expect(result).toBe('normal');
});


test('get_required_data fails if attribute is not defined', () => {
  let element = get_div('data-uct-distrib=normal');
  expect(() => get_required_data(element, 'anUndefinedAttribute')).toThrow('No dataset attribute')
});


test('get_optional_data happy path', () => {
  let element = get_div('data-uct-distrib=normal');
  let result = get_optional_data(element, 'uctDistrib', 'default-value')
  expect(result).toBe('normal');
});


test('get_optional_data returns default if attribute is not defined', () => {
  let element = get_div('data-uct-distrib=normal');
  expect(get_optional_data(element, 'anUndefinedAttribute', 'default')).toBe('default');
});


test('strictly_float happy path', () => {
    let result = strictly_float('9.99')
    expect(result).toBe(9.99)
});


test('strictly_float fails if value cannot be cast', () => {
    expect(() => strictly_float('oh man, this is not a number')).toThrow('Failed to cast value');
});


test('get_sampler normal distribution happy path', () => {

  let element = get_div('data-uct-distrib=normal data-uct-mu=1 data-uct-sigma=2');

  let sampler = get_sampler(element);
  let sample = sampler.sample();

  expect(sampler.name).toBe('normal');
  expect(sampler.parameters.mu).toBe(1);
  expect(sampler.parameters.sigma).toBe(2);
  expect(typeof sample).toBe('number');
});


test('get_sampler normal distribution fails for missing parameter', () => {
  let element = get_div('data-uct-distrib=normal data-uct-mu=1');  // no sigma
  expect(() => get_sampler(element)).toThrow('No dataset attribute');
});


test('get_sampler normal distribution fails for non-numeric parameter', () => {
  let element = get_div('data-uct-distrib=normal data-uct-mu=1 data-uct-sigma=oogabooga');
  expect(() => get_sampler(element)).toThrow('Failed to cast value to float');
});


test('get_sampler uniform distribution happy path', () => {

  let element = get_div(`data-uct-distrib=uniform data-uct-min=1 data-uct-max=2`);

  let sampler = get_sampler(element);
  let sample = sampler.sample();

  expect(sampler.name).toBe('uniform');
  expect(sampler.parameters.min).toBe(1);
  expect(sampler.parameters.max).toBe(2);
  expect(typeof sample).toBe('number');
  expect(sample).toBeGreaterThanOrEqual(1);
  expect(sample).toBeLessThanOrEqual(2);
});


test('get_sampler uniform distribution fails for missing parameter', () => {
  let element = get_div('data-uct-distrib=uniform data-uct-min=1');  // no max
  expect(() => get_sampler(element)).toThrow('No dataset attribute');
});


test('get_sampler uniform distribution fails for non-numeric parameter', () => {
  let element = get_div('data-uct-distrib=uniform data-uct-min=1 data-uct-max=oogabooga');
  expect(() => get_sampler(element)).toThrow('Failed to cast value to float');
});


test('get_sampler fails for unknown distribution', () => {
  let element = get_div('data-uct-distrib=oogabooga');
  expect(() => get_sampler(element)).toThrow('No support for distribution');
});


test('get_formatter happy path', () => {
  let element = get_div('data-uct-format=.1f');  
  let formatter = get_formatter(element);
  expect(formatter(1.1111111)).toBe('1.1');
});


test('get_formatter happy path with default value', () => {
  let element = get_div('');  // no format spec set 
  let formatter = get_formatter(element);
  expect(formatter(9.99)).toBe('9.99');
});


test('get_formatter fail for invalid format spec', () => {
  let element = get_div('data-uct-format=abcdefg');  // bad spec
  expect(() => get_formatter(element)).toThrow('invalid format');
});


test('get_delay_ms happy path', () => {
  let element = get_div('data-uct-fps=2');  
  let result = get_delay_ms(element);
  expect(result).toBe(500);
});


test('get_delay_ms happy path with default value', () => {
  let element = get_div('');  // no fps set 
  let result = get_delay_ms(element);
  expect(result).toBe(200);
});


test('get_delay_ms fail for invalid format spec', () => {
  let element = get_div('data-uct-fps=abcdefg');  // bad fps value
  expect(() => get_delay_ms(element)).toThrow('Failed to cast value to float');
});


test('get_updater happy path', () => {
    // create empty div and simple sampler and formatter
    let element = get_div('');  
    let sampler = {sample: () => 'TEST'};
    let formatter = x => 'FORMATTED-' + x;
    expect(element.innerHTML).toBe('');  // confirm no text at test start

    // create and invoke update function
    let updater = get_updater(element, sampler, formatter);
    updater();

    // check for updated element text
    expect(element.innerHTML).toBe('FORMATTED-TEST');
});
