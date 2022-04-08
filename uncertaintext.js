// Uncertaintext: uncertain text for uncertain numbers
//
// Uncertaintext provides dynamic styling for representing probability distributions. The core idea is
// to express probabalistic values as series of random samples from the distribution, rather than the
// usual summary statistics. The aim is to give readers a "gut feel" for the uncertainty, and have
// a little fun doing it.
//
// To use, define your distributions as <span> elements with the following attributes:
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


// retrieve dataset attribute or fail if not set
function required_data(element, name) {
    return element.dataset[name]
}


// retrieve dataset attribute or default if not set
function optional_data(element, name, fallback) {
    if (name in element.dataset) {
        return element.dataset[name]
    }
    return fallback
}


// update element with formatted sample from the distribution
function update_sample(target, sampler, sample_format) {
    target.innerHTML = sample_format(sampler());
}


// initialize all uncertaintext elements on the page
function uncertaintext() {

    let targets = document.getElementsByClassName("uncertaintext")

    for (let i = 0; i < targets.length; i++) {

        let target = targets[i];

        try {

            let sampler = null; 

            // distribution definition (required)
            let distribution_name = required_data(target, 'uctDistrib');
            
            // sampling function (required)
            if (distribution_name === 'normal') {
                let mu    = parseFloat(required_data(target, 'uctMu'));
                let sigma = parseFloat(required_data(target, 'uctSigma'));
                sampler = d3.randomNormal(mu, sigma);
            
            // TODO: add another distribution or two
            
            } else {
                console.log('No support for distribution: "%s"', distribution_name);
            }

            // format specifications (optional) 
            let sample_format = d3.format(optional_data(target, 'uctFormat', ' .2f'));

            // update interval (optional) 
            let fps = optional_data(target, 'uctFps', 5);
            let delay_ms = 1. / fps * 1000.

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

}
