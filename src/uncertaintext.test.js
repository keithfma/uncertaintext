import {jest} from '@jest/globals';
import {get_required_data, get_optional_data, strictly_float, get_sampler, get_formatter, get_delay_ms} from './uncertaintext.js';
import {format} from "d3-format";


test('get_required_data happy path', () => {

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');
  
  let result = get_required_data(element, 'uctDistrib') 

  expect(result).toBe('normal');
});


test('get_required_data fails if attribute is not defined', () => {

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  expect(() => get_required_data(element, 'anUndefinedAttribute')).toThrow('No dataset attribute')
});


test('get_optional_data happy path', () => {

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  let result = get_optional_data(element, 'uctDistrib', 'default-value')

  expect(result).toBe('normal');
});


test('get_optional_data returns default if attribute is not defined', () => {

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  expect(get_optional_data(element, 'anUndefinedAttribute', 'default')).toBe('default');
});


test('get_sampler normal distribution happy path', () => {

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal data-uct-mu=1 data-uct-sigma=2></div>';
  let element = document.getElementById('test-element');

  let sampler = get_sampler(element);
  let sample = sampler.sample();

  expect(sampler.name).toBe('normal');
  expect(sampler.parameters.mu).toBe(1);
  expect(sampler.parameters.sigma).toBe(2);
  expect(typeof sample).toBe('number');
});


test('strictly_float happy path', () => {
    let result = strictly_float('9.99')
    expect(result).toBe(9.99)
});


test('strictly_float fails if value cannot be cast', () => {
    expect(() => strictly_float('oh man, this is not a number')).toThrow('Failed to cast value');
});


test('get_sampler normal distribution fails for missing parameter', () => {

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal data-uct-mu=1></div>'; // no sigma
  let element = document.getElementById('test-element');

  expect(() => get_sampler(element)).toThrow('No dataset attribute');
});


test('get_sampler normal distribution fails for non-numeric parameter', () => {

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal data-uct-mu=1 data-uct-sigma=oogabooga></div>';
  let element = document.getElementById('test-element');

  expect(() => get_sampler(element)).toThrow('Failed to cast value to float');
});


test('get_sampler fails for unknown distribution', () => {
  document.body.innerHTML = '<div id=test-element data-uct-distrib=oogabooga></div>';
  let element = document.getElementById('test-element');

  expect(() => get_sampler(element)).toThrow('No support for distribution');
});


test('get_formatter happy path', () => {
  document.body.innerHTML = '<div id=test-element data-uct-format=.1f></div>'; // no format spec included
  let element = document.getElementById('test-element');

  let formatter = get_formatter(element);

  expect(formatter(1.1111111)).toBe('1.1');
});


test('get_formatter happy path with default value', () => {
  document.body.innerHTML = '<div id=test-element></div>'; // no format spec included
  let element = document.getElementById('test-element');

  let formatter = get_formatter(element);

  expect(formatter(9.99)).toBe('9.99');
});


test('get_formatter fail for invalid format spec', () => {
   document.body.innerHTML = '<div id=test-element data-uct-format=abcdefg></div>'; // no format spec included
   let element = document.getElementById('test-element');

    expect(() => get_formatter(element)).toThrow('invalid format');
});


/*
test('get_delay_ms happy path', () => {
  document.body.innerHTML = '<div id=test-element data-uct-format=.1f></div>'; // no format spec included
  let element = document.getElementById('test-element');

  let formatter = get_formatter(element);

  expect(formatter(1.1111111)).toBe('1.1');
});


test('get_delay_ms happy path with default value', () => {
  document.body.innerHTML = '<div id=test-element></div>'; // no format spec included
  let element = document.getElementById('test-element');

  let formatter = get_formatter(element);

  expect(formatter(9.99)).toBe('9.99');
});


test('get_delay_ms fail for invalid format spec', () => {
   document.body.innerHTML = '<div id=test-element data-uct-format=abcdefg></div>'; // no format spec included
   let element = document.getElementById('test-element');

    expect(() => get_formatter(element)).toThrow('invalid format');
});
*/
