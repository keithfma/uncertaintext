// Uncertaintext Mark II
// TODO: define usage here
//
// dependencies: 
// * https://github.com/d3/d3-format (FIXME: will want a hard-copy of this, assuming the license is OK)

// TODO: make a separate file for just the utilities, and then document how to invoke them in a user's 
//   own JS.


// FIXME: how to import the dependency here instead of in the HTML header?


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
function update_sample(target, mu, sigma, fmt_mu, fmt_sigma, fmt_sample) {
    var sample = randn_bm()*sigma + mu;
    target.innerHTML = `${fmt_mu(mu)} &plusmn; ${fmt_sigma(sigma)} (${fmt_sample(sample)})`
}

// initialize all uncertaintext elements on the page
function init_uncertaintext() {
    console.log('Uncertaintext Mark II Activated')

    targets = document.getElementsByClassName("uncertaintext")

    for (let i = 0; i < targets.length; i++) {

        let target = targets[i];

        // distribution definition (required)
        let mu    = parseFloat(required_data(target, 'mu'));
        let sigma = parseFloat(required_data(target, 'sigma'));

        // format specifications (optional) 
        let fmt_mu     = optional_data(target, 'fmtMu', " .2f");
        let fmt_sigma  = optional_data(target, 'fmtSigma', " .2f");
        let fmt_sample = optional_data(target, 'fmtSample', fmt_sigma);

        // update interval (optional) 
        let fps = optional_data(target, 'fps', 5);
        let delay_ms = 1. / fps * 1000.

        // start updating 
        setInterval(
            update_sample,
            delay_ms,
            target,
            mu,
            sigma,
            d3.format(fmt_mu),
            d3.format(fmt_sigma),
            d3.format(fmt_sample)
        );        
    } 

}

// TODO: document that this is all a user will need to add
document.addEventListener("DOMContentLoaded", init_uncertaintext());
