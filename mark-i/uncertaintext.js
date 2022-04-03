// See: https://github.com/d3/d3-format
// FIXME: will want a hard-copy of this, assuming the license is OK

// Standard Normal variate using Box-Muller transform.
// see: https://stackoverflow.com/a/36481059
function randn_bm() {
   var u = 0;
   var v = 0;
   while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
   while (v === 0) v = Math.random();
   return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}


function uncertaintext(target, mu, sigma, fmt_mu, fmt_sigma, fmt_sample) {
    var sample = randn_bm()*sigma + mu;
    target.innerHTML = `${fmt_mu(mu)} &plusmn; ${fmt_sigma(sigma)} (${fmt_sample(sample)})`
}


document.addEventListener("DOMContentLoaded", function() {

    console.log('Uncertaintext Mark I Activated')

    
    targets = document.getElementsByClassName("uncertaintext")

    for (let i = 0; i < targets.length; i++) {

        let mu = parseFloat(targets[i].dataset.mu);

        // FIXME: a little utility for get with default will help here
        if ('fmtmu' in targets[i].dataset) {
            fmt_mu = targets[i].dataset.fmtmu;
        } else {
            fmt_mu = " .2f"
        }

        let sigma = parseFloat(targets[i].dataset.sigma);

        if ('fmtsigma' in targets[i].dataset) {
            fmt_sigma = targets[i].dataset.fmtsigma;
        } else {
            fmt_sigma = " .2f"
        }

        if ('fmtsample' in targets[i].dataset) {
            fmt_sample = targets[i].dataset.fmtsample;
        } else {
            fmt_sample = fmt_sigma;
        }

        if ('fps' in targets[i].dataset) {
            fps = targets[i].dataset.fps;
        } else {
            fps = 5;
        }
        var delay_ms = 1. / fps * 1000. 

        setInterval(uncertaintext, delay_ms, targets[i], mu, sigma, d3.format(fmt_mu), d3.format(fmt_sigma), d3.format(fmt_sample))        
    } 
});
