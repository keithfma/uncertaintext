// Uncertaintext: uncertain text for uncertain numbers
//
// Uncertaintext provides dynamic styling for representing probability distributions. The core idea is
// to express probabalistic values as series of random samples from the distribution, rather than the
// usual summary statistics. The aim is to give readers a "gut feel" for the uncertainty, and have
// a little fun doing it.
//
// To use, define your distributions as <span> elements with the following attributes:
//  * class=uncertaintext: required, marks the span element for uncertaintext to find and update
//  * data-mu=[float]: required, TODO
//  * data-sigma=[float]: required, TODO 
//  * data-display-mode: optional, TODO
//  * data-fmt-mu=[string]: optional, TODO
//  * data-fmt-sigma=[string]: optional, TODO
//  * data-fmt-sample=[string]: optional, TODO
//
// dependencies: TODO


// Standard normal variate using Box-Muller transform.
// see: https://stackoverflow.com/a/36481059
function randn_bm() {
   var u = 0;
   var v = 0;
   while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
   while (v === 0) v = Math.random();
   return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}


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
function update_sample(target, tooltip, mode, mu, sigma, fmt_mu, fmt_sigma, fmt_sample) {
    var sample = randn_bm()*sigma + mu;
    
    if (mode == 'full') {
        target.innerHTML = `${fmt_mu(mu)} &plusmn; ${fmt_sigma(sigma)} (${fmt_sample(sample)})`

    } else if (mode == 'sample-only') {
        target.innerHTML = fmt_sample(sample);

    } else if (mode == 'sample-on-hover') {
        tooltip.setContent(fmt_sample(sample));

    } else {
        console.log('Display mode "%s" not yet implemented, sorry!', mode);
    }
}

// initialize all uncertaintext elements on the page
function uncertaintext() {

    let targets = document.getElementsByClassName("uncertaintext")

    for (let i = 0; i < targets.length; i++) {

        let target = targets[i];

        // distribution definition (required)
        let mu    = parseFloat(required_data(target, 'mu'));
        let sigma = parseFloat(required_data(target, 'sigma'));

        // display mode (optional)
        let display_mode = optional_data(target, 'displayMode', 'full')

        // format specifications (optional) 
        let fmt_mu     = optional_data(target, 'fmtMu', " .2f");
        let fmt_sigma  = optional_data(target, 'fmtSigma', " .2f");
        let fmt_sample = optional_data(target, 'fmtSample', fmt_sigma);
        fmt_mu     = d3.format(fmt_mu);
        fmt_sigma  = d3.format(fmt_sigma);
        fmt_sample = d3.format(fmt_sample);

        // update interval (optional) 
        let fps = optional_data(target, 'fps', 5);
        let delay_ms = 1. / fps * 1000.

        // validate parameters
        let valid_display_modes = ['full', 'sample-only', 'sample-on-hover']
        if (valid_display_modes.includes(display_mode) === false) {
            console.log('Invalid display mode: "%s", falling back to "full"', display_mode);
            display_mode = 'full';
        }

        // initialize text and tooltip
        if (display_mode === 'full') {
            target.innerHTML = `${fmt_mu(mu)} &plusmn; ${fmt_sigma(sigma)} (${fmt_sample(mu)}`;
            tooltip = null;

        } else if (display_mode === 'sample-only') {
            target.innerHTML = fmt_sample(mu);
            tooltip = tippy(target, {content: `${fmt_mu(mu)} &plusmn; ${fmt_sigma(sigma)}`});
            
        } if (display_mode === 'sample-on-hover') {
            target.innerHTML = `${fmt_mu(mu)} &plusmn; ${fmt_sigma(sigma)}`;
            tooltip = tippy(target, {content: fmt_sample(mu)});
        }

        // start updating 
        setInterval(
            update_sample,
            delay_ms,
            target,
            tooltip,
            display_mode,
            mu,
            sigma,
            fmt_mu,
            fmt_sigma,
            fmt_sample
        );        
    } 

}
