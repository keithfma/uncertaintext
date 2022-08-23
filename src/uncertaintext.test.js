import {jest} from '@jest/globals';
import {get_required_data, get_optional_data, get_sampler} from './uncertaintext.js';


test('get_required_data happy path', () => {

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');
  
  let result = get_required_data(element, 'uctDistrib') 

  expect(result).toBe('normal');
});


test('get_required_data fails if attribute is not defined', () => {

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  expect(() => get_required_data(element, 'anUndefinedAttribute')).toThrow()
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
  console.log(sampler())
});


/*
test('get_sampler normal distribution fails for missing parameter', () => {
    console.log('TODO');
});


test('get_sampler normal distribution fails for non-numeric parameter', () => {
    console.log('TODO');
});


test('get_sampler fails for unknown distribution', () => {
    console.log('TODO');
});
*/
