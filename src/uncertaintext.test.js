import {jest} from '@jest/globals';
import {get_required_data, get_optional_data, strictly_float, get_sampler, get_formatter, get_delay_ms, get_updater} from './uncertaintext.js';
import uncertaintext from './uncertaintext.js'  // default import
import {format} from "d3-format";

jest.useFakeTimers();
jest.spyOn(global, 'setInterval');


// TODO: split up tests into suites


/**
* Clean up the DOM between tests
* note: this is not a complete solution, but it is good enough for our purposes.
*  Should this prove insufficient, see: https://stackoverflow.com/questions/42805128
*/
afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});


/**
* Add a <div> to the test DOM and set the input attributes
*
* Accepts a variable number of arguments, each an attribute to assign to the new div, e.g.,
*   get_div('class=uncertaintext', 'data-uct-distrib=normal');
*/
function get_div() {
  let div = document.createElement('div');

  for (let i = 0; i < arguments.length; i++) {
    let attrib = arguments[i];
    let index = attrib.indexOf("=");
    let name = attrib.substr(0, index);
    let value = attrib.substr(index + 1);
    div.setAttribute(name, value);
  };

  document.body.appendChild(div);
  return div;
};


describe('get_required_data', () => {

  test('happy path', () => {
    let element = get_div('data-uct-distrib=normal');
    let result = get_required_data(element, 'uctDistrib') 
    expect(result).toBe('normal');
  });

  
  test('fail if attribute is not defined', () => {
    let element = get_div('data-uct-distrib=normal');
    expect(() => get_required_data(element, 'anUndefinedAttribute')).toThrow('No dataset attribute')
  });

}); 


describe('get_optional_data', () => {

  test('happy path', () => {
    let element = get_div('data-uct-distrib=normal');
    let result = get_optional_data(element, 'uctDistrib', 'default-value')
    expect(result).toBe('normal');
  });


  test('return default if attribute is not defined', () => {
    let element = get_div('data-uct-distrib=normal');
    expect(get_optional_data(element, 'anUndefinedAttribute', 'default')).toBe('default');
  });


  // TODO: missing expected fail test

});


describe('strictly_float', () => {

  test('happy path', () => {
      let result = strictly_float('9.99')
      expect(result).toBe(9.99)
  });


  test('fail if value cannot be cast', () => {
      expect(() => strictly_float('oh man, this is not a number')).toThrow('Failed to cast value');
  });

});


describe('get_sampler', () => {
  

  test('normal distribution happy path', () => {
  
    let element = get_div('data-uct-distrib=normal', 'data-uct-mu=1', 'data-uct-sigma=2');
  
    let sampler = get_sampler(element);
    let sample = sampler.sample();
  
    expect(sampler.name).toBe('normal');
    expect(sampler.parameters.mu).toBe(1);
    expect(sampler.parameters.sigma).toBe(2);
    expect(typeof sample).toBe('number');
  });
  
  
  test('normal distribution fails for missing parameter', () => {
    let element = get_div('data-uct-distrib=normal', 'data-uct-mu=1');  // no sigma
    expect(() => get_sampler(element)).toThrow('No dataset attribute');
  });
  
  
  test('normal distribution fails for non-numeric parameter', () => {
    let element = get_div('data-uct-distrib=normal', 'data-uct-mu=1', 'data-uct-sigma=oogabooga');
    expect(() => get_sampler(element)).toThrow('Failed to cast value to float');
  });
  
  
  test('uniform distribution happy path', () => {
  
    let element = get_div('data-uct-distrib=uniform', 'data-uct-min=1', 'data-uct-max=2');
  
    let sampler = get_sampler(element);
    let sample = sampler.sample();
  
    expect(sampler.name).toBe('uniform');
    expect(sampler.parameters.min).toBe(1);
    expect(sampler.parameters.max).toBe(2);
    expect(typeof sample).toBe('number');
    expect(sample).toBeGreaterThanOrEqual(1);
    expect(sample).toBeLessThanOrEqual(2);
  });
  
  
  test('uniform distribution fails for missing parameter', () => {
    let element = get_div('data-uct-distrib=uniform', 'data-uct-min=1');  // no max
    expect(() => get_sampler(element)).toThrow('No dataset attribute');
  });
  
  
  test('uniform distribution fails for non-numeric parameter', () => {
    let element = get_div('data-uct-distrib=uniform', 'data-uct-min=1', 'data-uct-max=oogabooga');
    expect(() => get_sampler(element)).toThrow('Failed to cast value to float');
  });
  
  
  test('fail for unknown distribution', () => {
    let element = get_div('data-uct-distrib=oogabooga');
    expect(() => get_sampler(element)).toThrow('No support for distribution');
  });

});


