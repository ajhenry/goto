<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false
  },
  "MD033": false,
  "MD041": false
} -->

<div align="center">

# goto

<!-- [![Downloads][downloads-badge]][releases]
[![License][license-badge]][license] -->

🪄 A cli tool to **magically** goto folders and github repos locally

It sets a default `dev` directory of your choice and
automatically jumps to folders and clones the github repo if needed

[Getting started](#getting-started) •
[Installation](#installation) •
[Configuration](#configuration)

</div>

## Getting Started

<div align="center">
  <img src="./resources/terminal.svg" alt="Output example">
</div>

## Installation

### _Step 1: Install goto_

```sh
npm i -g @ajhenry/goto
```

### _Step 2: Add goto to your shell_

To start using goto, add it to your shell.

Add this to your configuration (usually `~/.zshrc` or `~/.bashrc`):

```sh
eval "$(goto-cli --init)"
```

## How it works

You have to set a default dev directory like `~/dev` or `~/projects`.

After that, once you type in `goto project-name` it will first check if the directory exists.

If the directory does not exist, it will search github and clone the repo.

If that also fails, it will ask if you want to create it.

## Configuration

The following flags are available:

```sh
-> goto -h
USAGE
  $ goto [PATH] [-l] [-p] [-u] [-d] [-i]

FLAGS
  -d, --debug   Enable debug output
  -i, --init    Initializes the goto function for bash
  -l, --list    List all repos
  -p, --path    List the default dev directory
  -u, --update  Update the default dev directory

```
