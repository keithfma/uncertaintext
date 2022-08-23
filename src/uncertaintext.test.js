import test from 'ava';
import {JSDOM } from 'jsdom';
import {get_required_data, get_optional_data, get_sampler} from './uncertaintext.js';


function new_doc() {
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
  return dom.window.document;
}


test('get_required_data happy path', t => {

  let document = new_doc();

  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  let result = get_required_data(element, 'uctDistrib')

  t.is(result, 'normal');
});


/*
test('get_required_data fails if attribute is not defined', () => {

  // create document with a dataset attribute
  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  // fail to retrieve undefined dataset element
  expect(() => get_required_data(element, 'anUndefinedAttribute')).toThrow()
});


test('get_optional_data happy path', () => {

  // create document with an expected dataset attribute
  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  // retrieve the dataset value by its mangled name
  expect(get_optional_data(element, 'uctDistrib', 'default-value')).toBe('normal');
});


test('get_optional_data returns default if attribute is not defined', () => {

  // create document with a dataset attribute
  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  // fail to retrieve undefined dataset element
  expect(get_optional_data(element, 'anUndefinedAttribute', 'default')).toBe('default');
});
*/


test('get_sampler normal distribution happy path', t => {
    t.pass()
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
