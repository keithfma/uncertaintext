# Uncertaintext: an experiment in representing uncertainty

This project explores a silly idea: what if we showed uncertain numbers in
documents not as a constant statistic, but as a shifting sample from the
underlying distribution?

The MVP is just a single JS file, `uncertaintext.js`, which applies dynamic formats
to specially-tagged HTML elements when included in a webpage. This repo also
includes a simple example website to show off the basic functionality.

## Developer Notes

Modules can't be served from the filesystem, so to view the example page, run:
`python3 -m http.server example.html`

