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


// TODO: this function is not used, kill it
// update element with formatted sample from the distribution
function update_sample(target, sampler, sample_format) {
    target.innerHTML = sample_format(sampler());
};


// initialize all uncertaintext elements on the page
export default function uncertaintext() {

    let targets = document.getElementsByClassName("uncertaintext")

    for (let i = 0; i < targets.length; i++) {

        let target = targets[i];

        try {

            let sampler = null; 

            // TODO: factor out a testable function for creating the sampler object
            // distribution definition (required)
            let distribution_name = get_required_data(target, 'uctDistrib');
            
            // sampling function (required)
            if (distribution_name === 'normal') {
                let mu    = parseFloat(get_required_data(target, 'uctMu'));
                let sigma = parseFloat(get_required_data(target, 'uctSigma'));
                sampler = randomNormal(mu, sigma);
            
            // TODO: add uniform distribution
            
            } else {
                console.log('No support for distribution: "%s"', distribution_name);
                // TODO: raise an error to be caught below
            }

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