describe('get_formatter', () => {


  test('happy path', () => {
    let element = get_div('data-uct-format=.1f');  
    let formatter = get_formatter(element);
    expect(formatter(1.1111111)).toBe('1.1');
  });
  
  
  test('happy path with default value', () => {
    let element = get_div();  // no format spec set 
    let formatter = get_formatter(element);
    expect(formatter(9.99)).toBe(' 9.99');
    expect(formatter(-9.99)).toBe('−9.99');
  });
  
  
  test('fail for invalid format spec', () => {
    let element = get_div('data-uct-format=abcdefg');  // bad spec
    expect(() => get_formatter(element)).toThrow('invalid format');
  });

}); 


describe('get_delay_ms', () => { 


  test('happy path', () => {
    let element = get_div('data-uct-fps=2');  
    let result = get_delay_ms(element);
    expect(result).toBe(500);
  });
  
  
  test('happy path with default value', () => {
    let element = get_div();  // no fps set 
    let result = get_delay_ms(element);
    expect(result).toBe(200);
  });
  
  
  test('fail for invalid format spec', () => {
    let element = get_div('data-uct-fps=abcdefg');  // bad fps value
    expect(() => get_delay_ms(element)).toThrow('Failed to cast value to float');
  });

});


describe('get_updater', () => {

  test('happy path', () => {
      // create empty div and simple sampler and formatter
      let element = get_div();  
      let sampler = {sample: () => 'TEST'};
      let formatter = x => 'FORMATTED-' + x;
      expect(element.innerHTML).toBe('');  // confirm no text at test start
  
      // create and invoke update function
      let updater = get_updater(element, sampler, formatter);
      updater();
  
      // check for updated element text
      expect(element.innerHTML).toBe('FORMATTED-TEST');
  });

});


describe('uncertaintext', () => {


  test('happy path', () => {
  
      // uniform distribution with min == max, so we know it's expected value
      let uniform_element = get_div('class=uncertaintext', 'data-uct-distrib=uniform', 'data-uct-min=2', 'data-uct-max=2', 'data-uct-format=.1f', 'data-uct-fps=1');
  
      // normal distribution with arbitrary mu and sigma
      let normal_element =  get_div('class=uncertaintext', 'data-uct-distrib=normal', 'data-uct-mu=0', 'data-uct-sigma=1', 'data-uct-format=.2f', 'data-uct-fps=2');
      const normal_element_regex = /\-?\d\.\d\d/;
  
      // confirm no text in elements at test start
      expect(uniform_element.innerHTML).toBe('');
      expect(normal_element.innerHTML).toBe('');
  
      uncertaintext();
      
      // confirm elements are updated right away
      expect(uniform_element.innerHTML).toBe('2.0');
      expect(normal_element.innerHTML).toMatch(normal_element_regex);
  
      // confirm intervals are set
      expect(setInterval).toHaveBeenCalledTimes(2);
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);  // same as fps=1
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 500);  // same as fps=2
  });
  
  
  test('report errors and continue', () => {
      // *broken* distribution we expect to be marked and ignored
      let broken_element =  get_div('class=uncertaintext', 'data-uct-distrib=invalid');
  
      // two uniform distributions with min == max, so we know it's expected value
      let uniform_element_1 = get_div('class=uncertaintext', 'data-uct-distrib=uniform', 'data-uct-min=1', 'data-uct-max=1', 'data-uct-format=.1f', 'data-uct-fps=1');
      let uniform_element_2 = get_div('class=uncertaintext', 'data-uct-distrib=uniform', 'data-uct-min=2', 'data-uct-max=2', 'data-uct-format=.1f', 'data-uct-fps=2');
  
      // confirm no text in elements at test start
      expect(broken_element.innerHTML).toBe('');
      expect(uniform_element_1.innerHTML).toBe('');
      expect(uniform_element_2.innerHTML).toBe('');
  
      uncertaintext();
      
      // confirm valid elements are updated 
      expect(uniform_element_1.innerHTML).toBe('1.0');
      expect(uniform_element_2.innerHTML).toBe('2.0');
  
      // confirm invalid element is marked invalid
      expect(broken_element.innerHTML).toBe('[error]');
  
      // confirm intervals are set for valid elements
      expect(setInterval).toHaveBeenCalledTimes(2);
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);  // same as fps=1
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 500);  // same as fps=2
  
  });

});

