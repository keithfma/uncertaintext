# Uncertaintext: uncertain text for uncertain numbers

Uncertaintext provides dynamic styling for representing probability distributions.

The core idea is to express probabalistic values as series of random samples
from the distribution, rather than the usual summary statistics. The aim is to
give readers a "gut feel" for the uncertainty and have a little fun doing it.

Uncertaintext is available as a single JS file, `uncertaintext.js`, which applies
dynamic formats to specially-tagged HTML elements. 

Check out the [example page](https://keithfma.github.io/uncertaintext)  to see
it in action.

## Usage

Include the uncertaintext module [:warning:TODO: make "uncertaintext module" a link to
the distribution :warning:] in your webpage and run the main function: 

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>How to include uncertaintext in your webpage</title>
  <script src=./uncertaintext.js type=module></script>
  <script type=module >
    import uncertaintext from './uncertaintext.js'
    window.onload = function () {uncertaintext()};
  </script>
</head>
<body>
Wow! So easy!
</body>
```

Then, define your uncertain numerical values as probability distributions and
uncertaintext will insert and update the displayed vaules. 

Each uncertain value should be a `<span>` element with the following attributes:
 * class=uncertaintext: required, marks the span element for uncertaintext to find and update
 * data-uct-distrib=[string], required, name of the distribution to sample from, currently supported
     names are: uniform, normal.
 * data-uct-min=[float]: uniform distribution only, minimum value
 * data-uct-max=[float]: uniform distribution only, maximum value
 * data-uct-mu=[float]: normal distribution only, mean
 * data-uct-sigma=[float]: normal distribution only, standard deviation
 * data-uct-format=[string]: printf-style format string to apply to the sample,
     see [d3-format](https//github.com/d3/d3-format) for help
 * data-uct-fps=[int]: optional, update frequency in "frames" per second

For example, to display an uncertain value with a standard normal distribution,
two decimal places of precision, and update once a second:

```html
<span class=uncertaintext data-uct-distrib=normal data-uct-mu=0 data-uct-sigma=1 data-uct-format=".2f"></span>
```


## Developer Notes

This project uses:
* `yarn` to manage dependencies and define a few helper commands
* `webpack` to bundle up the package and its dependencies as a single native module 
* `jest` to handle testing

To install dependencies: `yarn install`

To run tests: `yarn test`

To build the package: `yarn build` or `yarn build-dev` to make a human readable version.

To view the example page (located at `docs/index.html`) locally: You will need
to host in with a local webserver (so that the `uncertaintext` module works).
The node package [http-server](https://www.npmjs.com/package/http-server),
installed when you run `yarn install`, does the job nicely. The following
command will host the example page at `http://localhost:4000`:

```shell
npx http-server docs -a localhost -p 4000
```

Note that the example page uses a copy of `uncertaintext.js` in the `docs` folder.
If you update uncertaintext, you will need to rebuild the module and copy it to 
that folder to see the changes in the example.

