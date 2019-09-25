# lazy-start

[![npm version](https://badge.fury.io/js/lazy-start.svg)](https://badge.fury.io/js/lazy-start) ![GitHub top language](https://img.shields.io/github/languages/top/marmelab/lazy-start.svg) ![GitHub contributors](https://img.shields.io/github/contributors/marmelab/lazy-start.svg) ![License](https://img.shields.io/github/license/marmelab/lazy-start.svg) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A lightweight CLI to lazily start or delay a web server the first time it is requested.

## Installation

```bash
npm install --save-dev lazy-start
# or
yarn add -D lazy-start
```

## Usage

```
NAME
    lazy-start - Lazily start a web server the first time it is requested

SYNOPSIS
    lazy-start [<options>] <command>

OPTIONS
    -p, --port      Port to listen (default: 80)
    -d, --detached  Run the command in detached mode (default: false)
    -r, --refresh   Time in seconds before page refresh (default: 10)
    -t, --timeout   Run the command anyway after defined timeout in seconds (default: false)

EXAMPLES
    lazy-start yarn start
    lazy-start -p 3000 react-scripts start
    NODE_ENV=test lazy-start -t 120 cpu-intensive.sh
    lazy-start -t $(shuf -i 60-300 -n 1) run-in-random-between-1-and-5-minutes.py
    DISABLE_LAZY_START=true lazy-start run-immediate
```


## Author

[![Kmaschta](https://avatars2.githubusercontent.com/u/1819833?s=96&amp;v=4)](https://github.com/Kmaschta)     
[Kmaschta](https://github.com/Kmaschta)  

## License

lazy-start is licensed under the [MIT License](LICENSE), courtesy of [Marmelab](http://marmelab.com).

