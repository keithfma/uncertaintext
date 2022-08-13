# Next Steps

A place to consider my next moves, and make sure all the TODOs get TODONE.


## Packaging

I am fairly certain I want to use modules, so the new features don't expect the HTML to
load dependencies explicity. 

* Can I figure out how to make this work as a module directly?
* Should I instead use some tool to package it up as a standalone script (with dependencies baked in)?

I have really struggled to understand all the options here.


## Testing

Not sure this is really worth it at all, but I feel sheepish "releasing" anything without tests.

What do we want to test, really? 
* That our script finds the marked elements and replaces their contents
* That we initialize the random number generators as expected (we can trust thier values)
* I think jest will give a fake DOM, but did not play well with modules

## Old notes

These questions should be resolved before I am done.

* How does stuff like this get distributed? Just a JS file and some instructions, I think?
* How are dependencies handled?
* Consider how to write this up -- maybe even a "Try It Out" box?
* Run prettier and/or eslint to get this shit ship shape
* Can I make it a module and use the fancy new imports?
* Should I make it an npm package with the right dependencies?
* If I make it a module, can I also distribute it so that it can be easily imported?
* How to test this mofo?
* Retry with a clean install of node deps, which are:
  * d3-random, d3-format, jest 
