import {get_required} from './uncertaintext.js';


test('get_required happy path', () => {

  // create document with a single div with an expected dataset attribute
  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  // retrieve the dataset value by its mangled name
  expect(get_required(element, 'uctDistrib')).toBe('normal');
});


test('get_required fails if attribute is not defined', () => {

  // create document with a single div with an expected dataset attribute
  document.body.innerHTML = '<div id=test-element data-uct-distrib=normal></div>';
  let element = document.getElementById('test-element');

  // retrieve undefined dataset element
  expect(() => get_required(element, 'anUndefinedAttribute')).toThrow()
});
