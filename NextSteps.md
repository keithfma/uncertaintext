# Next Steps

A place to consider my next moves, and make sure all the TODOs get TODONE.


## Packaging

* Package as a native module using webpack to "bake-in" the few dependencies
* Not sure if I should publish on npm (probably)?
* Not sure how to publish the packaged module on a CDN (maybe npm is enough)?


## Testing

Not sure this is really worth it at all, but I feel sheepish "releasing" anything without tests.

What do we want to test, really? 
* That our script finds the marked elements and replaces their contents
* That we initialize the random number generators as expected (we can trust thier values)
* I think jest will give a fake DOM, but did not play well with modules

## Clean up

* Run prettier and/or eslint to get this shit ship shape
* Retry with a clean install of node deps, which are:
  * d3-random, d3-format, jest 
* Make the final package lockfile is _minimal_

## Write up 

Consider how to write this up -- maybe even a "Try It Out" box?

## Scratch

* Looks like javascript has an f-string-like string formatting capability,
  see [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).
  Does not appear to allow specifying precision like I need here though.
* Consider exporting our main function as a default, see 
  [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#default_exports_versus_named_exports)
