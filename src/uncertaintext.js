// Uncertaintext: uncertain text for uncertain numbers
//
// Uncertaintext provides dynamic styling for representing probability distributions. The core idea is
// to express probabalistic values as series of random samples from the distribution, rather than the
// usual summary statistics. The aim is to give readers a "gut feel" for the uncertainty, and have
// a little fun doing it.
//
// To use, include this script in your webpage as a module, and then define
// your distributions as <span> elements with the following attributes:
//  * class=uncertaintext: required, marks the span element for uncertaintext to find and update
//  * data-uct-distrib=[string], required, name of the distribution to sample from, currently supported
//      names are: normal.
//  * data-uct-mu=[float]: required for normal distribution, mean
//  * data-uct-sigma=[float]: required for normal distribution, standard deviation
//  * data-uct-format=[string]: optional, printf-style format string to apply to the sample,
//      see https://github.com/d3/d3-format
//  * data-uct-fps=[int]: optional, update frequency in "frames" per second
//
// TODO: update for uniform distribution
//
// dependencies:
//  * d3-format: https://github.com/d3/d3-format
//  * d3-random: https://github.com/d3/d3-random
////

import {randomUniform, randomNormal} from "d3-random";
import {format} from "d3-format";


/**
** Retrieve dataset attribute or die trying 
*
* @param element: DOM element the data is attached to
* @param name: the dataset attribute name, in the mangled form it is made available to js scripts (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)
*
* @return: the value of the dataset attribute
*/
export function get_required_data(element, name) {
    if (name in element.dataset) {
        return element.dataset[name]
    }
    throw 'No dataset attribute: ' + name
};


/**
* Retrieve dataset attribute or default value if it is not set
*
* @param element: DOM element the data is attached to
* @param name: the dataset attribute name, in the mangled form it is made available to js scripts (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)
* @param fallback: default value to return if the attribute is not set
*
* @return: the value of the dataset attribute or default
*/
export function get_optional_data(element, name, fallback) {
    if (name in element.dataset) {
        return element.dataset[name]
    }
    return fallback
};


/**
* Cast the input value to a float or die trying
*
* @param value: the object to cast to a float
*
* @return: a float
*/
export function strictly_float(value) {
    let parsed = parseFloat(value);
    if (isNaN(parsed)) {
        throw `Failed to cast value to float: {value}`;
    };
    return parsed;
};



/**
* Create a sampler object to match the specification in the element dataset attributes
*
* @param element: DOM element with uncertaintext dataset attributes that define the
*   sampler distribution and any distribution-specific parameters
*
* @returns: an object with the following properties:
*   - name: distribution name
*   - parameters: nested object containing any parameters used to define the distribution
*   - sample: anonymous function that returns a random sample from the specified  
*     distribution when called
*/
export function get_sampler(element) {

    let name = get_required_data(element, 'uctDistrib');
    let sampler = null; 
    let parameters = null;

    if (name === 'normal') {
        // normal (Gaussian) distribution
        parameters = {
            mu: strictly_float(get_required_data(element, 'uctMu')),
            sigma: strictly_float(get_required_data(element, 'uctSigma')),
        };
        sampler = randomNormal(parameters.mu, parameters.sigma);

    } else if (name == 'uniform') {
        // uniform distribution
        parameters = {
            min: strictly_float(get_required_data(element, 'uctMin')),
            max: strictly_float(get_required_data(element, 'uctMax')),
        };
        sampler = randomUniform(parameters.min, parameters.max);
            
    } else {
        // unsupported distribution
        throw 'No support for distribution:  ' + name;

    }

    return {
        name: name,
        parameters: parameters,
        sample: sampler,
    };
}


/**
* Create formatter function that formats numbers as specifid in the element dataset attribute
*
* @param element: DOM element with dataset attribute defining the
*   desired text format as understood by d3-format (e.g., .2f)
*
* @return: d3-format formatter function
*/
export function get_formatter(element) {

    const default_spec = '.2f';
    let spec = get_optional_data(element, 'uctFormat', default_spec);
    return format(spec);

}


//TODO: the get_delay_ms comment is the gold standard, update the others to match


/**
* Read FPS (frames-per-second) from element dataset and convert to delay in milliseconds
*
* @param element: DOM element with data-uct-fps attribute defining the update interval
*   in "frames-per-second"
*
* @return: update interval in milliseconds
*/
export function get_delay_ms(element) {
    let fps = strictly_float(get_optional_data(element, 'uctFps', 5));
    return 1. / fps * 1000.
}



/** 
* Create updater function which updates element's innerHTML when called
*
* @param element: the element to be updated
* @param sampler: sampler object, as returned by get_sampler
* @param formatter: formatter object, as returned by get_formatter
*
* @return: update function
*/
export function get_updater(element, sampler, formatter) {
    return function() {
        element.innerHTML = formatter(sampler.sample());
    };
}


// TODO: document and test!

// initialize all uncertaintext elements on the page
export default function uncertaintext() {

    let targets = document.getElementsByClassName("uncertaintext")

    for (let i = 0; i < targets.length; i++) {

        let target = targets[i];

        try {

            // initialize update function and delay from element dataset attributes
            let sampler = get_sampler(target);
            let formatter = get_formatter(target);
            let delay_ms = get_delay_ms(target);
            let updater = get_updater(target, sampler, formatter);

            // call once (to setup page an trigger errors where we catch them)
            updater();

            // update on interval
            setInterval(updater, delay_ms);        

        } catch(err) {
            // indicate error and continue on to the next element 
            console.log(err);
            target.innerHTML = '[error]';
        }    
    } 

};
