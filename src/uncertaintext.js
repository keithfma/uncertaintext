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
// dependencies:
//  * d3-format: https://github.com/d3/d3-format
//  * d3-random: https://github.com/d3/d3-random
////

import {randomNormal} from "d3-random";
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
* Create a sampler object to match the specification in the element dataset attributes
*
* @param element: DOM element with uncertaintext dataset attributes that define the
*   sampler distribution and any distribution-specific parameters
*
* @returns: a d3-random sampler object, which returns a random sample from the specified  
*   distribution when called
*/
export function get_sampler(element) {

    let sampler = null; 

    let distribution_name = get_required_data(element, 'uctDistrib');

    if (distribution_name === 'normal') {
        // normal (Gaussian) distribution
        let mu    = parseFloat(get_required_data(element, 'uctMu'));
        let sigma = parseFloat(get_required_data(element, 'uctSigma'));
        sampler = randomNormal(mu, sigma);
            
    } else {
        // unsupported distribution
        throw 'No support for distribution:  ' + distribution_name;

    }

    return sampler
}


// initialize all uncertaintext elements on the page
export default function uncertaintext() {

    let targets = document.getElementsByClassName("uncertaintext")

    for (let i = 0; i < targets.length; i++) {

        let target = targets[i];

        try {

            let sampler = get_sampler(target);


            // TODO: factor out a testable function for creating the format spec
            // format specifications (optional) 
            let sample_format = format(get_optional_data(target, 'uctFormat', ' .2f'));

            // TODO: factor out a testable function for update interval 
            // update interval (optional) 
            let fps = get_optional_data(target, 'uctFps', 5);
            let delay_ms = 1. / fps * 1000.

            // TODO: factor out a (testable) higher-level function that returns this update function
            // define update function
            let updater = function() {
                target.innerHTML = sample_format(sampler());
            };

            // call once (to setup page an trigger errors where we catch them), then set to repeat
            updater();
            setInterval(updater, delay_ms);        

        } catch(err) {
            // indicate error, and continue on to the next element 
            console.log(err);
            target.innerHTML = '[error]';
        }    
    } 

};
