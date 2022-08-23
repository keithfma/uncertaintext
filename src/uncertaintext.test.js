import {get_required_data, get_optional_data} from './uncertaintext.js';


test('get_required_data happy path', () => {

  // create document with an expected dataset attribute
  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  // retrieve the dataset value by its mangled name
  expect(get_required_data(element, 'uctDistrib')).toBe('normal');
});


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
