# Installing Dependencies

## NodeJS

```bash
$ sudo apt-get install npm
$ sudo apt-get install nodejs-legacy

$ wget https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore -O .gitignore
```

## Electron

```bash
$ npm install electron --save-dev
```

## ES6

```bash
$ npm install jspm --save-dev
$ ./node_modules/.bin/jspm init

# Would you like jspm to prefix the jspm package.json properties under jspm? [yes]:
# Enter server baseURL (public folder path) [./]:
# Enter jspm packages folder [./jspm_packages]:
# Enter config file path [./config.js]:
# Configuration file config.js doesn't exist, create it? [yes]:
# Enter client baseURL (public folder URL) [/]:
# Do you wish to use a transpiler? [yes]:
# Which ES6 transpiler would you like to use, Babel, TypeScript or Traceur? [babel]:

$ sed -i -e 's|"github:\*": "jspm_packages/github/\*"|"github:\*": "\./jspm_packages/github/\*"|g' "config.js"
$ sed -i -e 's|"npm:\*": "jspm_packages/npm/\*"|"npm:\*": "\./jspm_packages/npm/\*"|g' "config.js"
```

## Using third-party libraries

```bash
$ npm install big-integer --save
$ npm install jquery --save

$ git submodule add --depth 1 https://github.com/ajaxorg/ace-builds.git ace-builds
$ git submodule add --depth 1 https://github.com/select2/select2.git select2
```

# Launching Application

```bash
$ ./node_modules/.bin/electron .
```
