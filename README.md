# Release Tool

- [Getting Started](#getting-started)
  - [Requirements](#requirements)
- [CLI](#cli)
- [API](#api)
- [Contributing](#contributing)

## Getting Started

<!-- Copy and paste the cli `help` command -->

```
@lexedwards/release-cli v2.0.0

A library to help automate package versioning, changelogs, and publishing

Usage: release-cli [options] [command]

Options:
  -V, --version      output the version number
  -h, --help         display help for command

Commands:
  release [options]  Create a Changelog and optionally release packages
  lint <commit>      Lint a string representing a commit message to conform to
                     Conventional standards
  help [command]     display help for command

Example Usage:

release-cli release --github # Release to Github
release-cli release --npm # Release to Npm
release-cli release --github --npm # Release to both

Notes:

The command "release-cli" can be exchanged for "npx @lexedwards/release-cli"
```

### Requirements

- Git 2.22+
- NodeJs + Npm

## CLI

## API

## Contributing

Please see the [Contributing](./CONTRIBUTING.md) doc
