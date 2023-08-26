# Uncertaintext: uncertain text for uncertain numbers

Uncertaintext provides dynamic styling for measurements with error bars in HTML text.

The core idea is to express probabalistic values as series of random samples
from some underlying distribution, rather than the usual summary statistics.
This "slippery" representation aims to give readers a gut feel for the
uncertainty, and have a little fun doing it.

Uncertaintext is available as a single JS file  which applies dynamic formats
to specially-tagged HTML elements. 

Check out the [example page](https://keithfma.github.io/uncertaintext)  to see
it in action.

## Usage

Include the "packed" [uncertaintext module](https://github.com/keithfma/uncertaintext/blob/main/dist/uncertaintext.js)
in your webpage and run the main function: 

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

| attribute | description |
| ----------| ------------|
| `class=uncertaintext` | Required. Marks the span element for uncertaintext to find and update. |
| `data-uct-distrib=[string]` | Required, name of the distribution to sample from. Currently supported names are: uniform, normal. |
| `data-uct-format=[string]` | Optional. Printf-style format string to apply to the sample. Default is `" .2f"`. See [d3-format](https//github.com/d3/d3-format) for help. |
| `data-uct-fps=[int]` |  Optional. Update frequency in "frames" per second. Default is `5`. |
| `data-uct-min=[float]` | Uniform distribution only. Minimum value. |
| `data-uct-max=[float]` | Uniform distribution only. Maximum value. |
| `data-uct-mu=[float]` | Normal distribution only. Mean. |
| `data-uct-sigma=[float]` | Normal distribution only. Standard deviation. |

For example, to display an uncertain value with a standard normal distribution,
two decimal places of precision, and update once a second:

```html
<span class=uncertaintext data-uct-distrib=normal data-uct-mu=0 data-uct-sigma=1 data-uct-format=".2f" data-uct-fps=1></span>
```


## Developer Notes

This project uses:
* [yarn](https://yarnpkg.com/) to manage dependencies and define a few helper commands
* [webpack](https://webpack.js.org/) to bundle up the package and its dependencies as a single native module 
* [jest](https://jestjs.io/) to handle testing
* [eslint](https://eslint.org/) to check the code for problems

To install dependencies: `yarn install`

To run tests: `yarn test`

To run the linter on all source files: `yarn lint`

To build the package: `yarn build` or `yarn build-dev` to make a human readable version.

To clean up (remove) the existing build: `yarn clean`

To host the example page at localhost:4000: `yarn example`

